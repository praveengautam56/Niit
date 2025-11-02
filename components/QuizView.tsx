import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { Quiz, Question } from '../types';
import { auth, db } from '../firebase';


type QuizViewProps = {
    quiz: Quiz;
    onComplete: () => void;
};

const TIME_PER_QUESTION = 60; // 60 seconds

const QuizView = ({ quiz, onComplete }: QuizViewProps) => {
    const questions = useMemo(() => quiz.questions || [], [quiz.questions]);
    
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
    const [isAnswered, setIsAnswered] = useState(false);
    const [score, setScore] = useState(0);
    const [showResults, setShowResults] = useState(false);
    const [timeLeft, setTimeLeft] = useState(TIME_PER_QUESTION);
    const [isScoreSaved, setIsScoreSaved] = useState(false);

    const currentQuestion: Question = questions[currentQuestionIndex];

    const handleNext = useCallback(() => {
        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(prev => prev + 1);
            setIsAnswered(false);
            setSelectedAnswer(null);
            setTimeLeft(TIME_PER_QUESTION);
        } else {
            setShowResults(true);
        }
    }, [currentQuestionIndex, questions.length]);

    const handleSelectAnswer = (optionIndex: number) => {
        if (isAnswered) return;

        setIsAnswered(true);
        setSelectedAnswer(optionIndex);

        if (optionIndex === currentQuestion.correctAnswerIndex) {
            setScore(prevScore => prevScore + 1);
        }
    };

    useEffect(() => {
        if (isAnswered || showResults || !currentQuestion) {
            return;
        }

        if (timeLeft === 0) {
            setIsAnswered(true); // Mark as answered to show the correct option
            const timeoutId = setTimeout(handleNext, 2500); // Wait to show the answer
            return () => clearTimeout(timeoutId);
        }

        const timerId = setInterval(() => {
            setTimeLeft(prevTime => prevTime - 1);
        }, 1000);

        return () => clearInterval(timerId);
    }, [timeLeft, isAnswered, showResults, currentQuestion, handleNext]);
    
    useEffect(() => {
        // This effect runs once when the results are shown to save the score.
        if (showResults && !isScoreSaved && score > 0) {
          const saveUserScore = async () => {
            const user = auth.currentUser;
            if (user) {
              const userRef = db.ref(`users/${user.uid}`);
              const userSnapshot = await userRef.get();
              const userData = userSnapshot.val();
              const userName = userData?.name || 'Anonymous';
              
              const leaderboardRef = db.ref(`leaderboard/${user.uid}`);
              
              // Use a transaction to safely update the score
              leaderboardRef.transaction((currentData) => {
                if (currentData) {
                  // User already has a score, update it
                  return { 
                    ...currentData,
                    totalScore: (currentData.totalScore || 0) + score 
                  };
                }
                // First time user, create a new entry
                return { 
                  name: userName, 
                  totalScore: score 
                };
              });
              setIsScoreSaved(true);
            }
          };
          saveUserScore();
        }
    }, [showResults, score, isScoreSaved]);

    const progressPercentage = useMemo(() => {
        if (showResults) return 100;
        if (!questions.length) return 0;
        return ((currentQuestionIndex + 1) / questions.length) * 100;
    }, [currentQuestionIndex, questions.length, showResults]);


    if (showResults) {
        return (
            <div className="quiz-view-container">
                <main className="quiz-view-main results-container">
                    <h2>Quiz Complete!</h2>
                    <p className="score">{score} / {questions.length}</p>
                    <p className="score-text">You have completed the quiz.</p>
                    <button onClick={onComplete} className="quiz-card-button btn-primary">
                        Back to Dashboard
                    </button>
                </main>
            </div>
        )
    }

    if (!currentQuestion) {
        return (
             <div className="quiz-view-container">
                <header className="quiz-view-header">
                    <button className="exit-quiz-btn" onClick={onComplete}>Exit</button>
                    <h2>{quiz.title}</h2>
                </header>
                <main className="quiz-view-main" style={{ textAlign: 'center', paddingTop: '2rem' }}>
                    <p>This quiz currently has no questions.</p>
                </main>
            </div>
        )
    }

    return (
        <div className="quiz-view-container">
            <header className="quiz-view-header">
                <div className="header-top-row">
                    <button className="exit-quiz-btn" onClick={onComplete}>Exit</button>
                    <h2>{quiz.title}</h2>
                    <div className={`timer-display ${timeLeft <= 10 ? 'warning' : ''}`}>
                        <span>{String(Math.floor(timeLeft / 60)).padStart(2, '0')}:{String(timeLeft % 60).padStart(2, '0')}</span>
                    </div>
                </div>
                <div className="progress-bar-container">
                    <div className="progress-bar" style={{ width: `${progressPercentage}%` }}></div>
                </div>
            </header>
            <main className="quiz-view-main">
                <div className="question-container">
                    <h3>{currentQuestionIndex + 1}. {currentQuestion.question}</h3>
                    <div className="options-container">
                        {currentQuestion.options.map((option, index) => {
                            let buttonClass = 'option-button';
                            if (isAnswered) {
                                if (index === currentQuestion.correctAnswerIndex) {
                                    buttonClass += ' correct';
                                } else if (index === selectedAnswer) {
                                    buttonClass += ' incorrect';
                                }
                            }
                            return (
                                <button
                                    key={index}
                                    className={buttonClass}
                                    onClick={() => handleSelectAnswer(index)}
                                    disabled={isAnswered}
                                >
                                    {option}
                                </button>
                            );
                        })}
                    </div>
                    {isAnswered && currentQuestion.explanation && (
                        <div className="explanation-container">
                            <h4>Explanation</h4>
                            <p>{currentQuestion.explanation}</p>
                        </div>
                    )}
                </div>
            </main>
            <footer className="quiz-view-footer">
                <div className="quiz-navigation">
                     {isAnswered && (
                        <button
                            className="nav-btn next-btn"
                            onClick={handleNext}
                        >
                            {currentQuestionIndex < questions.length - 1 ? 'Next Question' : 'Finish Quiz'}
                        </button>
                    )}
                </div>
            </footer>
        </div>
    );
};

export default QuizView;