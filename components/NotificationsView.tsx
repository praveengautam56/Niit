import React, { useState } from 'react';
import { Notification } from '../types';
import { db } from '../firebase';
import { DeleteIcon } from './icons';

type NotificationsViewProps = {
    notifications: Notification[];
    userRole: string | null;
};

const formatRelativeTime = (timestamp: number): string => {
    const today = new Date();
    const notificationDate = new Date(timestamp);

    // Reset time part for accurate day comparison
    today.setHours(0, 0, 0, 0);
    notificationDate.setHours(0, 0, 0, 0);

    const diffTime = today.getTime() - notificationDate.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
        return 'Today';
    }
    if (diffDays === 1) {
        return 'Yesterday';
    }
    if (diffDays > 1) {
        return `${diffDays} days ago`;
    }
    
    // Handle cases where notification is in the future, though unlikely
    return new Date(timestamp).toLocaleDateString();
};


// Fix: Corrected component typing to resolve an issue where the `key` prop was being
// flagged as an error. By defining props with a type alias and using React.FC, we
// ensure TypeScript correctly handles React's special `key` prop.
type NotificationItemProps = {
    notification: Notification;
    userRole: string | null;
};

const NotificationItem: React.FC<NotificationItemProps> = ({ notification, userRole }) => {
    const [swipedNotificationId, setSwipedNotificationId] = useState<string | null>(null);
    const [touchStart, setTouchStart] = useState<number | null>(null);
    const [touchEnd, setTouchEnd] = useState<number | null>(null);

    const isAdmin = userRole === 'admin';
    const minSwipeDistance = 100; // Swipe threshold to trigger delete

    const handleDeleteNotification = async (notificationId: string) => {
        try {
            await db.ref(`notifications/${notificationId}`).remove();
        } catch (error) {
            console.error("Error deleting notification:", error);
            alert("Failed to delete notification.");
        }
    };

    const onTouchStart = (notifId: string, clientX: number) => {
        setTouchEnd(null);
        setTouchStart(clientX);
        setSwipedNotificationId(notifId);
    };

    const onTouchMove = (clientX: number) => {
        if (touchStart === null || swipedNotificationId === null) return;
        setTouchEnd(clientX);
    };

    const resetSwipeState = () => {
        setTouchStart(null);
        setTouchEnd(null);
        setSwipedNotificationId(null);
    };

    const onTouchEnd = () => {
        if (!touchStart || !touchEnd || swipedNotificationId === null) {
            resetSwipeState();
            return;
        }

        const distance = touchEnd - touchStart;

        if (Math.abs(distance) > minSwipeDistance) {
            handleDeleteNotification(swipedNotificationId);
        }
        
        resetSwipeState();
    };

    const isBeingSwiped = swipedNotificationId === notification.id;
    const swipeDistance = isBeingSwiped && touchStart && touchEnd ? touchEnd - touchStart : 0;
    const isResetting = !isBeingSwiped && swipedNotificationId === null;

    if (!isAdmin) {
        return (
            <li className="notification-item">
                <div className="notification-content">
                    <p>{notification.message}</p>
                    <span className="notification-time">{formatRelativeTime(notification.timestamp)}</span>
                </div>
            </li>
        );
    }

    return (
        <li className="notification-swipe-container">
            <div className="notification-delete-action left">
                <DeleteIcon />
                <span>Delete</span>
            </div>
            <div className="notification-delete-action right">
                <DeleteIcon />
                <span>Delete</span>
            </div>
            <div
                className={`notification-item ${isResetting ? 'resetting' : ''}`}
                onTouchStart={(e) => onTouchStart(notification.id, e.targetTouches[0].clientX)}
                onTouchMove={(e) => onTouchMove(e.targetTouches[0].clientX)}
                onTouchEnd={onTouchEnd}
                onMouseDown={(e) => onTouchStart(notification.id, e.clientX)}
                onMouseMove={(e) => { if (e.buttons === 1) onTouchMove(e.clientX); }}
                onMouseUp={onTouchEnd}
                onMouseLeave={swipedNotificationId === notification.id ? onTouchEnd : undefined}
                style={{ transform: `translateX(${swipeDistance}px)` }}
            >
                <div className="notification-content">
                    <p>{notification.message}</p>
                    <span className="notification-time">{formatRelativeTime(notification.timestamp)}</span>
                </div>
            </div>
        </li>
    );
};


const NotificationsView = ({ notifications, userRole }: NotificationsViewProps) => {
    return (
        <div className="notifications-view-content">
            {notifications.length > 0 ? (
                <ul className="notifications-list">
                    {notifications.map(notif => (
                        <NotificationItem key={notif.id} notification={notif} userRole={userRole} />
                    ))}
                </ul>
            ) : (
                <p style={{ textAlign: 'center', marginTop: '2rem' }}>No notifications at the moment.</p>
            )}
        </div>
    );
};

export default NotificationsView;