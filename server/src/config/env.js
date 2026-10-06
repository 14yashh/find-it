/**
 * src/config/env.js
 * Validates and exports all required environment variables.
 * Throws at startup if anything critical is missing.
 */
import 'dotenv/config';

function required(key) {
  const val = process.env[key];
  if (!val) throw new Error(`Missing required env variable: ${key}`);
  return val;
}

export const env = {
  PORT:            process.env.PORT || '5000',
  MONGODB_URI:     (process.env.NODE_ENV === 'test' 
                      ? (process.env.MONGODB_URI_TEST || process.env.MONGODB_URI + '_test')
                      : required('MONGODB_URI')),
  JWT_SECRET:      required('JWT_SECRET'),
  JWT_EXPIRES_IN:  process.env.JWT_EXPIRES_IN || '7d',
  CLIENT_URL:      process.env.CLIENT_URL || 'http://localhost:5173',
  ADMIN_EMAIL:     process.env.ADMIN_EMAIL || '',
  ADMIN_PASSWORD:  process.env.ADMIN_PASSWORD || '',
  NODE_ENV:        process.env.NODE_ENV || 'development',

  // Email
  EMAIL_ENABLED:   process.env.EMAIL_ENABLED === 'true',
  EMAIL_HOST:      process.env.EMAIL_HOST || '',
  EMAIL_PORT:      Number(process.env.EMAIL_PORT) || 587,
  EMAIL_USER:      process.env.EMAIL_USER || '',
  EMAIL_PASS:      process.env.EMAIL_PASS || '',
  EMAIL_FROM:      process.env.EMAIL_FROM || '',

  DELETE_DOC_AFTER_APPROVAL: process.env.DELETE_DOC_AFTER_APPROVAL === 'true',
};
