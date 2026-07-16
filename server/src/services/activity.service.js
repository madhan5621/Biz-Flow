import prisma from '../config/db.js';

/**
 * Log an activity (login, logout, create, update, delete, etc.)
 */
export const logActivity = async ({ userId, action, entity, entityId = null, details = null, ipAddress = null }) => {
  try {
    await prisma.activityLog.create({
      data: {
        userId,
        action,
        entity,
        entityId,
        details,
        ipAddress,
      },
    });
  } catch (error) {
    // Silent fail — activity logging should never break the app
    console.error('Activity log error:', error.message);
  }
};

/**
 * Get the client's IP address from the request.
 */
export const getClientIp = (req) => {
  return req.headers['x-forwarded-for']?.split(',')[0]?.trim() || req.socket?.remoteAddress || null;
};
