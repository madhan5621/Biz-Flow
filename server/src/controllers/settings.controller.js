import * as settingsService from '../services/settings.service.js';
import { logActivity, getClientIp } from '../services/activity.service.js';
import { sendSuccess } from '../utils/response.js';
import asyncHandler from '../utils/asyncHandler.js';

/**
 * GET /api/settings
 */
export const getSettings = asyncHandler(async (_req, res) => {
  const settings = await settingsService.getSettings();
  sendSuccess(res, { data: settings, message: 'Settings retrieved' });
});

/**
 * PUT /api/settings
 */
export const updateSettings = asyncHandler(async (req, res) => {
  const settings = await settingsService.updateSettings(req.body);

  await logActivity({
    userId: req.user.id,
    action: 'UPDATE',
    entity: 'Settings',
    entityId: settings.id,
    details: 'Updated company settings',
    ipAddress: getClientIp(req),
  });

  sendSuccess(res, { data: settings, message: 'Settings updated successfully' });
});
