import * as expenseService from '../services/expense.service.js';
import { logActivity, getClientIp } from '../services/activity.service.js';
import { sendSuccess, sendPaginated } from '../utils/response.js';
import asyncHandler from '../utils/asyncHandler.js';

/**
 * GET /api/expenses
 */
export const getExpenses = asyncHandler(async (req, res) => {
  const { expenses, total, page, limit } = await expenseService.getExpenses(req.query);

  sendPaginated(res, {
    data: expenses,
    page,
    limit,
    total,
    message: 'Expenses retrieved',
  });
});

/**
 * GET /api/expenses/categories
 */
export const getExpenseCategories = asyncHandler(async (_req, res) => {
  const categories = await expenseService.getExpenseCategories();
  sendSuccess(res, { data: categories, message: 'Expense categories retrieved' });
});

/**
 * GET /api/expenses/monthly
 */
export const getMonthlyExpenses = asyncHandler(async (_req, res) => {
  const data = await expenseService.getMonthlyExpenses();
  sendSuccess(res, { data, message: 'Monthly expenses retrieved' });
});

/**
 * GET /api/expenses/:id
 */
export const getExpenseById = asyncHandler(async (req, res) => {
  const expense = await expenseService.getExpenseById(req.params.id);
  sendSuccess(res, { data: expense, message: 'Expense retrieved' });
});

/**
 * POST /api/expenses
 */
export const createExpense = asyncHandler(async (req, res) => {
  const expense = await expenseService.createExpense(req.body);

  await logActivity({
    userId: req.user.id,
    action: 'CREATE',
    entity: 'Expense',
    entityId: expense.id,
    details: `Created expense: ${expense.title}`,
    ipAddress: getClientIp(req),
  });

  sendSuccess(res, {
    data: expense,
    message: 'Expense created successfully',
    statusCode: 201,
  });
});

/**
 * PUT /api/expenses/:id
 */
export const updateExpense = asyncHandler(async (req, res) => {
  const expense = await expenseService.updateExpense(req.params.id, req.body);

  await logActivity({
    userId: req.user.id,
    action: 'UPDATE',
    entity: 'Expense',
    entityId: expense.id,
    details: `Updated expense: ${expense.title}`,
    ipAddress: getClientIp(req),
  });

  sendSuccess(res, { data: expense, message: 'Expense updated successfully' });
});

/**
 * DELETE /api/expenses/:id
 */
export const deleteExpense = asyncHandler(async (req, res) => {
  const expense = await expenseService.getExpenseById(req.params.id);
  await expenseService.deleteExpense(req.params.id);

  await logActivity({
    userId: req.user.id,
    action: 'DELETE',
    entity: 'Expense',
    entityId: req.params.id,
    details: `Deleted expense: ${expense.title}`,
    ipAddress: getClientIp(req),
  });

  sendSuccess(res, { message: 'Expense deleted successfully' });
});
