import React, { useState, useEffect } from 'react';
import firebase from 'firebase/compat/app';
import { auth, db } from '../firebase';
import { Quiz } from '../types';
import { AttemptsIcon, DeleteIcon } from './icons';

type MyLibraryProps = {
    onStartQuiz: (quiz: Quiz) => void;
};

const MyLibrary = ({ onStartQuiz }: MyLibraryProps) => {
    const [libraryQuizzes, setLibraryQuizzes] = useState<Quiz[]>([]);
    const [loading, setLoading] = useState(true);
    const [swipedQuizId, setSwipedQuizId] = useState<number | null>(null);
    const [touchStart, setTouchStart] = useState<number | null>(null);
    const [touchEnd, setTouchEnd] = useState<number | null>(null);

    const minSwipeDistance = -100; // Swipe threshold to trigger delete

    useEffect(() => {
        const user = auth.currentUser;
        if (user) {
            const libraryRef = db.ref(`users/${user.uid}/library`);
            const listener = (snapshot: firebase.database.DataSnapshot) => {
                const libraryIds = snapshot.exists() ? Object.keys(snapshot.val()) : [];
                
                if (libraryIds.length > 0) {
                    const quizzesRef = db.ref('quizzes');
                    quizzesRef.get().then((quizSnapshot) => {
                        if (quizSnapshot.exists()) {
                            const allQuizzes: Record<string, Quiz> = quizSnapshot.val();
                            const filteredQuizzes = libraryIds
                                .map(id => allQuizzes[id])
                                .filter(quiz => quiz); // Filter out any undefined quizzes
                            setLibraryQuizzes(filteredQuizzes);
                        } else {
                            setLibraryQuizzes([]);
                        }
                        setLoading(false);
                    });
                } else {
                    setLibraryQuizzes([]);
                    setLoading(false);
                }
            };
            libraryRef.on('value', listener);
            return () => libraryRef.off('value', listener);
        } else {
            setLoading(false);
        }
    }, []);

    const handleRemoveFromLibrary = async (quizId: number) => {
        const user = auth.currentUser;
        if (!user) return;
        
        const libraryRef = db.ref(`users/${user.uid}/library/${quizId}`);
        await libraryRef.remove();
    };

    const onTouchStart = (quizId: number, clientX: number) => {
        setTouchEnd(null);
        setTouchStart(clientX);
        setSwipedQuizId(quizId);
    };

    const onTouchMove = (clientX: number) => {
        if (touchStart === null || swipedQuizId === null) return;
        setTouchEnd(clientX);
    };

    const resetSwipeState = () => {
        setTouchStart(null);
        setTouchEnd(null);
        setSwipedQuizId(null);
    };

    const onTouchEnd = () => {
        if (!touchStart || !touchEnd || swipedQuizId === null) {
            resetSwipeState();
            return;
        }

        const distance = touchEnd - touchStart;

        if (distance < minSwipeDistance) {
            handleRemoveFromLibrary(swipedQuizId);
        }
        
        resetSwipeState();
    };

    if (loading) {
        return <div style={{ textAlign: 'center', marginTop: '2rem' }}>Loading your library...</div>;
    }

    if (libraryQuizzes.length === 0) {
        return (
            <div style={{ textAlign: 'center', marginTop: '2rem' }}>
                <h3>Your Library is Empty</h3>
                <p>Add quizzes from the Home page to see them here.</p>
            </div>
        );
    }
    
    return (
        <section className="quiz-list-section">
            <div className="quiz-list">
                {libraryQuizzes.map(quiz => {
                    const isBeingSwiped = swipedQuizId === quiz.id;
                    const swipeDistance = isBeingSwiped && touchStart && touchEnd ? touchEnd - touchStart : 0;
                    const cardTranslateX = Math.min(0, swipeDistance);
                    const isResetting = !isBeingSwiped && swipedQuizId === null;

                    return (
                        <div className="swipe-container" key={quiz.id}>
                            <div className="delete-action">
                                <DeleteIcon />
                                <span>Delete</span>
                            </div>
                            <div 
                                className={`quiz-card ${isResetting ? 'resetting' : ''}`}
                                onTouchStart={(e) => onTouchStart(quiz.id, e.targetTouches[0].clientX)}
                                onTouchMove={(e) => onTouchMove(e.targetTouches[0].clientX)}
                                onTouchEnd={onTouchEnd}
                                onMouseDown={(e) => onTouchStart(quiz.id, e.clientX)}
                                onMouseMove={(e) => { if (e.buttons === 1) onTouchMove(e.clientX); }}
                                onMouseUp={onTouchEnd}
                                onMouseLeave={swipedQuizId === quiz.id ? onTouchEnd : undefined}
                                style={{ transform: `translateX(${cardTranslateX}px)` }}
                            >
                                <img src={quiz.image} alt={quiz.title} className="quiz-card-image" />
                                <div className="quiz-card-content">
                                    <h3 className="quiz-card-title">{quiz.title}</h3>
                                    <p className="quiz-card-description">{quiz.description}</p>
                                    <div className="quiz-card-footer">
                                        <div className="quiz-card-stats">
                                            <AttemptsIcon />
                                            <span>{quiz.attempts.toLocaleString()}</span>
                                        </div>
                                        <div className="quiz-card-actions">
                                            <button type="button" className="quiz-card-button btn-primary" onClick={() => onStartQuiz(quiz)}>
                                                Start
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </section>
    );
};

export default MyLibrary;