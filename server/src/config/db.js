/**
 * src/config/db.js
 * Establishes a Mongoose connection to MongoDB.
 * Exits the process on initial connection failure.
 */
import mongoose from 'mongoose';
import { env } from './env.js';

export async function connectDB() {
  if (env.NODE_ENV === 'test' && !env.MONGODB_URI.endsWith('_test')) {
    throw new Error(`Test database URI must end with "_test". Got: ${env.MONGODB_URI}`);
  }
  try {
    const conn = await mongoose.connect(env.MONGODB_URI);
    console.log(`✅  MongoDB connected: ${conn.connection.host}`);
  } catch (err) {
    console.error(`❌  MongoDB connection failed: ${err.message}`);
    // In test mode re-throw so Jest can surface the error; otherwise exit.
    if (env.NODE_ENV === 'test') throw err;
    process.exit(1);
  }
}
