import React, { useState, useEffect } from 'react';
import firebase from 'firebase/compat/app';
import { db } from '../firebase';
import { Quiz, Question } from '../types';
import { EditIcon, DeleteIcon, PlusIcon, MinusIcon, QuestionsListIcon } from './icons';

interface HomeSlide {
  id: string;
  img: string;
  title: string;
}

interface Short {
    id: string;
    embedCode: string;
}

interface Video {
    id: string;
    title: string;
    embedCode: string;
}

const QuestionEditor = ({ quiz, onBack }: { quiz: Quiz, onBack: () => void; }) => {
    const [questions, setQuestions] = useState<Question[]>([]);
    
    useEffect(() => {
        // If the quiz has no questions, start with one blank one.
        if (!quiz.questions || quiz.questions.length === 0) {
            setQuestions([{ question: '', options: ['', ''], correctAnswerIndex: 0, explanation: '' }]);
        } else {
            // Ensure all existing questions have an explanation property for consistency
            const questionsWithExplanation = quiz.questions.map(q => ({
                ...q,
                explanation: q.explanation || ''
            }));
            setQuestions(questionsWithExplanation);
        }
    }, [quiz]);

    const handleQuestionTextChange = (qIndex: number, value: string) => {
        const updatedQuestions = [...questions];
        updatedQuestions[qIndex].question = value;
        setQuestions(updatedQuestions);
    };

    const handleOptionChange = (qIndex: number, oIndex: number, value: string) => {
        const updatedQuestions = [...questions];
        updatedQuestions[qIndex].options[oIndex] = value;
        setQuestions(updatedQuestions);
    };

    const handleCorrectAnswerChange = (qIndex: number, oIndex: number) => {
        const updatedQuestions = [...questions];
        updatedQuestions[qIndex].correctAnswerIndex = oIndex;
        setQuestions(updatedQuestions);
    };

    const handleExplanationChange = (qIndex: number, value: string) => {
        const updatedQuestions = [...questions];
        updatedQuestions[qIndex].explanation = value;
        setQuestions(updatedQuestions);
    };

    const addQuestion = () => {
        setQuestions(prev => [...prev, { question: '', options: ['', ''], correctAnswerIndex: 0, explanation: '' }]);
    };
    
    const removeQuestion = (qIndex: number) => {
        if (questions.length <= 1) return; // Must have at least one question
        const updatedQuestions = questions.filter((_, index) => index !== qIndex);
        setQuestions(updatedQuestions);
    };

    const addOption = (qIndex: number) => {
        const updatedQuestions = [...questions];
        updatedQuestions[qIndex].options.push('');
        setQuestions(updatedQuestions);
    };
    
    const removeOption = (qIndex: number, oIndex: number) => {
        const updatedQuestions = [...questions];
        if (updatedQuestions[qIndex].options.length <= 2) return; // Must have at least two options
        
        if (updatedQuestions[qIndex].correctAnswerIndex === oIndex) {
            updatedQuestions[qIndex].correctAnswerIndex = 0;
        } else if (updatedQuestions[qIndex].correctAnswerIndex > oIndex) {
            updatedQuestions[qIndex].correctAnswerIndex -= 1;
        }

        updatedQuestions[qIndex].options = updatedQuestions[qIndex].options.filter((_, index) => index !== oIndex);
        setQuestions(updatedQuestions);
    };

    const handleSaveChanges = async () => {
        for (const q of questions) {
            if (!q.question.trim() || q.options.some(opt => !opt.trim())) {
                alert("Please fill out all question and option fields before saving.");
                return;
            }
        }

        try {
            await db.ref(`quizzes/${quiz.id}`).update({ questions });
            alert("Questions saved successfully!");
            onBack();
        } catch (error) {
            console.error("Error saving questions: ", error);
            alert("Failed to save questions. See console for details.");
        }
    };

    return (
        <div className="admin-section-content" style={{padding: '1rem 0'}}>
            <div style={{display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem'}}>
                <button onClick={onBack} className="back-button" style={{position: 'static'}}>&larr;</button>
                <h3 style={{margin: 0}}>Editing Questions for: <strong>{quiz.title}</strong></h3>
            </div>
            
            {questions.map((q, qIndex) => (
                <div className="question-block" key={qIndex}>
                    <div className="question-header">
                        <label>Question {qIndex + 1}</label>
                        {questions.length > 1 && (
                            <button type="button" className="remove-btn" onClick={() => removeQuestion(qIndex)}>Remove Question</button>
                        )}
                    </div>
                    <div className="input-group">
                        <input type="text" placeholder="Enter your question" value={q.question} onChange={(e) => handleQuestionTextChange(qIndex, e.target.value)} />
                    </div>
                    <div className="options-list">
                        {q.options.map((opt, oIndex) => (
                            <div className="option-input-group" key={oIndex}>
                                <input type="radio" name={`correct_answer_${qIndex}`} checked={q.correctAnswerIndex === oIndex} onChange={() => handleCorrectAnswerChange(qIndex, oIndex)} />
                                <input type="text" placeholder={`Option ${oIndex + 1}`} value={opt} onChange={(e) => handleOptionChange(qIndex, oIndex, e.target.value)} />
                                {q.options.length > 2 && (
                                    <button type="button" className="remove-btn" onClick={() => removeOption(qIndex, oIndex)}>&times;</button>
                                )}
                            </div>
                        ))}
                    </div>
                    <div className="input-group" style={{ marginTop: '1rem' }}>
                        <textarea
                            placeholder="Explanation for the correct answer (optional)"
                            value={q.explanation || ''}
                            onChange={(e) => handleExplanationChange(qIndex, e.target.value)}
                        />
                    </div>
                    <div className="question-actions">
                        <button type="button" className="add-btn" onClick={() => addOption(qIndex)}>Add Option</button>
                    </div>
                </div>
            ))}

            <div className="form-actions">
                <button type="button" className="add-btn" onClick={addQuestion}>Add Another Question</button>
                <button type="button" className="save-quiz-btn" onClick={handleSaveChanges}>
                    Save All Questions
                </button>
            </div>
        </div>
    );
};


const AdminPanel = () => {
    const [view, setView] = useState<'list' | 'questions'>('list');
    const [quizForQuestions, setQuizForQuestions] = useState<Quiz | null>(null);

    // Quiz states
    const [allQuizzes, setAllQuizzes] = useState<Record<string, Quiz>>({});
    const [homeQuizzes, setHomeQuizzes] = useState<Record<string, boolean>>({});
    const [dailyQuizzes, setDailyQuizzes] = useState<Record<string, boolean>>({});
    const [editingQuizMetaId, setEditingQuizMetaId] = useState<number | null>(null);
    const DEFAULT_QUIZ_IMAGE_URL = "https://images.pexels.com/photos/207692/pexels-photo-207692.jpeg?auto=compress&cs=tinysrgb&w=600";
    const [quizMeta, setQuizMeta] = useState({ title: '', description: '', image: '' });
    
    // Video states
    const [videos, setVideos] = useState<Video[]>([]);
    const [editingVideoId, setEditingVideoId] = useState<string | null>(null);
    const [videoMeta, setVideoMeta] = useState({ title: '', embedCode: '' });

    // Shorts states
    const [shorts, setShorts] = useState<Short[]>([]);
    const [editingShortId, setEditingShortId] = useState<string | null>(null);
    const [shortMeta, setShortMeta] = useState({ embedCode: '' });

    // Other admin states
    const [notificationMessage, setNotificationMessage] = useState('');
    const [homeSlides, setHomeSlides] = useState<HomeSlide[]>([]);
    const [editingSlideId, setEditingSlideId] = useState<string | null>(null);
    const [slideMeta, setSlideMeta] = useState({ title: '', img: '' });
    const [collapsedSections, setCollapsedSections] = useState({
        createForm: true, allQuizzes: true, organization: true,
        homeBanners: true, notifications: true, manageVideos: true, manageShorts: true,
    });

    useEffect(() => {
        const quizRef = db.ref('quizzes');
        const dailyQuizzesRef = db.ref('dailyQuizzes');
        const homeQuizzesRef = db.ref('homeQuizzes');
        const homeSliderRef = db.ref('homeSlider');
        const videosRef = db.ref('videos');
        const shortsRef = db.ref('shorts');
    
        const quizListener = (snapshot: firebase.database.DataSnapshot) => setAllQuizzes(snapshot.exists() ? snapshot.val() : {});
        const dailyListener = (snapshot: firebase.database.DataSnapshot) => setDailyQuizzes(snapshot.exists() ? snapshot.val() : {});
        const homeListener = (snapshot: firebase.database.DataSnapshot) => setHomeQuizzes(snapshot.exists() ? snapshot.val() : {});
        
        const sliderListener = (snapshot: firebase.database.DataSnapshot) => {
            const data = snapshot.exists() ? snapshot.val() : {};
            const slidesArray = Object.entries(data).map(([id, val]) => ({ id, ...(val as Omit<HomeSlide, 'id'>) }));
            setHomeSlides(slidesArray);
        };
        
        const videosListener = (snapshot: firebase.database.DataSnapshot) => {
            const data = snapshot.exists() ? snapshot.val() : {};
            const videosArray = Object.entries(data).map(([id, val]) => ({ id, ...(val as Omit<Video, 'id'>) }));
            setVideos(videosArray);
        };
    
        const shortsListener = (snapshot: firebase.database.DataSnapshot) => {
            const data = snapshot.exists() ? snapshot.val() : {};
            const shortsArray = Object.entries(data).map(([id, val]) => ({ id, ...(val as Omit<Short, 'id'>) }));
            setShorts(shortsArray);
        };
    
        quizRef.on('value', quizListener);
        dailyQuizzesRef.on('value', dailyListener);
        homeQuizzesRef.on('value', homeListener);
        homeSliderRef.on('value', sliderListener);
        videosRef.on('value', videosListener);
        shortsRef.on('value', shortsListener);
    
        return () => {
            quizRef.off('value', quizListener);
            dailyQuizzesRef.off('value', dailyListener);
            homeQuizzesRef.off('value', homeListener);
            homeSliderRef.off('value', sliderListener);
            videosRef.off('value', videosListener);
            shortsRef.off('value', shortsListener);
        };
    }, []);
    
    const toggleSection = (section: keyof typeof collapsedSections) => {
        setCollapsedSections(prev => ({ ...prev, [section]: !prev[section] }));
    };
    
    // Quiz Management
    const handleQuizMetaChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setQuizMeta(prev => ({ ...prev, [name]: value }));
    };
    
    const cancelMetaEdit = () => {
        setEditingQuizMetaId(null);
        setQuizMeta({ title: '', description: '', image: '' });
    };

    const handleSaveOrUpdateQuizMeta = async () => {
        if (!quizMeta.title || !quizMeta.description) {
            alert("Please fill out the quiz title and description."); return;
        }

        if (editingQuizMetaId) {
            const quizToUpdate = {
                title: quizMeta.title, description: quizMeta.description,
                image: quizMeta.image.trim() || allQuizzes[editingQuizMetaId].image || DEFAULT_QUIZ_IMAGE_URL,
            };
            await db.ref(`quizzes/${editingQuizMetaId}`).update(quizToUpdate);
            alert("Quiz info updated successfully!");
        } else {
            const nextId = Date.now(); // Simple unique ID
            const quizToSave = {
                id: nextId, title: quizMeta.title, description: quizMeta.description,
                image: quizMeta.image.trim() || DEFAULT_QUIZ_IMAGE_URL, questions: [], attempts: 0
            };
            await db.ref(`quizzes/${nextId}`).set(quizToSave);
            alert("Quiz created successfully! Now add some questions.");
        }
        cancelMetaEdit();
    };

    const handleEditQuizMeta = (quizId: number) => {
        const quizToEdit = allQuizzes[quizId];
        if (quizToEdit) {
            setEditingQuizMetaId(quizId);
            setQuizMeta({ title: quizToEdit.title, description: quizToEdit.description, image: quizToEdit.image || '' });
            setCollapsedSections(prev => ({...prev, createForm: false}));
            document.querySelector('.admin-section.create-quiz-form')?.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const handleManageQuestions = (quiz: Quiz) => {
        setQuizForQuestions(quiz);
        setView('questions');
    };
    
    const handleDeleteQuiz = async (quizId: number) => {
        if (window.confirm(`Are you sure you want to delete this quiz? This action cannot be undone.`)) {
            const updates: Record<string, null> = { [`/quizzes/${quizId}`]: null };
            if (dailyQuizzes[quizId]) updates[`/dailyQuizzes/${quizId}`] = null;
            if (homeQuizzes[quizId]) updates[`/homeQuizzes/${quizId}`] = null;
            await db.ref().update(updates);
            if (editingQuizMetaId === quizId) cancelMetaEdit();
            alert("Quiz deleted successfully.");
        }
    };
    
    // Shorts Management
    const handleShortMetaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => setShortMeta({ embedCode: e.target.value });
    const cancelShortEdit = () => { setEditingShortId(null); setShortMeta({ embedCode: '' }); };

    const handleSaveOrUpdateShort = async () => {
        if (!shortMeta.embedCode.trim()) { alert("Please provide an embed code."); return; }
        try {
            if (editingShortId) {
                await db.ref(`shorts/${editingShortId}`).update(shortMeta);
                alert("Short updated successfully!");
            } else {
                await db.ref('shorts').push(shortMeta);
                alert("Short added successfully!");
            }
            cancelShortEdit();
        } catch (error) { console.error("Error saving short:", error); alert("Failed to save short."); }
    };
    
    const handleEditShort = (short: Short) => {
        setEditingShortId(short.id);
        setShortMeta({ embedCode: short.embedCode });
        setCollapsedSections(prev => ({ ...prev, manageShorts: false }));
        document.querySelector('.admin-section.manage-shorts')?.scrollIntoView({ behavior: 'smooth' });
    };

    const handleDeleteShort = async (id: string) => {
        if (window.confirm("Are you sure you want to delete this short?")) {
            await db.ref(`shorts/${id}`).remove();
            alert("Short deleted successfully.");
        }
    };

    // Video Management
    const handleVideoMetaChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setVideoMeta(prev => ({ ...prev, [name]: value }));
    };
    const cancelVideoEdit = () => { setEditingVideoId(null); setVideoMeta({ title: '', embedCode: '' }); };

    const handleSaveOrUpdateVideo = async () => {
        if (!videoMeta.title.trim() || !videoMeta.embedCode.trim()) { alert("Please provide a title and embed code."); return; }
        try {
            if (editingVideoId) {
                await db.ref(`videos/${editingVideoId}`).update(videoMeta);
                alert("Video updated successfully!");
            } else {
                await db.ref('videos').push(videoMeta);
                alert("Video added successfully!");
            }
            cancelVideoEdit();
        } catch (error) { console.error("Error saving video:", error); alert("Failed to save video."); }
    };

    const handleEditVideo = (video: Video) => {
        setEditingVideoId(video.id);
        setVideoMeta({ title: video.title, embedCode: video.embedCode });
        setCollapsedSections(prev => ({ ...prev, manageVideos: false }));
        document.querySelector('.admin-section.manage-videos')?.scrollIntoView({ behavior: 'smooth' });
    };

    const handleDeleteVideo = async (id: string) => {
        if (window.confirm("Are you sure you want to delete this video?")) {
            await db.ref(`videos/${id}`).remove();
            alert("Video deleted successfully.");
        }
    };

    // Other Admin Functions
    const handleSendNotification = async () => {
        if (notificationMessage.trim() === '') { alert("Please enter a notification message."); return; }
        await db.ref('notifications').push({ message: notificationMessage, timestamp: Date.now() });
        alert("Notification sent successfully!");
        setNotificationMessage('');
    };
    
    const handleToggleDaily = async (quizId: number) => {
        const ref = db.ref(`dailyQuizzes/${quizId}`);
        !!dailyQuizzes[quizId] ? await ref.remove() : await ref.set(true);
    };

    const handleToggleHome = async (quizId: number) => {
        const ref = db.ref(`homeQuizzes/${quizId}`);
        !!homeQuizzes[quizId] ? await ref.remove() : await ref.set(true);
    };
    
    const handleSlideMetaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setSlideMeta(prev => ({ ...prev, [name]: value }));
    };

    const cancelSlideEdit = () => { setEditingSlideId(null); setSlideMeta({ title: '', img: '' }); };

    const handleSaveOrUpdateSlide = async () => {
        if (!slideMeta.title || !slideMeta.img) { alert("Please fill out the banner title and image URL."); return; }
        if (editingSlideId) {
            await db.ref(`homeSlider/${editingSlideId}`).update(slideMeta);
            alert("Banner updated successfully!");
        } else {
            await db.ref('homeSlider').push(slideMeta);
            alert("Banner added successfully!");
        }
        cancelSlideEdit();
    };

    const handleEditSlide = (slide: HomeSlide) => {
        setEditingSlideId(slide.id);
        setSlideMeta({ title: slide.title, img: slide.img });
        setCollapsedSections(prev => ({ ...prev, homeBanners: false }));
        document.querySelector('.admin-section.home-banners-form')?.scrollIntoView({ behavior: 'smooth' });
    };

    const handleDeleteSlide = async (slideId: string) => {
        if (window.confirm("Are you sure you want to delete this banner?")) {
            await db.ref(`homeSlider/${slideId}`).remove();
            alert("Banner deleted successfully.");
        }
    };

    if (view === 'questions' && quizForQuestions) {
        return <QuestionEditor quiz={quizForQuestions} onBack={() => setView('list')} />;
    }
    
    return (
        <div className="admin-panel">
            {/* Manage Shorts */}
            <div className="admin-section manage-shorts">
                <div className="admin-section-header" onClick={() => toggleSection('manageShorts')}>
                     <h3>Manage Shorts</h3>
                     <button className="section-toggle-btn">
                        {collapsedSections.manageShorts ? <PlusIcon /> : <MinusIcon />}
                    </button>
                </div>
                {!collapsedSections.manageShorts && (
                    <div className="admin-section-content">
                        <h4>{editingShortId ? 'Edit Short' : 'Add New Short'}</h4>
                        <textarea placeholder="Paste video embed code here" value={shortMeta.embedCode} onChange={handleShortMetaChange}></textarea>
                        <div className="form-actions" style={{justifyContent: 'flex-end', paddingTop: '1rem', borderTop: 'none'}}>
                           {editingShortId && <button className="cancel-edit-btn" onClick={cancelShortEdit} style={{ marginRight: '1rem' }}>Cancel</button>}
                            <button className="save-quiz-btn" onClick={handleSaveOrUpdateShort}>{editingShortId ? 'Update Short' : 'Add Short'}</button>
                        </div>
                        <hr style={{ margin: '1.5rem 0' }} />
                        <h4>Existing Shorts</h4>
                        <div className="video-list-container">
                            {shorts.map((short) => (
                                <div key={short.id} className="quiz-list-item-admin">
                                    <div className="video-mini-card"><span>{short.embedCode}</span></div>
                                    <div className="quiz-item-actions">
                                        <button className="icon-button edit-btn-icon" onClick={() => handleEditShort(short)}><EditIcon /></button>
                                        <button className="icon-button delete-btn-icon" onClick={() => handleDeleteShort(short.id)}><DeleteIcon /></button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
            
            {/* Manage Videos */}
            <div className="admin-section manage-videos">
                <div className="admin-section-header" onClick={() => toggleSection('manageVideos')}>
                     <h3>Manage Videos</h3>
                     <button className="section-toggle-btn">
                        {collapsedSections.manageVideos ? <PlusIcon /> : <MinusIcon />}
                    </button>
                </div>
                {!collapsedSections.manageVideos && (
                    <div className="admin-section-content">
                        <h4>{editingVideoId ? 'Edit Video' : 'Add New Video'}</h4>
                        <input type="text" name="title" placeholder="Video Title" value={videoMeta.title} onChange={handleVideoMetaChange} style={{marginBottom: '0.8rem'}} />
                        <textarea name="embedCode" placeholder="Paste video embed code here" value={videoMeta.embedCode} onChange={handleVideoMetaChange}></textarea>
                        <div className="form-actions" style={{justifyContent: 'flex-end', paddingTop: '1rem', borderTop: 'none'}}>
                           {editingVideoId && <button className="cancel-edit-btn" onClick={cancelVideoEdit} style={{ marginRight: '1rem' }}>Cancel</button>}
                            <button className="save-quiz-btn" onClick={handleSaveOrUpdateVideo}>{editingVideoId ? 'Update Video' : 'Add Video'}</button>
                        </div>
                        <hr style={{ margin: '1.5rem 0' }} />
                        <h4>Existing Videos</h4>
                        <div className="video-list-container">
                            {videos.map((video) => (
                                <div key={video.id} className="quiz-list-item-admin">
                                    <div className="video-mini-card"><span>{video.title}</span></div>
                                    <div className="quiz-item-actions">
                                        <button className="icon-button edit-btn-icon" onClick={() => handleEditVideo(video)}><EditIcon /></button>
                                        <button className="icon-button delete-btn-icon" onClick={() => handleDeleteVideo(video.id)}><DeleteIcon /></button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
            
            {/* Quiz Management Sections */}
            <div className="admin-section create-quiz-form">
                <div className="admin-section-header" onClick={() => toggleSection('createForm')}>
                     <h3>{editingQuizMetaId ? 'Edit Quiz Info' : 'Create New Quiz'}</h3>
                     <button className="section-toggle-btn">{collapsedSections.createForm ? <PlusIcon /> : <MinusIcon />}</button>
                </div>
                {!collapsedSections.createForm && (
                    <div className="admin-section-content">
                        <div className="input-group"><input type="text" name="title" placeholder="Quiz Title" value={quizMeta.title} onChange={handleQuizMetaChange} /></div>
                        <div className="input-group"><textarea name="description" placeholder="Quiz Description" value={quizMeta.description} onChange={handleQuizMetaChange}></textarea></div>
                        <div className="input-group"><input type="text" name="image" placeholder="Image URL (Optional)" value={quizMeta.image} onChange={handleQuizMetaChange} /></div>
                        <div className="form-actions" style={{justifyContent: 'flex-end'}}>
                            <div>
                                {editingQuizMetaId && <button type="button" className="cancel-edit-btn" onClick={cancelMetaEdit}>Cancel</button>}
                                <button type="button" className="save-quiz-btn" onClick={handleSaveOrUpdateQuizMeta}>{editingQuizMetaId ? 'Update Info' : 'Save Quiz'}</button>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <div className="admin-section all-quizzes">
                <div className="admin-section-header" onClick={() => toggleSection('allQuizzes')}>
                    <h3>All Quizzes</h3>
                    <button className="section-toggle-btn">{collapsedSections.allQuizzes ? <PlusIcon /> : <MinusIcon />}</button>
                </div>
                {!collapsedSections.allQuizzes && (
                    <div className="admin-section-content">
                        <div className="quiz-list-container">
                        {Object.values(allQuizzes).length > 0 ? Object.values(allQuizzes).map((quiz: Quiz) => (
                            <div key={quiz.id} className="quiz-list-item-admin">
                                <div className="quiz-mini-card"><img src={quiz.image} alt={quiz.title} /><span>{quiz.title}</span></div>
                                <div className="quiz-item-actions">
                                    <button className="icon-button edit-btn-icon" onClick={() => handleEditQuizMeta(quiz.id)}><EditIcon /></button>
                                    <button className="icon-button questions-btn-icon" onClick={() => handleManageQuestions(quiz)}><QuestionsListIcon /></button>
                                    <button className="icon-button delete-btn-icon" onClick={() => handleDeleteQuiz(quiz.id)}><DeleteIcon /></button>
                                </div>
                            </div>
                        )) : <p>No quizzes created yet.</p>}
                        </div>
                    </div>
                )}
            </div>

            <div className="admin-section organization">
                 <div className="admin-section-header" onClick={() => toggleSection('organization')}>
                    <h3>Home / Daily Active</h3>
                     <button className="section-toggle-btn">{collapsedSections.organization ? <PlusIcon /> : <MinusIcon />}</button>
                </div>
                {!collapsedSections.organization && (
                    <div className="admin-section-content">
                        <h4>Daily Quizzes</h4>
                        <div className="organization-list-container">
                            {Object.values(allQuizzes).map((quiz: Quiz) => (
                                <div key={quiz.id} className="organization-list-item">
                                    <div className="organization-quiz-info"><img src={quiz.image} alt={quiz.title} /><span>{quiz.title}</span></div>
                                    <label className="toggle-switch"><input type="checkbox" checked={!!dailyQuizzes[quiz.id]} onChange={() => handleToggleDaily(quiz.id)} /><span className="toggle-slider"></span></label>
                                </div>
                            ))}
                        </div>
                         <h4 style={{marginTop: '1.5rem'}}>Home Page Quizzes</h4>
                         <div className="organization-list-container">
                            {Object.values(allQuizzes).map((quiz: Quiz) => (
                                <div key={quiz.id} className="organization-list-item">
                                    <div className="organization-quiz-info"><img src={quiz.image} alt={quiz.title} /><span>{quiz.title}</span></div>
                                    <label className="toggle-switch"><input type="checkbox" checked={!!homeQuizzes[quiz.id]} onChange={() => handleToggleHome(quiz.id)} /><span className="toggle-slider"></span></label>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            <div className="admin-section home-banners-form">
                <div className="admin-section-header" onClick={() => toggleSection('homeBanners')}>
                    <h3>Home Page Banners</h3>
                    <button className="section-toggle-btn">{collapsedSections.homeBanners ? <PlusIcon /> : <MinusIcon />}</button>
                </div>
                {!collapsedSections.homeBanners && (
                    <div className="admin-section-content">
                        <div className="input-group"><input type="text" name="title" placeholder="Banner Title" value={slideMeta.title} onChange={handleSlideMetaChange} /></div>
                        <div className="input-group"><input type="text" name="img" placeholder="Image URL" value={slideMeta.img} onChange={handleSlideMetaChange} /></div>
                        <div className="form-actions" style={{ justifyContent: 'flex-end', paddingTop: '1rem', borderTop: 'none' }}>
                            {editingSlideId && <button className="cancel-edit-btn" onClick={cancelSlideEdit} style={{ marginRight: '1rem' }}>Cancel</button>}
                            <button className="save-quiz-btn" onClick={handleSaveOrUpdateSlide}>{editingSlideId ? 'Update Banner' : 'Add Banner'}</button>
                        </div>
                        <hr style={{ margin: '2rem 0' }} />
                        <h4>Existing Banners</h4>
                        <div className="quiz-list-container">
                            {homeSlides.map((slide) => (
                                <div key={slide.id} className="quiz-list-item-admin">
                                    <div className="quiz-mini-card"><img src={slide.img} alt={slide.title} /><span>{slide.title}</span></div>
                                    <div className="quiz-item-actions">
                                        <button className="icon-button edit-btn-icon" onClick={() => handleEditSlide(slide)}><EditIcon /></button>
                                        <button className="icon-button delete-btn-icon" onClick={() => handleDeleteSlide(slide.id)}><DeleteIcon /></button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            <div className="admin-section notifications-section">
                <div className="admin-section-header" onClick={() => toggleSection('notifications')}>
                    <h3>Send Notification</h3>
                    <button className="section-toggle-btn">{collapsedSections.notifications ? <PlusIcon /> : <MinusIcon />}</button>
                </div>
                {!collapsedSections.notifications && (
                    <div className="admin-section-content">
                        <div className="input-group"><textarea name="notification" placeholder="Enter notification message for all users..." value={notificationMessage} onChange={(e) => setNotificationMessage(e.target.value)}></textarea></div>
                        <div className="form-actions" style={{ justifyContent: 'flex-end', paddingTop: '1rem', borderTop: 'none' }}>
                            <button className="save-quiz-btn" style={{backgroundColor: 'var(--primary-blue)'}} onClick={handleSendNotification}>Send Notification</button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminPanel;