/**
 * src/utils/token.js
 * JWT signing, cookie attachment, and cookie clearing helpers.
 * All token behaviour is centralised here so changing the strategy
 * (e.g. rotating refresh tokens) only requires editing this file.
 */
import jwt      from 'jsonwebtoken';
import { env }  from '../config/env.js';

// ── Duration parser ───────────────────────────────────────────────────────────
const DURATION_RE  = /^(\d+)([smhd])$/;
const UNIT_MS      = { s: 1_000, m: 60_000, h: 3_600_000, d: 86_400_000 };

/**
 * Converts a duration string like "7d", "1h", "30m" to milliseconds.
 * Falls back to 7 days if the string is unparseable.
 * @param {string} str
 * @returns {number}
 */
export function parseDurationMs(str = '') {
  const m = DURATION_RE.exec(str);
  if (!m) return 7 * UNIT_MS.d;
  return parseInt(m[1], 10) * UNIT_MS[m[2]];
}

// ── Token helpers ─────────────────────────────────────────────────────────────

/** Signs a JWT with the user's id as the payload. */
export function signToken(userId) {
  return jwt.sign({ id: String(userId) }, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN,
  });
}

/** Cookie options shared by attach and clear. */
function cookieOptions(extra = {}) {
  return {
    httpOnly: true,
    // sameSite strict in production prevents CSRF; lax is fine for local dev
    sameSite: env.NODE_ENV === 'production' ? 'strict' : 'lax',
    // secure flag requires HTTPS — only meaningful in production
    secure:   env.NODE_ENV === 'production',
    ...extra,
  };
}

/** Attaches the JWT as an httpOnly cookie on the response. */
export function attachCookie(res, token) {
  res.cookie('token', token, cookieOptions({ maxAge: parseDurationMs(env.JWT_EXPIRES_IN) }));
}

/** Clears the auth cookie (sets maxAge to 0). */
export function clearCookie(res) {
  res.clearCookie('token', cookieOptions());
}
