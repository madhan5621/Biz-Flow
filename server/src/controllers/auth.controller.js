import * as authService from '../services/auth.service.js';
import { logActivity, getClientIp } from '../services/activity.service.js';
import { sendSuccess } from '../utils/response.js';
import asyncHandler from '../utils/asyncHandler.js';

/**
 * POST /api/auth/register
 */
export const register = asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body;

  const result = await authService.register({ name, email, password, role });

  // Log activity
  await logActivity({
    userId: result.user.id,
    action: 'REGISTER',
    entity: 'User',
    entityId: result.user.id,
    details: `New user registered: ${result.user.email}`,
    ipAddress: getClientIp(req),
  });

  sendSuccess(res, {
    data: result,
    message: 'Account created successfully',
    statusCode: 201,
  });
});

/**
 * POST /api/auth/login
 */
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const result = await authService.login({ email, password });

  // Log activity
  await logActivity({
    userId: result.user.id,
    action: 'LOGIN',
    entity: 'User',
    entityId: result.user.id,
    details: `User logged in: ${result.user.email}`,
    ipAddress: getClientIp(req),
  });

  sendSuccess(res, {
    data: result,
    message: 'Login successful',
  });
});

/**
 * POST /api/auth/logout
 */
export const logout = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  await authService.logout(userId);

  // Log activity
  await logActivity({
    userId,
    action: 'LOGOUT',
    entity: 'User',
    entityId: userId,
    details: `User logged out`,
    ipAddress: getClientIp(req),
  });

  sendSuccess(res, {
    message: 'Logged out successfully',
  });
});

/**
 * POST /api/auth/refresh-token
 */
export const refreshToken = asyncHandler(async (req, res) => {
  const { refreshToken: token } = req.body;

  const result = await authService.refreshToken(token);

  sendSuccess(res, {
    data: result,
    message: 'Token refreshed successfully',
  });
});

/**
 * POST /api/auth/forgot-password
 */
export const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;

  const result = await authService.forgotPassword(email);

  sendSuccess(res, {
    data: result,
    message: result.message,
  });
});

/**
 * POST /api/auth/reset-password
 */
export const resetPassword = asyncHandler(async (req, res) => {
  const { token, password } = req.body;

  const result = await authService.resetPassword({ token, password });

  sendSuccess(res, {
    message: result.message,
  });
});

/**
 * GET /api/auth/me
 */
export const getMe = asyncHandler(async (req, res) => {
  const user = await authService.getMe(req.user.id);

  sendSuccess(res, {
    data: user,
    message: 'User profile retrieved',
  });
});
