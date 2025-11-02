import React, { useState, useEffect, useRef } from 'react';
import { auth, db } from '../firebase';
// Fix: Use firebase from compat for User type and database snapshot type.
import firebase from 'firebase/compat/app';
import { ReplyIcon, DeleteIcon } from './icons';

interface ReplyContext {
    messageId: string;
    senderName: string;
    text: string;
}

interface Message {
    id: string;
    uid: string;
    name: string;
    text: string;
    role: string;
    timestamp: number;
    replyTo?: ReplyContext;
}

interface UserData {
    name: string;
    role: string;
}

const DoubtsView = ({ userRole }: { userRole: string | null }) => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState('');
    // Fix: Use firebase.User type.
    const [currentUser, setCurrentUser] = useState<firebase.User | null>(null);
    const [currentUserData, setCurrentUserData] = useState<UserData | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const [replyingTo, setReplyingTo] = useState<Message | null>(null);
    const [swipedMessage, setSwipedMessage] = useState<{ id: string | null, startX: number | null, currentX: number | null }>({ id: null, startX: null, currentX: null });

    const SWIPE_THRESHOLD = 60; // Min pixels to swipe to trigger an action
    const MAX_SWIPE_DISTANCE = 80; // Max visual swipe distance

    useEffect(() => {
        // Fix: Use auth.onAuthStateChanged from compat mode.
        const unsubscribe = auth.onAuthStateChanged(user => {
            setCurrentUser(user);
            if (user) {
                // Fix: Use db.ref() and ref.get() from compat mode.
                const userRef = db.ref(`users/${user.uid}`);
                userRef.get().then(snapshot => {
                    if (snapshot.exists()) {
                        setCurrentUserData(snapshot.val());
                    }
                });
            }
        });
        return unsubscribe;
    }, []);

    useEffect(() => {
        // Fix: Use db.ref().orderByChild() from compat mode.
        const chatRef = db.ref('doubtsChat').orderByChild('timestamp');
        
        // Fix: Use ref.on('value', ...) and ref.off() for listeners.
        const listener = (snapshot: firebase.database.DataSnapshot) => {
            const data = snapshot.val();
            const loadedMessages: Message[] = [];
            if (data) {
                for (const key in data) {
                    loadedMessages.push({ id: key, ...data[key] });
                }
            }
            setMessages(loadedMessages);
        };
        chatRef.on('value', listener);
        return () => chatRef.off('value', listener);
    }, []);

    useEffect(() => {
        if (replyingTo) return;
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, replyingTo]);

    const handleDeleteMessage = async (messageId: string) => {
        if (userRole !== 'admin') return;
        if (window.confirm("Are you sure you want to permanently delete this message?")) {
            try {
                await db.ref(`doubtsChat/${messageId}`).remove();
            } catch (error) {
                console.error("Error deleting message:", error);
                alert("Failed to delete message.");
            }
        }
    };

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (newMessage.trim() === '' || !currentUser || !currentUserData) {
            return;
        }

        const messageData: Partial<Message> & { timestamp: number } = {
            uid: currentUser.uid,
            name: currentUserData.name,
            text: newMessage,
            role: userRole || 'user',
            timestamp: Date.now(),
        };

        if (replyingTo) {
            messageData.replyTo = {
                messageId: replyingTo.id,
                senderName: replyingTo.name,
                text: replyingTo.text,
            };
        }

        // Fix: Use db.ref().push() from compat mode.
        const chatRef = db.ref('doubtsChat');
        await chatRef.push(messageData);

        setNewMessage('');
        setReplyingTo(null);
    };

    const handleSwipeStart = (id: string, clientX: number) => {
        if (swipedMessage.id) return;
        setSwipedMessage({ id, startX: clientX, currentX: clientX });
    };

    const handleSwipeMove = (clientX: number) => {
        if (!swipedMessage.id || swipedMessage.startX === null) return;
        setSwipedMessage(prev => ({ ...prev, currentX: clientX }));
    };

    const resetSwipe = () => {
        setSwipedMessage({ id: null, startX: null, currentX: null });
    };

    const handleSwipeEnd = () => {
        if (!swipedMessage.id || swipedMessage.startX === null || swipedMessage.currentX === null) {
            resetSwipe();
            return;
        }

        const distance = swipedMessage.currentX - swipedMessage.startX;
        const message = messages.find(m => m.id === swipedMessage.id);
        if (!message) {
            resetSwipe();
            return;
        }

        const isSentByCurrentUser = message.uid === currentUser?.uid;
        const isAdmin = userRole === 'admin';

        // --- Check for Admin Delete Action ---
        if (isAdmin) {
            // Sent messages: Swipe RIGHT to delete
            if (isSentByCurrentUser && distance > SWIPE_THRESHOLD) {
                handleDeleteMessage(swipedMessage.id);
                resetSwipe();
                return;
            }
            // Received messages: Swipe LEFT to delete
            if (!isSentByCurrentUser && distance < -SWIPE_THRESHOLD) {
                handleDeleteMessage(swipedMessage.id);
                resetSwipe();
                return;
            }
        }

        // --- Check for Reply Action ---
        // Sent messages: Swipe LEFT to reply
        if (isSentByCurrentUser && distance < -SWIPE_THRESHOLD) {
            setReplyingTo(message);
            resetSwipe();
            return;
        }
        // Received messages: Swipe RIGHT to reply
        if (!isSentByCurrentUser && distance > SWIPE_THRESHOLD) {
            setReplyingTo(message);
            resetSwipe();
            return;
        }

        // If no action threshold was met, reset.
        resetSwipe();
    };

    const cancelReply = () => {
        setReplyingTo(null);
    };

    return (
        <div className="doubts-view-container">
            <div className="message-list">
                {messages.map(msg => {
                    const isSentByCurrentUser = msg.uid === currentUser?.uid;
                    const isAdminMessage = msg.role === 'admin';
                    const messageClass = isSentByCurrentUser ? 'sent' : 'received';
                    const isAdmin = userRole === 'admin';

                    const isBeingSwiped = swipedMessage.id === msg.id;
                    let swipeDistance = 0;
                    if (isBeingSwiped && swipedMessage.startX !== null && swipedMessage.currentX !== null) {
                        swipeDistance = swipedMessage.currentX - swipedMessage.startX;
                        
                        if (isAdmin) {
                            // Admin can swipe both ways
                            swipeDistance = Math.min(MAX_SWIPE_DISTANCE, Math.max(-MAX_SWIPE_DISTANCE, swipeDistance));
                        } else {
                            // Non-admin can only swipe for reply
                            if (isSentByCurrentUser) {
                                // Swipe left only
                                swipeDistance = Math.min(0, Math.max(-MAX_SWIPE_DISTANCE, swipeDistance));
                            } else {
                                // Swipe right only
                                swipeDistance = Math.max(0, Math.min(MAX_SWIPE_DISTANCE, swipeDistance));
                            }
                        }
                    }

                    return (
                        <div key={msg.id} className={`message-item ${messageClass} ${isAdminMessage ? 'admin' : ''}`}>
                            <div className="message-swipe-wrapper">
                                <div className="reply-action">
                                    <ReplyIcon />
                                </div>
                                {isAdmin && (
                                    <div className="delete-action-doubts">
                                        <DeleteIcon />
                                    </div>
                                )}
                                <div
                                    className="message-content-wrapper"
                                    onTouchStart={(e) => handleSwipeStart(msg.id, e.targetTouches[0].clientX)}
                                    onTouchMove={(e) => handleSwipeMove(e.targetTouches[0].clientX)}
                                    onTouchEnd={handleSwipeEnd}
                                    onMouseDown={(e) => handleSwipeStart(msg.id, e.clientX)}
                                    onMouseMove={(e) => { if (e.buttons === 1) handleSwipeMove(e.clientX); }}
                                    onMouseUp={handleSwipeEnd}
                                    onMouseLeave={swipedMessage.id === msg.id ? handleSwipeEnd : undefined}
                                    style={{ transform: `translateX(${swipeDistance}px)` }}
                                >
                                    {!isSentByCurrentUser && (
                                        <span className="sender-name">
                                            {msg.name}
                                        </span>
                                    )}
                                    <div className="message-bubble">
                                        {msg.replyTo && (
                                            <div className="reply-quote">
                                                <span className="reply-quote-sender">{msg.replyTo.senderName}</span>
                                                <p className="reply-quote-text">{msg.replyTo.text}</p>
                                            </div>
                                        )}
                                        <p>{msg.text}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
                <div ref={messagesEndRef} />
            </div>

            {replyingTo && (
                <div className="reply-preview">
                    <div className="reply-preview-content">
                        <span className="reply-preview-sender">Replying to {replyingTo.uid === currentUser?.uid ? 'yourself' : replyingTo.name}</span>
                        <p className="reply-preview-text">{replyingTo.text}</p>
                    </div>
                    <button onClick={cancelReply} className="reply-preview-cancel" aria-label="Cancel reply">&times;</button>
                </div>
            )}

            <form className="message-form" onSubmit={handleSendMessage}>
                <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Ask a question..."
                />
                <button type="submit" aria-label="Send Message">
                    <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24" fill="currentColor"><path d="M120-160v-640l760 320-760 320Zm80-120 474-200-474-200v140l240 60-240 60v140Zm0 0v-400 400Z"/></svg>
                </button>
            </form>
        </div>
    );
};

export default DoubtsView;