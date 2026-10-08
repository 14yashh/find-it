import { useState, useMemo } from 'react';
import { mockNotifications } from '../mocks/data.js';
import { useDevSimulation } from './useDevStateHelper.js';

export function useNotifications() {
  const { isLoading: simLoading, isError: simError, isEmpty: simEmpty } = useDevSimulation();
  const [notifications, setNotifications] = useState(mockNotifications);

  const markAsRead = (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n._id === id ? { ...n, isRead: true } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const activeList = simEmpty ? [] : notifications;
  const unreadCount = useMemo(() => {
    return activeList.filter((n) => !n.isRead).length;
  }, [activeList]);

  const total = activeList.length;
  const page = 1;
  const limit = 10;
  const totalPages = Math.ceil(total / limit) || 1;

  const data = simError
    ? null
    : {
        notifications: activeList,
        unreadCount,
        page,
        limit,
        total,
        totalPages,
      };

  return {
    data,
    notifications: simLoading || simError ? [] : activeList,
    unreadCount: simLoading || simError ? 0 : unreadCount,
    markAsRead,
    markAllAsRead,
    isLoading: simLoading,
    isError: simError,
    error: simError ? { message: 'Failed to retrieve user notifications.' } : null,
  };
}
