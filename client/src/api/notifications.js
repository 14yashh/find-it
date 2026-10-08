/**
 * src/api/notifications.js
 * Notifications API endpoints matching docs/API.md
 */
import { apiClient } from './client.js';

export async function getNotifications(params = {}) {
  const data = await apiClient('/api/notifications', { params });
  return data; // { notifications, unreadCount, page, limit, total, totalPages }
}

export async function markNotificationRead(id) {
  const data = await apiClient(`/api/notifications/${id}/read`, { method: 'PATCH' });
  return data;
}

export async function markAllNotificationsRead() {
  const data = await apiClient('/api/notifications/read-all', { method: 'PATCH' });
  return data;
}

export async function deleteNotification(id) {
  const data = await apiClient(`/api/notifications/${id}`, { method: 'DELETE' });
  return data;
}

