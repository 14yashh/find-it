/**
 * src/routes/files.js
 * Authenticated file-streaming router.
 *
 * GET /api/files/items/:filename
 *   - Requires authentication (requireAuth).
 *   - Filename must match UUID.ext pattern to prevent directory traversal.
 *   - The resolved path must stay inside ITEMS_DIR.
 *   - Streams the file with appropriate headers.
 *   - Never uses express.static (which would bypass auth).
 *
 * Headers set:
 *   Cache-Control: private, no-store
 *   X-Content-Type-Options: nosniff
 */
import { Router } from 'express';
import path       from 'path';
import fs         from 'fs';

import { requireAuth } from '../middleware/auth.js';
import { ITEMS_DIR }   from '../config/uploadDirs.js';
import { ApiError }    from '../utils/ApiError.js';
import asyncHandler    from '../utils/asyncHandler.js';

const router = Router();

// UUID filename pattern: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx.ext
const UUID_FILENAME_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\.(jpg|jpeg|png|webp)$/i;

/**
 * GET /api/files/items/:filename
 * Authenticated static streaming for item images.
 */
router.get(
  '/items/:filename',
  requireAuth,
  asyncHandler(async (req, res) => {
    const { filename } = req.params;

    // 1. Validate filename format (UUID.ext) — blocks traversal attempts
    if (!UUID_FILENAME_RE.test(filename)) {
      throw new ApiError(404, 'File not found.', 'NOT_FOUND');
    }

    // 2. Resolve path and confirm it stays inside ITEMS_DIR
    const filePath     = path.resolve(ITEMS_DIR, filename);
    const normalised   = path.normalize(filePath);
    if (!normalised.startsWith(path.normalize(ITEMS_DIR) + path.sep) &&
        normalised !== path.normalize(path.join(ITEMS_DIR, filename))) {
      throw new ApiError(404, 'File not found.', 'NOT_FOUND');
    }

    // 3. Confirm file exists
    if (!fs.existsSync(normalised)) {
      throw new ApiError(404, 'File not found.', 'NOT_FOUND');
    }

    // 4. Determine content-type from extension
    const ext = path.extname(filename).toLowerCase();
    const MIME = { '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png', '.webp': 'image/webp' };
    const contentType = MIME[ext] || 'application/octet-stream';

    // 5. Set security headers and stream
    res.setHeader('Cache-Control', 'private, no-store');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('Content-Type', contentType);
    res.sendFile(normalised);
  }),
);

export default router;
