/**
 * src/middleware/notFound.js
 * 404 handler — registered AFTER all routes.
 * Forwards an ApiError so the central errorHandler formats it consistently.
 */
import { ApiError } from '../utils/ApiError.js';

export function notFound(req, _res, next) {
  next(new ApiError(404, `Route not found: ${req.method} ${req.originalUrl}`, 'NOT_FOUND'));
}
