import * as notificationService from '../services/notification.service.js';
import { sendSuccess, sendPaginated } from '../utils/response.js';
import asyncHandler from '../utils/asyncHandler.js';

/**
 * GET /api/notifications
 */
export const getNotifications = asyncHandler(async (req, res) => {
  const { notifications, total, unreadCount, page, limit } = await notificationService.getNotifications(
    req.user.id,
    req.query
  );

  sendPaginated(res, {
    data: notifications,
    page,
    limit,
    total,
    message: 'Notifications retrieved',
  });

  // Add unreadCount to the response meta
  // We already sent the response, so we can't modify it
  // Instead, include it in the data structure
});

/**
 * GET /api/notifications — override to include unreadCount
 */
export const getNotificationsWithMeta = asyncHandler(async (req, res) => {
  const { notifications, total, unreadCount, page, limit } = await notificationService.getNotifications(
    req.user.id,
    req.query
  );

  const totalPages = Math.ceil(total / limit);

  res.json({
    success: true,
    message: 'Notifications retrieved',
    data: notifications,
    meta: {
      page,
      limit,
      total,
      totalPages,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
      unreadCount,
    },
  });
});

/**
 * PUT /api/notifications/:id/read
 */
export const markAsRead = asyncHandler(async (req, res) => {
  await notificationService.markAsRead(req.params.id);
  sendSuccess(res, { message: 'Notification marked as read' });
});

/**
 * PUT /api/notifications/read-all
 */
export const markAllAsRead = asyncHandler(async (req, res) => {
  await notificationService.markAllAsRead(req.user.id);
  sendSuccess(res, { message: 'All notifications marked as read' });
});

/**
 * DELETE /api/notifications/:id
 */
export const deleteNotification = asyncHandler(async (req, res) => {
  await notificationService.deleteNotification(req.params.id);
  sendSuccess(res, { message: 'Notification deleted' });
});
