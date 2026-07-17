import prisma from '../config/db.js';
import { sendSuccess, sendPaginated } from '../utils/response.js';
import asyncHandler from '../utils/asyncHandler.js';
import { parsePagination } from '../utils/pagination.js';

/**
 * GET /api/activity-logs
 */
export const getActivityLogs = asyncHandler(async (req, res) => {
  const { page, limit, skip } = parsePagination(req.query);

  const where = {};

  if (req.query.search) {
    where.OR = [
      { action: { contains: req.query.search, mode: 'insensitive' } },
      { entity: { contains: req.query.search, mode: 'insensitive' } },
      { details: { contains: req.query.search, mode: 'insensitive' } },
      { user: { name: { contains: req.query.search, mode: 'insensitive' } } },
    ];
  }

  if (req.query.action) {
    where.action = req.query.action;
  }

  if (req.query.entity) {
    where.entity = req.query.entity;
  }

  const [logs, total] = await Promise.all([
    prisma.activityLog.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
      include: {
        user: {
          select: { id: true, name: true, email: true, avatar: true, role: true },
        },
      },
    }),
    prisma.activityLog.count({ where }),
  ]);

  sendPaginated(res, {
    data: logs,
    page,
    limit,
    total,
    message: 'Activity logs retrieved',
  });
});

/**
 * GET /api/activity-logs/actions — unique action types for filter
 */
export const getActions = asyncHandler(async (_req, res) => {
  const result = await prisma.activityLog.findMany({
    select: { action: true },
    distinct: ['action'],
    orderBy: { action: 'asc' },
  });
  sendSuccess(res, { data: result.map((r) => r.action), message: 'Actions retrieved' });
});

/**
 * GET /api/activity-logs/entities — unique entity types for filter
 */
export const getEntities = asyncHandler(async (_req, res) => {
  const result = await prisma.activityLog.findMany({
    select: { entity: true },
    distinct: ['entity'],
    orderBy: { entity: 'asc' },
  });
  sendSuccess(res, { data: result.map((r) => r.entity), message: 'Entities retrieved' });
});
