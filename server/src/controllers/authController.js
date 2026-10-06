/**
 * src/controllers/authController.js
 * Thin controllers — parse req/res, delegate to authService, format response.
 * No business logic lives here.
 */
import asyncHandler  from '../utils/asyncHandler.js';
import * as authSvc  from '../services/authService.js';

// ── POST /api/auth/signup ────────────────────────────────────────────────────
export const signup = asyncHandler(async (req, res) => {
  // req.file.savedPath is set by the upload middleware (or null if no file)
  const docPath = req.file?.savedPath ?? null;

  const user = await authSvc.signup(req.body, docPath);

  res.status(201).json({
    success: true,
    data: {
      message:
        'Account created successfully. Your verification document has been submitted. ' +
        'Please wait for admin approval before you can post or claim items.',
      user,
    },
  });
});

// ── POST /api/auth/login ─────────────────────────────────────────────────────
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await authSvc.login(email, password, res);

  res.json({
    success: true,
    data: {
      message: `Welcome back, ${user.name}!`,
      user,
    },
  });
});

// ── POST /api/auth/logout ────────────────────────────────────────────────────
export const logout = asyncHandler(async (_req, res) => {
  authSvc.logout(res);
  res.json({ success: true, data: { message: 'Logged out successfully.' } });
});

// ── GET /api/auth/me ─────────────────────────────────────────────────────────
export const me = asyncHandler(async (req, res) => {
  res.json({
    success: true,
    data: { user: req.user },
  });
});

// ── POST /api/auth/resubmit-document ────────────────────────────────────────
export const resubmitDocument = asyncHandler(async (req, res) => {
  const docPath = req.file?.savedPath ?? null;
  const user    = await authSvc.resubmitDocument(req.user._id, docPath);

  res.json({
    success: true,
    data: {
      message: 'Document resubmitted. Your account is now pending review.',
      user,
    },
  });
});
