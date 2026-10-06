/**
 * src/services/authService.js
 * Business logic for all auth operations.
 * Controllers call these functions; they throw ApiErrors on known failures.
 *
 * Design decisions:
 *  - signup() checks for duplicate email BEFORE hashing to short-circuit quickly,
 *    then cleans up the uploaded file on any DB failure (no orphans).
 *  - login() uses the same generic error for wrong email and wrong password
 *    to prevent user-enumeration attacks.
 *  - Suspended users are rejected at both login() AND in requireAuth middleware
 *    so that a suspension takes effect immediately even for already-logged-in users.
 */
import bcrypt        from 'bcryptjs';
import fs            from 'fs/promises';
import { ApiError }  from '../utils/ApiError.js';
import User          from '../models/User.js';
import { signToken, attachCookie, clearCookie } from '../utils/token.js';

const BCRYPT_ROUNDS = 12;

// ── Signup ────────────────────────────────────────────────────────────────────

/**
 * Creates a new student user with verificationStatus "pending".
 *
 * @param {{ name, email, password, department, year, phone? }} fields
 * @param {string|null} docPath – Absolute path to the saved verification document
 * @returns {Promise<import('../models/User.js').default>}
 */
export async function signup(fields, docPath) {
  const { name, email, password, department, year, phone } = fields;

  // Duplicate email check — give a clear 409 rather than leaking a Mongoose error
  const exists = await User.findOne({ email });
  if (exists) {
    // File was already written to disk; clean it up before rejecting
    if (docPath) await fs.unlink(docPath).catch(() => {});
    throw new ApiError(
      409,
      'An account with this email already exists.',
      'EMAIL_CONFLICT',
    );
  }

  const passwordHash = await bcrypt.hash(password, BCRYPT_ROUNDS);

  let user;
  try {
    user = await User.create({
      name,
      email,
      passwordHash,
      department,
      year,
      phone,
      verificationDocPath: docPath,
    });
  } catch (err) {
    // DB insert failed (e.g. race-condition duplicate, validation error)
    // Clean up the uploaded file so we don't leave orphans on disk
    if (docPath) await fs.unlink(docPath).catch(() => {});
    throw err; // Let the central error handler deal with E11000 / ValidationError
  }

  return user;
}

// ── Login ─────────────────────────────────────────────────────────────────────

/**
 * Verifies credentials. On success, signs a JWT and attaches it as a cookie.
 *
 * @param {string}                              email
 * @param {string}                              password
 * @param {import('express').Response}          res
 * @returns {Promise<import('../models/User.js').default>}
 */
export async function login(email, password, res) {
  // Single generic error prevents user-enumeration
  const INVALID_CREDS = new ApiError(
    401,
    'Invalid email or password.',
    'INVALID_CREDENTIALS',
  );

  // Must select +passwordHash because it has select:false in the schema
  const user = await User.findOne({ email }).select('+passwordHash');
  if (!user) throw INVALID_CREDS;

  // Check suspension before bcrypt to avoid unnecessary work
  if (user.isSuspended) {
    throw new ApiError(
      403,
      'Your account has been suspended. Please contact support.',
      'FORBIDDEN',
    );
  }

  const isMatch = await bcrypt.compare(password, user.passwordHash);
  if (!isMatch) throw INVALID_CREDS;

  const token = signToken(user._id);
  attachCookie(res, token);

  return user;
}

// ── Logout ────────────────────────────────────────────────────────────────────

/** Clears the auth cookie. */
export function logout(res) {
  clearCookie(res);
}

// ── Resubmit verification document ───────────────────────────────────────────

/**
 * Allows a rejected user to upload a new verification document.
 * Deletes the old document from disk and resets status to "pending".
 *
 * @param {string} userId
 * @param {string} newDocPath – Absolute path to the newly uploaded file
 * @returns {Promise<import('../models/User.js').default>}
 */
export async function resubmitDocument(userId, newDocPath) {
  // We need verificationDocPath to delete the old file → select it explicitly
  const user = await User.findById(userId).select('+verificationDocPath');
  if (!user) {
    if (newDocPath) await fs.unlink(newDocPath).catch(() => {});
    throw new ApiError(404, 'User not found.', 'NOT_FOUND');
  }

  if (user.verificationStatus !== 'rejected') {
    if (newDocPath) await fs.unlink(newDocPath).catch(() => {});
    throw new ApiError(
      409,
      'Only accounts with rejected status can resubmit a verification document.',
      'CONFLICT',
    );
  }

  // Delete the old document from disk (best-effort; don't fail if missing)
  if (user.verificationDocPath) {
    await fs.unlink(user.verificationDocPath).catch(() => {});
  }

  user.verificationDocPath = newDocPath;
  user.verificationStatus  = 'pending';
  user.rejectionReason     = undefined;
  user.verifiedBy          = undefined;
  user.verifiedAt          = undefined;
  await user.save();

  return user;
}
