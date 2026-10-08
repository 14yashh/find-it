import Notification from '../models/Notification.js';
import { ApiError } from '../utils/ApiError.js';

export async function createNotification(userId, type, message, link) {
  return await Notification.create({ user: userId, type, message, link });
}

export async function getNotifications(userId, query) {
  const page = parseInt(query.page, 10) || 1;
  const limit = Math.min(parseInt(query.limit, 10) || 12, 50);

  const total = await Notification.countDocuments({ user: userId });
  const totalPages = Math.ceil(total / limit);
  const unreadCount = await Notification.countDocuments({ user: userId, isRead: false });

  const notifications = await Notification.find({ user: userId })
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit);

  return { notifications, unreadCount, page, limit, total, totalPages };
}

export async function markAsRead(userId, notificationId) {
  const notification = await Notification.findById(notificationId);
  if (!notification) throw new ApiError(404, 'Notification not found', 'NOT_FOUND');
  if (notification.user.toString() !== userId.toString()) throw new ApiError(403, 'Not authorized', 'FORBIDDEN');

  notification.isRead = true;
  await notification.save();
  return notification;
}

export async function markAllAsRead(userId) {
  await Notification.updateMany({ user: userId, isRead: false }, { isRead: true });
  return { success: true };
}

export async function deleteNotification(userId, notificationId) {
  const notification = await Notification.findById(notificationId);
  if (!notification) throw new ApiError(404, 'Notification not found', 'NOT_FOUND');
  if (notification.user.toString() !== userId.toString()) throw new ApiError(403, 'Not authorized', 'FORBIDDEN');
  await notification.deleteOne();
  return { success: true };
}

