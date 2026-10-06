/**
 * src/middleware/errorHandler.js
 * Central error-handling middleware (must be the LAST middleware registered).
 *
 * Handles:
 *  - ApiError instances (known, intentional errors)
 *  - Mongoose ValidationError / CastError
 *  - Mongoose duplicate-key (E11000)
 *  - JWT errors
 *  - Everything else → 500
 *
 * Response shape: { success: false, error: { code, message } }
 */
import mongoose from 'mongoose';
import { ApiError } from '../utils/ApiError.js';
import { env } from '../config/env.js';

// eslint-disable-next-line no-unused-vars
export function errorHandler(err, req, res, next) {
  // -- Body-parser: malformed JSON -------------------------------------------
  // express.json() sets err.type = 'entity.parse.failed' on SyntaxErrors
  if (err.type === 'entity.parse.failed' || (err instanceof SyntaxError && err.status === 400)) {
    return res.status(400).json({
      success: false,
      error: { code: 'BAD_REQUEST', message: 'Invalid JSON in request body.' },
    });
  }

  // -- Mongoose: bad ObjectId ------------------------------------------------
  if (err.name === 'CastError' && err.kind === 'ObjectId') {
    return res.status(400).json({
      success: false,
      error: { code: 'BAD_REQUEST', message: 'Invalid resource ID.' },
    });
  }

  // -- Mongoose: schema validation -------------------------------------------
  if (err instanceof mongoose.Error.ValidationError) {
    const messages = Object.values(err.errors).map((e) => e.message).join(', ');
    return res.status(422).json({
      success: false,
      error: { code: 'VALIDATION_ERROR', message: messages },
    });
  }

  // -- MongoDB: duplicate key (E11000) ---------------------------------------
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue || {}).join(', ') || 'field';
    return res.status(409).json({
      success: false,
      error: {
        code: 'CONFLICT',
        message: `A record with this ${field} already exists.`,
      },
    });
  }

  // -- JWT errors ------------------------------------------------------------
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      success: false,
      error: { code: 'UNAUTHORIZED', message: 'Invalid token.' },
    });
  }
  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      success: false,
      error: { code: 'UNAUTHORIZED', message: 'Token expired.' },
    });
  }

  // -- Our own ApiError ------------------------------------------------------
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      success: false,
      error: { code: err.code, message: err.message },
    });
  }

  // -- Unknown / unexpected errors -------------------------------------------
  // Only expose details in development
  const message =
    env.NODE_ENV === 'development'
      ? err.message
      : 'An unexpected error occurred.';

  console.error('[ErrorHandler]', err);

  return res.status(500).json({
    success: false,
    error: { code: 'INTERNAL_SERVER_ERROR', message },
  });
}
