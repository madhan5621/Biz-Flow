import prisma from '../config/db.js';
import { parsePagination } from '../utils/pagination.js';

/**
 * Get notifications for a user with pagination.
 */
export const getNotifications = async (userId, query) => {
  const { page, limit, skip } = parsePagination(query);

  const where = {};
  if (userId) {
    where.OR = [{ userId }, { userId: null }];
  }

  if (query.isRead !== undefined && query.isRead !== '') {
    where.isRead = query.isRead === 'true';
  }

  const [notifications, total, unreadCount] = await Promise.all([
    prisma.notification.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
    }),
    prisma.notification.count({ where }),
    prisma.notification.count({
      where: { ...where, isRead: false },
    }),
  ]);

  return { notifications, total, unreadCount, page, limit };
};

/**
 * Create a notification.
 */
export const createNotification = async ({ type, title, message, userId = null, data = null }) => {
  try {
    const notification = await prisma.notification.create({
      data: { type, title, message, userId, data },
    });
    return notification;
  } catch (error) {
    console.error('Notification create error:', error.message);
    return null;
  }
};

/**
 * Mark a notification as read.
 */
export const markAsRead = async (id) => {
  return prisma.notification.update({
    where: { id },
    data: { isRead: true },
  });
};

/**
 * Mark all notifications as read for a user.
 */
export const markAllAsRead = async (userId) => {
  return prisma.notification.updateMany({
    where: {
      OR: [{ userId }, { userId: null }],
      isRead: false,
    },
    data: { isRead: true },
  });
};

/**
 * Delete a notification.
 */
export const deleteNotification = async (id) => {
  return prisma.notification.delete({ where: { id } });
};
