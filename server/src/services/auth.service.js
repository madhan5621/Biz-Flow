import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import prisma from '../config/db.js';
import config from '../config/index.js';
import { ConflictError, UnauthorizedError, NotFoundError, ValidationError } from '../utils/errors.js';

// ─── Token Helpers ──────────────────────────────────────────────────────────

const generateAccessToken = (userId) => {
  return jwt.sign({ userId }, config.jwt.secret, {
    expiresIn: config.jwt.expiresIn,
  });
};

const generateRefreshToken = (userId) => {
  return jwt.sign({ userId }, config.jwt.refreshSecret, {
    expiresIn: config.jwt.refreshExpiresIn,
  });
};

const generateTokenPair = (userId) => ({
  accessToken: generateAccessToken(userId),
  refreshToken: generateRefreshToken(userId),
});

const sanitizeUser = (user) => ({
  id: user.id,
  name: user.name,
  email: user.email,
  role: user.role,
  avatar: user.avatar,
  isActive: user.isActive,
  createdAt: user.createdAt,
});

// ─── Auth Service ───────────────────────────────────────────────────────────

/**
 * Register a new user.
 */
export const register = async ({ name, email, password, role }) => {
  // Check if email already exists
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    throw new ConflictError('A user with this email already exists');
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, config.bcrypt.saltRounds);

  // Create user
  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      role: role || 'EMPLOYEE',
    },
  });

  // Generate tokens
  const tokens = generateTokenPair(user.id);

  // Store refresh token
  await prisma.user.update({
    where: { id: user.id },
    data: { refreshToken: tokens.refreshToken },
  });

  return {
    user: sanitizeUser(user),
    ...tokens,
  };
};

/**
 * Login with email and password.
 */
export const login = async ({ email, password }) => {
  // Find user by email
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    throw new UnauthorizedError('Invalid email or password');
  }

  // Check if user is active
  if (!user.isActive) {
    throw new UnauthorizedError('Your account has been deactivated. Please contact an administrator.');
  }

  // Verify password
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new UnauthorizedError('Invalid email or password');
  }

  // Generate tokens
  const tokens = generateTokenPair(user.id);

  // Store refresh token
  await prisma.user.update({
    where: { id: user.id },
    data: { refreshToken: tokens.refreshToken },
  });

  return {
    user: sanitizeUser(user),
    ...tokens,
  };
};

/**
 * Logout — clear refresh token.
 */
export const logout = async (userId) => {
  await prisma.user.update({
    where: { id: userId },
    data: { refreshToken: null },
  });
};

/**
 * Refresh access token using a valid refresh token.
 * Implements token rotation — old refresh token is invalidated.
 */
export const refreshToken = async (token) => {
  try {
    const decoded = jwt.verify(token, config.jwt.refreshSecret);

    // Find user and verify stored refresh token matches
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
    });

    if (!user || !user.isActive) {
      throw new UnauthorizedError('User not found or inactive');
    }

    if (user.refreshToken !== token) {
      // Possible token reuse attack — invalidate all tokens for this user
      await prisma.user.update({
        where: { id: user.id },
        data: { refreshToken: null },
      });
      throw new UnauthorizedError('Token reuse detected. Please log in again.');
    }

    // Generate new token pair (rotation)
    const tokens = generateTokenPair(user.id);

    // Store new refresh token
    await prisma.user.update({
      where: { id: user.id },
      data: { refreshToken: tokens.refreshToken },
    });

    return {
      ...tokens,
      user: sanitizeUser(user),
    };
  } catch (error) {
    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
      throw new UnauthorizedError('Invalid or expired refresh token');
    }
    throw error;
  }
};

/**
 * Forgot password — generate reset token and store it.
 * In production, this would send an email. For now, we return the token.
 */
export const forgotPassword = async (email) => {
  const user = await prisma.user.findUnique({ where: { email } });

  // Always return success to prevent email enumeration
  if (!user) {
    return { message: 'If an account with that email exists, a password reset link has been sent.' };
  }

  // Generate reset token (URL-safe random string)
  const resetToken = crypto.randomBytes(32).toString('hex');
  const resetTokenExp = new Date(Date.now() + 60 * 60 * 1000); // 1 hour expiry

  // Hash token before storing (so DB compromise doesn't expose valid tokens)
  const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');

  await prisma.user.update({
    where: { id: user.id },
    data: {
      resetToken: hashedToken,
      resetTokenExp,
    },
  });

  // In production, send email with reset link:
  // `${config.clientUrl}/reset-password?token=${resetToken}`
  // For development, we log the token
  if (config.nodeEnv === 'development') {
    console.log(`\n🔑 Password Reset Token for ${email}:`);
    console.log(`   ${resetToken}`);
    console.log(`   URL: ${config.clientUrl}/reset-password?token=${resetToken}\n`);
  }

  return {
    message: 'If an account with that email exists, a password reset link has been sent.',
    // Include resetToken in dev mode for testing
    ...(config.nodeEnv === 'development' && { resetToken }),
  };
};

/**
 * Reset password using the reset token.
 */
export const resetPassword = async ({ token, password }) => {
  // Hash the provided token to compare with stored hash
  const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

  const user = await prisma.user.findFirst({
    where: {
      resetToken: hashedToken,
      resetTokenExp: { gt: new Date() }, // Token must not be expired
    },
  });

  if (!user) {
    throw new ValidationError('Invalid or expired reset token');
  }

  // Hash new password
  const hashedPassword = await bcrypt.hash(password, config.bcrypt.saltRounds);

  // Update password and clear reset token
  await prisma.user.update({
    where: { id: user.id },
    data: {
      password: hashedPassword,
      resetToken: null,
      resetTokenExp: null,
      refreshToken: null, // Invalidate all sessions
    },
  });

  return { message: 'Password reset successful. Please log in with your new password.' };
};

/**
 * Get current authenticated user's profile.
 */
export const getMe = async (userId) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      avatar: true,
      isActive: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  if (!user) {
    throw new NotFoundError('User');
  }

  return user;
};
