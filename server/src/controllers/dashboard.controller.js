import * as dashboardService from '../services/dashboard.service.js';
import { sendSuccess } from '../utils/response.js';
import asyncHandler from '../utils/asyncHandler.js';

/**
 * GET /api/dashboard/stats
 */
export const getStats = asyncHandler(async (_req, res) => {
  const stats = await dashboardService.getStats();
  sendSuccess(res, { data: stats, message: 'Dashboard stats retrieved' });
});

/**
 * GET /api/dashboard/revenue-chart
 */
export const getRevenueChart = asyncHandler(async (_req, res) => {
  const data = await dashboardService.getRevenueChart();
  sendSuccess(res, { data, message: 'Revenue chart data retrieved' });
});

/**
 * GET /api/dashboard/expense-chart
 */
export const getExpenseChart = asyncHandler(async (_req, res) => {
  const data = await dashboardService.getExpenseChart();
  sendSuccess(res, { data, message: 'Expense chart data retrieved' });
});

/**
 * GET /api/dashboard/recent-activities
 */
export const getRecentActivities = asyncHandler(async (req, res) => {
  const limit = parseInt(req.query.limit, 10) || 10;
  const data = await dashboardService.getRecentActivities(limit);
  sendSuccess(res, { data, message: 'Recent activities retrieved' });
});

/**
 * GET /api/dashboard/top-products
 */
export const getTopProducts = asyncHandler(async (req, res) => {
  const limit = parseInt(req.query.limit, 10) || 5;
  const data = await dashboardService.getTopProducts(limit);
  sendSuccess(res, { data, message: 'Top products retrieved' });
});
