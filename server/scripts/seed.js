#!/usr/bin/env node
/**
 * scripts/seed.js
 * Creates the admin user from ADMIN_EMAIL / ADMIN_PASSWORD in server/.env.
 *
 * Idempotent: running it multiple times will NOT create duplicate admins.
 * The script exits with code 0 on success or if admin already exists.
 *
 * Usage:
 *   cd server && npm run seed
 */
import 'dotenv/config';
import bcrypt      from 'bcryptjs';
import { connectDB } from '../src/config/db.js';
import { env }       from '../src/config/env.js';
import User          from '../src/models/User.js';

async function seed() {
  // Validate required seed vars before connecting
  if (!env.ADMIN_EMAIL || !env.ADMIN_PASSWORD) {
    console.error('❌  ADMIN_EMAIL and ADMIN_PASSWORD must be set in server/.env');
    process.exit(1);
  }

  await connectDB();

  const adminEmail = env.ADMIN_EMAIL.trim().toLowerCase();

  // Check for existing admin (idempotency guard)
  const existing = await User.findOne({ email: adminEmail });
  if (existing) {
    console.log(`✅  Admin already exists (${adminEmail}). Nothing to do.`);
    process.exit(0);
  }

  const passwordHash = await bcrypt.hash(env.ADMIN_PASSWORD, 12);

  await User.create({
    name:               'Admin',
    email:              adminEmail,
    passwordHash,
    role:               'admin',
    verificationStatus: 'approved',
    isSuspended:        false,
  });

  console.log(`✅  Admin user created: ${adminEmail}`);
  process.exit(0);
}

seed().catch((err) => {
  console.error('❌  Seed failed:', err.message);
  process.exit(1);
});
