import { Router } from 'express';
import * as expenseController from '../controllers/expense.controller.js';
import { authenticate, authorize } from '../middleware/auth.js';
import validate from '../middleware/validate.js';
import { createExpenseSchema, updateExpenseSchema } from '../validators/expense.validator.js';

const router = Router();

router.use(authenticate);

// GET /api/expenses/categories — must be before /:id
router.get('/categories', expenseController.getExpenseCategories);

// GET /api/expenses/monthly
router.get('/monthly', expenseController.getMonthlyExpenses);

// GET /api/expenses
router.get('/', expenseController.getExpenses);

// GET /api/expenses/:id
router.get('/:id', expenseController.getExpenseById);

// POST /api/expenses — admin/manager only
router.post('/', authorize('ADMIN', 'MANAGER'), validate(createExpenseSchema), expenseController.createExpense);

// PUT /api/expenses/:id — admin/manager only
router.put('/:id', authorize('ADMIN', 'MANAGER'), validate(updateExpenseSchema), expenseController.updateExpense);

// DELETE /api/expenses/:id — admin only
router.delete('/:id', authorize('ADMIN'), expenseController.deleteExpense);

export default router;
