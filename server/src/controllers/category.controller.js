import * as categoryService from '../services/category.service.js';
import { logActivity, getClientIp } from '../services/activity.service.js';
import { sendSuccess, sendPaginated } from '../utils/response.js';
import asyncHandler from '../utils/asyncHandler.js';

/**
 * GET /api/categories
 */
export const getCategories = asyncHandler(async (req, res) => {
  const { categories, total, page, limit } = await categoryService.getCategories(req.query);

  sendPaginated(res, {
    data: categories,
    page,
    limit,
    total,
    message: 'Categories retrieved',
  });
});

/**
 * GET /api/categories/list
 */
export const getCategoriesList = asyncHandler(async (_req, res) => {
  const categories = await categoryService.getCategoriesList();
  sendSuccess(res, { data: categories, message: 'Categories list retrieved' });
});

/**
 * GET /api/categories/:id
 */
export const getCategoryById = asyncHandler(async (req, res) => {
  const category = await categoryService.getCategoryById(req.params.id);
  sendSuccess(res, { data: category, message: 'Category retrieved' });
});

/**
 * POST /api/categories
 */
export const createCategory = asyncHandler(async (req, res) => {
  const category = await categoryService.createCategory(req.body);

  await logActivity({
    userId: req.user.id,
    action: 'CREATE',
    entity: 'Category',
    entityId: category.id,
    details: `Created category: ${category.name}`,
    ipAddress: getClientIp(req),
  });

  sendSuccess(res, {
    data: category,
    message: 'Category created successfully',
    statusCode: 201,
  });
});

/**
 * PUT /api/categories/:id
 */
export const updateCategory = asyncHandler(async (req, res) => {
  const category = await categoryService.updateCategory(req.params.id, req.body);

  await logActivity({
    userId: req.user.id,
    action: 'UPDATE',
    entity: 'Category',
    entityId: category.id,
    details: `Updated category: ${category.name}`,
    ipAddress: getClientIp(req),
  });

  sendSuccess(res, { data: category, message: 'Category updated successfully' });
});

/**
 * DELETE /api/categories/:id
 */
export const deleteCategory = asyncHandler(async (req, res) => {
  const category = await categoryService.getCategoryById(req.params.id);
  await categoryService.deleteCategory(req.params.id);

  await logActivity({
    userId: req.user.id,
    action: 'DELETE',
    entity: 'Category',
    entityId: req.params.id,
    details: `Deleted category: ${category.name}`,
    ipAddress: getClientIp(req),
  });

  sendSuccess(res, { message: 'Category deleted successfully' });
});
