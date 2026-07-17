import { Router } from 'express';
import * as activityLogController from '../controllers/activitylog.controller.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = Router();

router.use(authenticate);

// Only admin/manager can view activity logs
router.use(authorize('ADMIN', 'MANAGER'));

// GET /api/activity-logs/actions — must be before /:id
router.get('/actions', activityLogController.getActions);

// GET /api/activity-logs/entities
router.get('/entities', activityLogController.getEntities);

// GET /api/activity-logs
router.get('/', activityLogController.getActivityLogs);

export default router;
