/**
 * src/routes/auth.js
 * Auth router – all /api/auth/* endpoints.
 *
 * Rate limiting:
 *   authLimiter → 10 requests / 15 min (signup & login only)
 *   This is separate from the global 200 req/15 min applied in app.js.
 *
 * Middleware chain for signup:
 *   authLimiter → uploadVerificationDoc → validate(signupSchema) → controller
 *
 * Note: validate() runs AFTER the upload middleware because multer must parse
 * the multipart body before Zod can inspect the text fields.
 */
import { Router }     from 'express';
import path           from 'path';
import { fileURLToPath } from 'url';
import rateLimit      from 'express-rate-limit';

import * as authCtrl   from '../controllers/authController.js';
import { requireAuth } from '../middleware/auth.js';
import { validate }    from '../middleware/validate.js';
import { singleUpload } from '../middleware/upload.js';
import { signupSchema, loginSchema } from '../validators/authSchemas.js';

import { VERIFICATION_DIR } from '../config/uploadDirs.js';

// ── Strict rate limiter for auth endpoints ────────────────────────────────────
const authLimiter = rateLimit({
  windowMs:        15 * 60 * 1000, // 15 minutes
  max:             process.env.NODE_ENV === 'test' ? 1000 : 10,
  standardHeaders: true,
  legacyHeaders:   false,
  message: {
    success: false,
    error: {
      code:    'TOO_MANY_REQUESTS',
      message: 'Too many attempts from this IP. Please try again in 15 minutes.',
    },
  },
});

const router = Router();

// POST /api/auth/signup
router.post(
  '/signup',
  authLimiter,
  singleUpload('document', VERIFICATION_DIR, true), // multer + magic-byte check
  validate(signupSchema),                            // zod field validation
  authCtrl.signup,
);

// POST /api/auth/login
router.post(
  '/login',
  authLimiter,
  validate(loginSchema),
  authCtrl.login,
);

// POST /api/auth/logout
router.post('/logout', authCtrl.logout);

// GET /api/auth/me  (requireAuth: pending/rejected users allowed)
router.get('/me', requireAuth, authCtrl.me);

// POST /api/auth/resubmit-document  (rejected users only)
router.post(
  '/resubmit-document',
  requireAuth,
  authLimiter,
  singleUpload('document', VERIFICATION_DIR, true),
  authCtrl.resubmitDocument,
);

export default router;
