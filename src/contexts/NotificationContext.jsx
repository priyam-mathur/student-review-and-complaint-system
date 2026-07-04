import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import api from '@/api/axios';

const NotificationContext = createContext(undefined);

export const NotificationProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchNotifications = async () => {
    try {
      const { data } = await api.get('/notifications');
      setNotifications(data.data || []);
      
      const countRes = await api.get('/notifications/unread-count');
      setUnreadCount(countRes.data.data.count || 0);
    } catch (error) {
      console.error('Failed to fetch notifications', error);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchNotifications();
      // Polling for demo purposes. Real app would use WebSocket/SSE.
      const interval = setInterval(fetchNotifications, 60000); // 1 minute
      return () => clearInterval(interval);
    }
  }, [isAuthenticated]);

  const markAsRead = async (id) => {
    try {
      await api.patch(`/notifications/${id}/read`);
      setNotifications(notifications.map(n => 
        n._id === id ? { ...n, isRead: true } : n
      ));
      setUnreadCount(Math.max(0, unreadCount - 1));
    } catch (error) {
      console.error('Failed to mark as read', error);
    }
  };

  return (
    <NotificationContext.Provider value={{ notifications, unreadCount, markAsRead, fetchNotifications }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};
