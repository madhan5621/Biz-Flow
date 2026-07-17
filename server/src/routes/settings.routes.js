import { Router } from 'express';
import * as settingsController from '../controllers/settings.controller.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = Router();

router.use(authenticate);

// GET /api/settings
router.get('/', settingsController.getSettings);

// PUT /api/settings — admin only
router.put('/', authorize('ADMIN'), settingsController.updateSettings);

export default router;
