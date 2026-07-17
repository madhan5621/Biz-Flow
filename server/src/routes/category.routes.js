import { Router } from 'express';
import * as categoryController from '../controllers/category.controller.js';
import { authenticate, authorize } from '../middleware/auth.js';
import validate from '../middleware/validate.js';
import { createCategorySchema, updateCategorySchema } from '../validators/category.validator.js';

const router = Router();

// All category routes require authentication
router.use(authenticate);

// GET /api/categories/list — lightweight list for dropdowns (must be before /:id)
router.get('/list', categoryController.getCategoriesList);

// GET /api/categories
router.get('/', categoryController.getCategories);

// GET /api/categories/:id
router.get('/:id', categoryController.getCategoryById);

// POST /api/categories — admin/manager only
router.post('/', authorize('ADMIN', 'MANAGER'), validate(createCategorySchema), categoryController.createCategory);

// PUT /api/categories/:id — admin/manager only
router.put('/:id', authorize('ADMIN', 'MANAGER'), validate(updateCategorySchema), categoryController.updateCategory);

// DELETE /api/categories/:id — admin only
router.delete('/:id', authorize('ADMIN'), categoryController.deleteCategory);

export default router;
