import asyncHandler from '../utils/asyncHandler.js';
import * as notificationSvc from '../services/notificationService.js';

export const getNotifications = asyncHandler(async (req, res) => {
  const data = await notificationSvc.getNotifications(req.user._id, req.query);
  res.json({ success: true, data });
});

export const markAsRead = asyncHandler(async (req, res) => {
  const notification = await notificationSvc.markAsRead(req.user._id, req.params.id);
  res.json({ success: true, data: { notification } });
});

export const markAllAsRead = asyncHandler(async (req, res) => {
  await notificationSvc.markAllAsRead(req.user._id);
  res.json({ success: true, data: { message: 'All notifications marked as read' } });
});

export const deleteNotification = asyncHandler(async (req, res) => {
  await notificationSvc.deleteNotification(req.user._id, req.params.id);
  res.json({ success: true, data: { message: 'Notification deleted permanently' } });
});

