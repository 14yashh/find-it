import mongoose from 'mongoose';
import { connectDB } from '../src/config/db.js';
import fs from 'fs/promises';
import { UPLOADS_ROOT } from '../src/config/uploadDirs.js';

beforeAll(async () => {
  await connectDB();
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();

  // Clean up test uploads directory
  await fs.rm(UPLOADS_ROOT, { recursive: true, force: true }).catch(() => {});
});

afterEach(async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    await collections[key].deleteMany();
  }
});
