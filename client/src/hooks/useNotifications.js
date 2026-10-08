import { useState } from 'react';
import { mockNotifications } from '../mocks/data.js';

export function useNotifications() {
  const [notifications, setNotifications] = useState(mockNotifications);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const markAsRead = (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n._id === id ? { ...n, isRead: true } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  return {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    loading: false,
    error: null,
  };
}
