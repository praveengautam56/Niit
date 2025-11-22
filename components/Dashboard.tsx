import React, { useState, useEffect, useRef } from 'react';
// Fix: Use auth object method for sign out and import firebase for types.
// import { signOut } from "firebase/auth";
import firebase from 'firebase/compat/app';
import { auth, db } from '../firebase';
import StreamsView from './StreamsView';
import StreamDetailView from './StreamDetailView';
import MyLibrary from './MyLibrary';
import AdminPanel from './AdminPanel';
import QuizView from './QuizView';
import DailyQuiz from './DailyQuiz';
import Leaderboard from './Leaderboard';
import DoubtsView from './DoubtsView';
import NotificationsView from './NotificationsView';
import BookView from './BookView';
import ShortsView from './ShortsView';
import VideosView from './VideosView';
import AdmissionForm from './AdmissionForm';
import { LeaderboardIcon, NotificationIcon, UserIcon, LogoutIcon, BookIcon, ShortsIcon, VideoIcon, ShareIcon, BackArrowIcon, HomeIcon, LibraryIcon, CalendarIcon, ChatIcon, CrownIcon } from './icons';
import { Quiz, Notification } from '../types';


type TabContentProps = {
    activeTab: string;
    onStartQuiz: (quiz: Quiz) => void;
    userRole: string | null;
    homePage: 'streams' | 'streamDetail';
    selectedStream: string | null;
    handleSelectStream: (streamName: string) => void;
    handleBackToStreams: () => void;
    onApplyNow: (courseName: string) => void;
};

const TabContent = ({ 
    activeTab, 
    onStartQuiz, 
    userRole, 
    homePage, 
    selectedStream, 
    handleSelectStream, 
    handleBackToStreams,
    onApplyNow
}: TabContentProps) => {
    switch (activeTab) {
        case 'home':
            if (homePage === 'streamDetail' && selectedStream) {
                return <StreamDetailView streamName={selectedStream} onBack={handleBackToStreams} />;
            }
            return <StreamsView onSelectStream={handleSelectStream} onApplyNow={onApplyNow} />;
        case 'my-library':
            return <MyLibrary onStartQuiz={onStartQuiz} />;
        case 'daily-quiz':
            return <DailyQuiz onStartQuiz={onStartQuiz} />;
        case 'doubts':
            return <DoubtsView userRole={userRole} />;
        case 'admin':
            return <AdminPanel />;
        default:
            return <StreamsView onSelectStream={handleSelectStream} onApplyNow={onApplyNow} />;
    }
};

const animatedTexts = ['Rs-Cit', 'PGDCA', 'DCA', 'Competition'];

const Dashboard = ({ userRole }: { userRole: string | null }) => {
    const [activeTab, setActiveTab] = useState('home');
    const [mainView, setMainView] = useState<'tabs' | 'book' | 'shorts' | 'videos'>('tabs');
    const [activeQuiz, setActiveQuiz] = useState<Quiz | null>(null);
    const [isLeaderboardVisible, setIsLeaderboardVisible] = useState(false);
    const [isNotificationsVisible, setIsNotificationsVisible] = useState(false);
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [isProfileMenuOpen, setProfileMenuOpen] = useState(false);
    const [shareText, setShareText] = useState('Share App');
    const profileMenuRef = useRef<HTMLDivElement>(null);
    
    // State for new stream navigation
    const [homePage, setHomePage] = useState<'streams' | 'streamDetail'>('streams');
    const [selectedStream, setSelectedStream] = useState<string | null>(null);
    const [admissionFormCourse, setAdmissionFormCourse] = useState<string | null>(null);

    const [animatedTextIndex, setAnimatedTextIndex] = useState(0);
    const [isTransitionEnabled, setIsTransitionEnabled] = useState(true);

    const handleSelectStream = (streamName: string) => {
        // Push a state to the browser's history. This allows our `popstate`
        // listener to intercept the mobile back button press and navigate
        // to the home screen instead of closing the app.
        window.history.pushState({ appView: 'streamDetail' }, '');
        setSelectedStream(streamName);
        setHomePage('streamDetail');
    };
    const handleBackToStreams = () => {
        setSelectedStream(null);
        setHomePage('streams');
    };

    const handleApplyNow = (courseName: string) => {
        window.history.pushState({ appView: 'admissionForm' }, '');
        setAdmissionFormCourse(courseName);
    };

    const handleCloseAdmissionForm = () => {
        setAdmissionFormCourse(null);
    };


    useEffect(() => {
        const intervalId = setInterval(() => {
            setAnimatedTextIndex(prevIndex => prevIndex + 1);
        }, 2000); // This triggers the slide animation
        return () => clearInterval(intervalId);
    }, []);

    const handleTransitionEnd = () => {
        // When the animation to the duplicate first item ends...
        if (animatedTextIndex >= animatedTexts.length) {
            // ...disable transitions and snap back to the real first item
            setIsTransitionEnabled(false); 
            setAnimatedTextIndex(0);
        }
    };

    useEffect(() => {
        // This effect runs after the state has been updated to index 0 without a transition.
        // We now need to re-enable transitions for the next slide.
        if (animatedTextIndex === 0 && !isTransitionEnabled) {
            // A minimal timeout ensures that the DOM updates (from the class removal) before we add the class back.
            setTimeout(() => {
                setIsTransitionEnabled(true);
            }, 50);
        }
    }, [animatedTextIndex, isTransitionEnabled]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
                setProfileMenuOpen(false);
            }
        };
    
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []); 

    // Handles mobile back button presses by intercepting the popstate event.
    useEffect(() => {
        const handlePopState = () => {
            // When the user hits the back button, this listener is triggered.
            // We always reset the view to the home screen instead of exiting the app,
            // which prevents the app from closing unexpectedly.
            setMainView('tabs');
            setIsLeaderboardVisible(false);
            setIsNotificationsVisible(false);
            setActiveTab('home');
            setHomePage('streams');
            setSelectedStream(null);
            setAdmissionFormCourse(null); // Close admission form if open
            setActiveQuiz(null); // Exit quiz view if active
        };

        window.addEventListener('popstate', handlePopState);
        return () => {
            window.removeEventListener('popstate', handlePopState);
        };
    }, []); 

    useEffect(() => {
        // Fix: Use db.ref().orderByChild() from compat mode.
        const notificationsRef = db.ref('notifications').orderByChild('timestamp');
        const user = auth.currentUser;
        let lastSeenTimestamp = 0;
        let userRef: firebase.database.Reference | undefined;
        if (user) {
            // Fix: Use db.ref() from compat mode.
            userRef = db.ref(`users/${user.uid}/lastSeenNotificationTimestamp`);
        }
    
        const handleNotifications = (snapshot: firebase.database.DataSnapshot) => {
            if (snapshot.exists()) {
                const data = snapshot.val();
                const loadedNotifications: Notification[] = [];
                for (const key in data) {
                    loadedNotifications.push({ id: key, ...data[key] });
                }
                const sortedNotifications = loadedNotifications.sort((a, b) => b.timestamp - a.timestamp);
                setNotifications(sortedNotifications);
    
                const newUnreadCount = sortedNotifications.filter(n => n.timestamp > lastSeenTimestamp).length;
                setUnreadCount(newUnreadCount);
            }
        };
    
        const setupListener = async () => {
            if (userRef) {
                // Fix: Use ref.get() from compat mode.
                const snapshot = await userRef.get();
                if (snapshot.exists()) {
                    lastSeenTimestamp = snapshot.val();
                }
            }
            // Fix: Use ref.on('value', ...) from compat mode.
            notificationsRef.on('value', handleNotifications);
        };
    
        setupListener();
    
        return () => {
            // Fix: Use ref.off() from compat mode.
            notificationsRef.off();
        };
    }, []);

    const handleLogout = () => {
        // Fix: Use auth.signOut() from compat mode.
        auth.signOut().catch((error) => console.error("Logout Error:", error));
    };

    const handleShareApp = async () => {
        const shareData = {
            title: 'NIIT Institute',
            text: 'Check out the NIIT Institute quiz app! Download it from this link.',
            url: 'http://niit.page.gd',
        };

        if (navigator.share) {
            try {
                await navigator.share(shareData);
            } catch (err) {
                // User probably cancelled the share, so we can ignore the error.
                console.log('Share was cancelled or failed', err);
            }
        } else {
            // Fallback for browsers that don't support the Web Share API
            try {
                await navigator.clipboard.writeText(shareData.url);
                setShareText('Link Copied!');
                setTimeout(() => {
                    setShareText('Share App');
                    setProfileMenuOpen(false);
                }, 2000);
            } catch (err) {
                setShareText('Copy Failed');
                setTimeout(() => {
                    setShareText('Share App');
                }, 2000);
            }
        }
    };

    const handleStartQuiz = (quiz: Quiz) => {
        if (quiz.questions && quiz.questions.length > 0) {
            window.history.pushState({ appView: 'quiz' }, '');
            setActiveQuiz(quiz);
        } else {
            alert("This quiz has no questions yet!");
        }
    };
    
    const handleCompleteQuiz = () => {
        setActiveQuiz(null);
    };

    const handleTabClick = (tab: string) => {
        const isCurrentlyHome = activeTab === 'home' && !isLeaderboardVisible && !isNotificationsVisible;
        
        // If navigating away from the home screen, push a history state
        // so the back button can be intercepted by our popstate listener.
        if (isCurrentlyHome && tab !== 'home') {
            window.history.pushState({ appView: tab }, '');
        }
        
        setMainView('tabs');
        setIsLeaderboardVisible(false);
        setIsNotificationsVisible(false);
        setActiveTab(tab);
        setHomePage('streams');
        setSelectedStream(null);
    };

    const handleLeaderboardClick = () => {
        const isCurrentlyHome = activeTab === 'home' && !isLeaderboardVisible && !isNotificationsVisible;
        
        // If navigating away from home, push a state.
        if (isCurrentlyHome) {
            window.history.pushState({ appView: 'leaderboard' }, '');
        }
        
        setMainView('tabs');
        setIsNotificationsVisible(false);
        setIsLeaderboardVisible(true);
        setActiveTab(''); // Deselect tabs
    };

    const handleNotificationClick = () => {
        const isCurrentlyHome = activeTab === 'home' && !isLeaderboardVisible && !isNotificationsVisible;
        
        if (isCurrentlyHome) {
            window.history.pushState({ appView: 'notifications' }, '');
        }
        
        setMainView('tabs');
        setIsLeaderboardVisible(false);
        setIsNotificationsVisible(true);
        setActiveTab('');

        if (unreadCount > 0) {
            const user = auth.currentUser;
            if (user && notifications.length > 0) {
                const latestTimestamp = notifications[0].timestamp;
                // Fix: Use db.ref() from compat mode.
                const userRef = db.ref(`users/${user.uid}/lastSeenNotificationTimestamp`);
                // Fix: Use ref.set() from compat mode.
                userRef.set(latestTimestamp).then(() => {
                    setUnreadCount(0);
                });
            } else {
                 setUnreadCount(0);
            }
        }
    };

    const handleBottomNavClick = (view: 'book' | 'shorts' | 'videos') => {
        // Only push a history state if we are moving from the tab view to another view.
        // This creates a single back-stack entry that leads back to the home/tabs view.
        if (mainView === 'tabs') {
            window.history.pushState({ appView: view }, '');
        }
        
        // Set the main view to the selected bottom nav item
        setMainView(view);

        // Deselect any active top tab and special views, since we are now in a bottom nav view
        setActiveTab(''); 
        setIsLeaderboardVisible(false);
        setIsNotificationsVisible(false);
    };

    const isAdmin = userRole?.toLowerCase() === 'admin';

    if (admissionFormCourse) {
        return <AdmissionForm courseName={admissionFormCourse} onClose={handleCloseAdmissionForm} />;
    }

    if (activeQuiz) {
        return <QuizView quiz={activeQuiz} onComplete={handleCompleteQuiz} />
    }

    const textsToRender = [...animatedTexts, animatedTexts[0]];

    return (
        <div className="dashboard-container">
            <nav className="dashboard-nav">
                <div className="nav-logo-container">
                    <div className="nav-logo" onClick={() => handleTabClick('home')} role="button" tabIndex={0} aria-label="Go to Home page">
                       NIIT
                    </div>
                    <div className="animated-text-container">
                        <div 
                           className={`animated-text-slider ${!isTransitionEnabled ? 'no-transition' : ''}`}
                           style={{ transform: `translateY(-${animatedTextIndex * 24}px)` }}
                           onTransitionEnd={handleTransitionEnd}
                        >
                            {textsToRender.map((text, index) => (
                                <div className="animated-text-item" key={index}>{text}</div>
                            ))}
                        </div>
                    </div>
                </div>
                <div className="nav-icons">
                    <button className="icon-button" aria-label="Notifications" onClick={handleNotificationClick}>
                       <NotificationIcon />
                       {unreadCount > 0 && <span className="notification-badge">{unreadCount}</span>}
                    </button>
                    <button className="icon-button" aria-label="Leaderboard" onClick={handleLeaderboardClick}>
                       <LeaderboardIcon />
                    </button>
                    <div className="profile-menu-container" ref={profileMenuRef}>
                        <button onClick={() => setProfileMenuOpen(prev => !prev)} className="icon-button" aria-label="User menu" aria-haspopup="true" aria-expanded={isProfileMenuOpen}>
                            <UserIcon />
                        </button>
                        {isProfileMenuOpen && (
                            <div className="profile-menu">
                                <button onClick={handleShareApp} className="profile-menu-item">
                                    <ShareIcon />
                                    <span>{shareText}</span>
                                </button>
                                <button onClick={handleLogout} className="profile-menu-item">
                                    <LogoutIcon />
                                    <span>Logout</span>
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </nav>
             {mainView === 'tabs' && (!isLeaderboardVisible && !isNotificationsVisible) && (
                <div className="tabs-container">
                    <button 
                        className={`tab-item ${activeTab === 'home' ? 'active' : ''}`}
                        onClick={() => handleTabClick('home')}
                        aria-label="Home"
                    >
                        <span>Home</span>
                    </button>
                    <button 
                        className={`tab-item ${activeTab === 'my-library' ? 'active' : ''}`}
                        onClick={() => handleTabClick('my-library')}
                        aria-label="My library"
                    >
                        <span>My library</span>
                    </button>
                    <button 
                        className={`tab-item ${activeTab === 'daily-quiz' ? 'active' : ''}`}
                        onClick={() => handleTabClick('daily-quiz')}
                        aria-label="Quiz"
                    >
                        <span>Quiz</span>
                    </button>
                    <button 
                        className={`tab-item ${activeTab === 'doubts' ? 'active' : ''}`}
                        onClick={() => handleTabClick('doubts')}
                        aria-label="Chat"
                    >
                        <span>Chat</span>
                    </button>
                    {isAdmin && (
                        <button 
                            className={`tab-item ${activeTab === 'admin' ? 'active' : ''}`}
                            onClick={() => handleTabClick('admin')}
                            aria-label="Admin"
                        >
                            <span>Admin</span>
                        </button>
                    )}
                </div>
            )}
            <main className={`dashboard-main ${mainView === 'shorts' ? 'shorts-view-active' : ''}`}>
                {mainView === 'tabs' && (
                     isLeaderboardVisible ? (
                        <>
                            <h2 className="section-title">Leaderboard</h2>
                            <Leaderboard />
                        </>
                    ) : isNotificationsVisible ? (
                         <>
                            <h2 className="section-title">Notifications</h2>
                            <NotificationsView notifications={notifications} userRole={userRole} />
                        </>
                    ) : (
                        <TabContent 
                            activeTab={activeTab} 
                            onStartQuiz={handleStartQuiz} 
                            userRole={userRole}
                            homePage={homePage}
                            selectedStream={selectedStream}
                            handleSelectStream={handleSelectStream}
                            handleBackToStreams={handleBackToStreams}
                            onApplyNow={handleApplyNow}
                         />
                    )
                )}
                {mainView === 'book' && <BookView />}
                {mainView === 'shorts' && <ShortsView />}
                {mainView === 'videos' && <VideosView />}
            </main>
             <div className="bottom-nav-bar">
                {mainView !== 'tabs' && (
                    <button
                        className="bottom-nav-item"
                        aria-label="Back"
                        onClick={() => handleTabClick('home')}
                    >
                        <BackArrowIcon />
                        <span className="bottom-nav-label">Back</span>
                    </button>
                )}
                <button
                    className={`bottom-nav-item ${mainView === 'book' ? 'active' : ''}`}
                    aria-label="Book"
                    onClick={() => handleBottomNavClick('book')}
                >
                    <BookIcon />
                    <span className="bottom-nav-label">Book</span>
                </button>
                <button
                    className={`bottom-nav-item ${mainView === 'shorts' ? 'active' : ''}`}
                    aria-label="Shorts"
                    onClick={() => handleBottomNavClick('shorts')}
                >
                    <ShortsIcon />
                    <span className="bottom-nav-label">Shorts</span>
                </button>
                <button
                    className={`bottom-nav-item ${mainView === 'videos' ? 'active' : ''}`}
                    aria-label="Videos"
                    onClick={() => handleBottomNavClick('videos')}
                >
                    <VideoIcon />
                    <span className="bottom-nav-label">Videos</span>
                </button>
            </div>
        </div>
    );
};

export default Dashboard;