/**
 * src/middleware/approved.js
 * requireApproved – must be chained AFTER requireAuth.
 *
 * Blocks pending and rejected users from accessing resource endpoints.
 * Pending users can still reach /api/auth/me to check their status.
 */
import { ApiError } from '../utils/ApiError.js';

export function requireApproved(req, _res, next) {
  if (req.user.verificationStatus !== 'approved') {
    return next(
      new ApiError(
        403,
        'Your account is pending verification. Please wait for admin approval.',
        'NOT_APPROVED',
      ),
    );
  }
  next();
}
