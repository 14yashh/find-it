import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const isTest = process.env.NODE_ENV === 'test';
export const UPLOADS_ROOT = path.resolve(__dirname, isTest ? '../../test_uploads' : '../../uploads');
export const VERIFICATION_DIR = path.join(UPLOADS_ROOT, 'verification');
export const ITEMS_DIR = path.join(UPLOADS_ROOT, 'items');

// Ensure directories exist synchronously at startup
if (!fs.existsSync(VERIFICATION_DIR)) fs.mkdirSync(VERIFICATION_DIR, { recursive: true });
if (!fs.existsSync(ITEMS_DIR)) fs.mkdirSync(ITEMS_DIR, { recursive: true });
