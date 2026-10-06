/**
 * src/middleware/auth.js
 * requireAuth – verifies the JWT httpOnly cookie and attaches req.user.
 *
 * Suspended users are blocked here (403) so all downstream middleware and
 * controllers can assume req.user is an active account.
 *
 * Pending and rejected users are allowed through — they need to reach
 * GET /api/auth/me to see their verification status.
 * The requireApproved middleware (approved.js) guards resource endpoints.
 */
import jwt          from 'jsonwebtoken';
import { env }      from '../config/env.js';
import { ApiError } from '../utils/ApiError.js';
import asyncHandler from '../utils/asyncHandler.js';
import User         from '../models/User.js';

export const requireAuth = asyncHandler(async (req, _res, next) => {
  const token = req.cookies?.token;
  if (!token) {
    throw new ApiError(401, 'Authentication required.', 'UNAUTHORIZED');
  }

  // jwt.verify throws JsonWebTokenError / TokenExpiredError
  // → caught by the central errorHandler and returned as 401
  const decoded = jwt.verify(token, env.JWT_SECRET);

  // Load fresh user data on every request (catches status changes mid-session)
  const user = await User.findById(decoded.id);
  if (!user) {
    throw new ApiError(401, 'User no longer exists.', 'UNAUTHORIZED');
  }

  if (user.isSuspended) {
    throw new ApiError(403, 'Your account has been suspended. Please contact support.', 'FORBIDDEN');
  }

  req.user = user;
  next();
});
