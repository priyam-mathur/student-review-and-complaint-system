import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import * as NotificationService from '../services/notification.service.js';
import Notification from '../models/Notification.model.js';

export const getUserNotifications = asyncHandler(async (req, res) => {
  const data = await NotificationService.getUserNotifications(req.user._id, req.query);
  return ApiResponse.paginated(res, 'Notifications fetched', data.notifications, data.pagination);
});

export const markAsRead = asyncHandler(async (req, res) => {
  const notification = await NotificationService.markAsRead(req.params.id, req.user._id);
  return ApiResponse.success(res, 'Notification marked as read', notification);
});

export const markAllAsRead = asyncHandler(async (req, res) => {
  await NotificationService.markAllAsRead(req.user._id);
  return ApiResponse.success(res, 'All notifications marked as read');
});

export const getUnreadCount = asyncHandler(async (req, res) => {
  const count = await Notification.countDocuments({ user: req.user._id, isRead: false });
  return ApiResponse.success(res, 'Unread count fetched', { count });
});
