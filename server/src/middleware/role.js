/**
 * src/middleware/role.js
 * requireAdmin – must be chained AFTER requireAuth.
 *
 * Restricts access to admin-only routes.
 * Admins are always approved by design (seeded with verificationStatus:"approved"),
 * but requireApproved can still be chained explicitly for defence-in-depth.
 */
import { ApiError } from '../utils/ApiError.js';

export function requireAdmin(req, _res, next) {
  if (req.user.role !== 'admin') {
    return next(new ApiError(403, 'Admin access required.', 'FORBIDDEN'));
  }
  next();
}
