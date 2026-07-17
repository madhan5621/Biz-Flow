import { Router } from 'express';
import * as reportController from '../controllers/report.controller.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

router.use(authenticate);

// GET /api/reports/revenue
router.get('/revenue', reportController.getRevenueReport);

// GET /api/reports/expenses
router.get('/expenses', reportController.getExpenseReport);

// GET /api/reports/products
router.get('/products', reportController.getProductReport);

// GET /api/reports/export/csv
router.get('/export/csv', reportController.exportCSV);

export default router;
