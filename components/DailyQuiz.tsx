import React, { useState, useEffect } from 'react';
import firebase from 'firebase/compat/app';
import { db } from '../firebase';
import { Quiz } from '../types';
import { AttemptsIcon } from './icons';

type DailyQuizProps = {
    onStartQuiz: (quiz: Quiz) => void;
};

const DailyQuiz = ({ onStartQuiz }: DailyQuizProps) => {
    const [dailyQuizzes, setDailyQuizzes] = useState<Quiz[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const dailyQuizzesRef = db.ref('dailyQuizzes');
        
        const listener = (snapshot: firebase.database.DataSnapshot) => {
            const dailyIds = snapshot.exists() ? Object.keys(snapshot.val()) : [];
            
            if (dailyIds.length > 0) {
                const quizzesRef = db.ref('quizzes');
                quizzesRef.get().then((quizSnapshot) => {
                    if (quizSnapshot.exists()) {
                        const allQuizzes: Record<string, Quiz> = quizSnapshot.val();
                        const filteredQuizzes = dailyIds
                            .map(id => allQuizzes[id])
                            .filter(quiz => quiz); // Filter out any undefined quizzes
                        setDailyQuizzes(filteredQuizzes);
                    } else {
                        setDailyQuizzes([]);
                    }
                    setLoading(false);
                });
            } else {
                setDailyQuizzes([]);
                setLoading(false);
            }
        };

        dailyQuizzesRef.on('value', listener);
        return () => dailyQuizzesRef.off('value', listener);
    }, []);

    if (loading) {
        return <div style={{ textAlign: 'center', marginTop: '2rem' }}>Loading Daily Quizzes...</div>;
    }

    if (dailyQuizzes.length === 0) {
        return (
            <div style={{ textAlign: 'center', marginTop: '2rem' }}>
                <h3>No Daily Quiz Available Today</h3>
                <p>Check back later for a new challenge!</p>
            </div>
        );
    }
    
    return (
        <section className="quiz-list-section">
             <h2 className="section-title">Daily Quizzes</h2>
             <div className="quiz-list">
                {dailyQuizzes.map(quiz => (
                    <div className="quiz-card" key={quiz.id}>
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
                ))}
            </div>
        </section>
    );
};

export default DailyQuiz;