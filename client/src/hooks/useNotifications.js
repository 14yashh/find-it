import { useState, useEffect, useCallback } from 'react';
import {
  getNotifications,
  markNotificationRead as apiMarkRead,
  markAllNotificationsRead as apiMarkAllRead,
  deleteNotification as apiDeleteNotification,
} from '../api/notifications.js';

export function useNotifications() {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState(null);

  const fetch = useCallback(async () => {
    setIsLoading(true);
    setIsError(false);
    setError(null);
    try {
      const result = await getNotifications();
      setData(result);
    } catch (err) {
      setIsError(true);
      setError(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { fetch(); }, [fetch]);

  const markAsRead = useCallback(async (id) => {
    try {
      await apiMarkRead(id);
    } catch { /* optimistic */ }
    setData((prev) =>
      prev
        ? {
            ...prev,
            notifications: prev.notifications.map((n) => (n._id === id ? { ...n, isRead: true } : n)),
            unreadCount: Math.max(0, (prev.unreadCount || 0) - 1),
          }
        : prev
    );
  }, []);

  const markAllAsRead = useCallback(async () => {
    try {
      await apiMarkAllRead();
    } catch { /* optimistic */ }
    setData((prev) =>
      prev
        ? {
            ...prev,
            notifications: prev.notifications.map((n) => ({ ...n, isRead: true })),
            unreadCount: 0,
          }
        : prev
    );
  }, []);

  const deleteNotification = useCallback(async (id) => {
    try {
      await apiDeleteNotification(id);
    } catch { /* optimistic */ }
    setData((prev) => {
      if (!prev) return prev;
      const target = prev.notifications.find((n) => n._id === id);
      const decr = target && !target.isRead ? 1 : 0;
      return {
        ...prev,
        notifications: prev.notifications.filter((n) => n._id !== id),
        total: Math.max(0, (prev.total || 0) - 1),
        unreadCount: Math.max(0, (prev.unreadCount || 0) - decr),
      };
    });
  }, []);

  const notifications = data?.notifications || [];
  const unreadCount = data?.unreadCount ?? notifications.filter((n) => !n.isRead).length;

  return {
    data,
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    isLoading,
    isError,
    error,
    refetch: fetch,
  };
}
