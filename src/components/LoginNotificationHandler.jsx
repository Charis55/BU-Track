import React, { useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';
import { getPendingFriendRequestsCount, getTotalUnreadMessagesCount } from '../utils/db';

const LoginNotificationHandler = () => {
  const { user } = useAuth();
  const { triggerNotification } = useNotifications();
  const hasNotified = useRef(false);

  useEffect(() => {
    // If no user or already notified this session, exit
    if (!user?.uid || hasNotified.current) return;

    const checkNotifications = async () => {
      try {
        const [pendingRequests, unreadMessages] = await Promise.all([
          getPendingFriendRequestsCount(user.uid),
          getTotalUnreadMessagesCount(user.uid)
        ]);

        if (pendingRequests > 0) {
          triggerNotification(
            'New Friend Requests',
            `You have ${pendingRequests} pending friend request${pendingRequests > 1 ? 's' : ''}. Check the Social tab!`,
            'info'
          );
        }

        if (unreadMessages > 0) {
          triggerNotification(
            'Unread Messages',
            `You have ${unreadMessages} new message${unreadMessages > 1 ? 's' : ''} waiting for you.`,
            'info'
          );
        }
        
        // Mark as notified so it doesn't trigger again on component re-mounts/toggles
        // unless the app is refreshed or user re-logs.
        hasNotified.current = true;
      } catch (err) {
        console.error("Login verification check failed", err);
      }
    };

    // Delay slightly to allow the app to settle and not overwhelm the user immediately
    const timeoutId = setTimeout(checkNotifications, 2000);
    return () => clearTimeout(timeoutId);
  }, [user]);

  return null; // This component doesn't render anything
};

export default LoginNotificationHandler;
