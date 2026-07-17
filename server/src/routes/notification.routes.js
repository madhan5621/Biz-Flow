import { Router } from 'express';
import * as notificationController from '../controllers/notification.controller.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

router.use(authenticate);

// PUT /api/notifications/read-all — must be before /:id
router.put('/read-all', notificationController.markAllAsRead);

// GET /api/notifications
router.get('/', notificationController.getNotificationsWithMeta);

// PUT /api/notifications/:id/read
router.put('/:id/read', notificationController.markAsRead);

// DELETE /api/notifications/:id
router.delete('/:id', notificationController.deleteNotification);

export default router;
