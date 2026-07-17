import { Router } from 'express';
import * as dashboardController from '../controllers/dashboard.controller.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

// All dashboard routes require authentication
router.use(authenticate);

// GET /api/dashboard/stats
router.get('/stats', dashboardController.getStats);

// GET /api/dashboard/revenue-chart
router.get('/revenue-chart', dashboardController.getRevenueChart);

// GET /api/dashboard/expense-chart
router.get('/expense-chart', dashboardController.getExpenseChart);

// GET /api/dashboard/recent-activities
router.get('/recent-activities', dashboardController.getRecentActivities);

// GET /api/dashboard/top-products
router.get('/top-products', dashboardController.getTopProducts);

export default router;
