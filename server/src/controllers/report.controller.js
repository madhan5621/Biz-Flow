import * as reportService from '../services/report.service.js';
import { sendSuccess } from '../utils/response.js';
import asyncHandler from '../utils/asyncHandler.js';

/**
 * GET /api/reports/revenue
 */
export const getRevenueReport = asyncHandler(async (req, res) => {
  const report = await reportService.getRevenueReport(req.query);
  sendSuccess(res, { data: report, message: 'Revenue report retrieved' });
});

/**
 * GET /api/reports/expenses
 */
export const getExpenseReport = asyncHandler(async (_req, res) => {
  const report = await reportService.getExpenseReport();
  sendSuccess(res, { data: report, message: 'Expense report retrieved' });
});

/**
 * GET /api/reports/products
 */
export const getProductReport = asyncHandler(async (_req, res) => {
  const report = await reportService.getProductReport();
  sendSuccess(res, { data: report, message: 'Product report retrieved' });
});

/**
 * GET /api/reports/export/csv
 */
export const exportCSV = asyncHandler(async (req, res) => {
  const type = req.query.type || 'revenue';
  const csv = await reportService.exportReportCSV(type);

  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', `attachment; filename=${type}_report_${Date.now()}.csv`);
  res.send(csv);
});
