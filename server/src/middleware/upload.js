/**
 * src/middleware/upload.js
 *
 * Multer-based file upload middleware with two layers of validation:
 *   1. Mimetype + extension check in fileFilter (fast, first gate)
 *   2. Magic-byte check on the in-memory buffer (catches renamed files)
 *
 * Files are held in memory only until both checks pass, then written to
 * the destination directory with a UUID filename — no orphans on failure.
 *
 * Exported factory:
 *   singleUpload(fieldName, destDir, required?)
 *     → Express middleware that processes one file and sets:
 *         req.file.savedPath  – absolute path to the persisted file
 *         req.file.filename   – UUID-based filename (no path)
 */
import multer        from 'multer';
import path          from 'path';
import fs            from 'fs';
import { randomUUID } from 'crypto';
import { ApiError }  from '../utils/ApiError.js';

// ── Allowed types ─────────────────────────────────────────────────────────────
const ALLOWED_MIME = new Set(['image/jpeg', 'image/png', 'image/webp']);
const ALLOWED_EXT  = new Set(['.jpg', '.jpeg', '.png', '.webp']);
const MAX_BYTES    = 5 * 1024 * 1024; // 5 MB

// ── Magic-byte signatures ─────────────────────────────────────────────────────
/**
 * Inspects the raw bytes of the file buffer to confirm the true format.
 * This prevents attackers from renaming a .exe to .jpg and bypassing the
 * mimetype/extension check (which relies on the client-declared header).
 *
 * @param {Buffer}  buf      – File buffer from multer memoryStorage
 * @param {string}  mimetype – Declared mimetype from multipart header
 * @returns {boolean}
 */
function hasValidMagicBytes(buf, mimetype) {
  if (!buf || buf.length < 12) return false;

  switch (mimetype) {
    case 'image/jpeg':
      // FF D8 FF
      return buf[0] === 0xFF && buf[1] === 0xD8 && buf[2] === 0xFF;

    case 'image/png':
      // 89 50 4E 47 0D 0A 1A 0A
      return (
        buf[0] === 0x89 && buf[1] === 0x50 &&
        buf[2] === 0x4E && buf[3] === 0x47 &&
        buf[4] === 0x0D && buf[5] === 0x0A &&
        buf[6] === 0x1A && buf[7] === 0x0A
      );

    case 'image/webp':
      // Bytes 0-3: "RIFF", bytes 8-11: "WEBP"
      return (
        buf[0] === 0x52 && buf[1] === 0x49 && buf[2] === 0x46 && buf[3] === 0x46 &&
        buf[8] === 0x57 && buf[9] === 0x45 && buf[10] === 0x42 && buf[11] === 0x50
      );

    default:
      return false;
  }
}

// ── Multer instance (memory storage) ─────────────────────────────────────────
const memUpload = multer({
  storage: multer.memoryStorage(),
  limits:  { fileSize: MAX_BYTES },
  fileFilter(_req, file, cb) {
    const ext = path.extname(file.originalname).toLowerCase();
    if (!ALLOWED_MIME.has(file.mimetype) || !ALLOWED_EXT.has(ext)) {
      return cb(
        new ApiError(422, 'Only JPG, PNG, and WebP images are allowed.', 'INVALID_FILE_TYPE'),
      );
    }
    cb(null, true);
  },
});

// ── Public factory ────────────────────────────────────────────────────────────
/**
 * Returns a single-file upload middleware.
 *
 * @param {string}  fieldName – Multipart field name (e.g. "document")
 * @param {string}  destDir   – Absolute path to the destination directory
 * @param {boolean} [required=true] – Throw if no file is provided
 */
export function singleUpload(fieldName, destDir, required = true) {
  const multerMiddleware = memUpload.single(fieldName);

  return (req, res, next) => {
    multerMiddleware(req, res, (err) => {
      // ── Multer errors ───────────────────────────────────────────────────
      if (err) {
        if (err.code === 'LIMIT_FILE_SIZE') {
          return next(new ApiError(413, 'File must be 5 MB or smaller.', 'FILE_TOO_LARGE'));
        }
        // ApiError thrown from fileFilter passes through as-is
        return next(err instanceof ApiError ? err : new ApiError(422, err.message, 'UPLOAD_ERROR'));
      }

      // ── File presence check ─────────────────────────────────────────────
      if (!req.file) {
        if (required) {
          return next(new ApiError(422, `"${fieldName}" file is required.`, 'FILE_REQUIRED'));
        }
        return next();
      }

      // ── Magic-byte validation ───────────────────────────────────────────
      if (!hasValidMagicBytes(req.file.buffer, req.file.mimetype)) {
        return next(
          new ApiError(
            422,
            'File content does not match its declared type.',
            'INVALID_FILE_TYPE',
          ),
        );
      }

      // ── Persist to disk with a UUID filename ────────────────────────────
      const ext      = path.extname(req.file.originalname).toLowerCase();
      const filename = `${randomUUID()}${ext}`;
      const destPath = path.join(destDir, filename);

      fs.writeFile(destPath, req.file.buffer, (writeErr) => {
        if (writeErr) {
          return next(new ApiError(500, 'Could not save uploaded file.', 'UPLOAD_ERROR'));
        }
        // Attach path info for the controller / service layer
        req.file.savedPath = destPath;
        req.file.filename  = filename;
        next();
      });
    });
  };
}

/**
 * Multi-file upload middleware for items images.
 * Accepts 0–maxCount files under fieldName.
 * Files are kept in memory (req.files[].buffer) for downstream sharp processing.
 * Magic-byte validation is performed here; actual disk writes happen in the service.
 *
 * @param {string} fieldName  – Multipart field name (e.g. "images")
 * @param {number} maxCount   – Maximum number of files (default 4)
 */
export function multiUpload(fieldName, maxCount = 4) {
  const multerMiddleware = multer({
    storage: multer.memoryStorage(),
    limits:  { fileSize: MAX_BYTES },
    fileFilter(_req, file, cb) {
      const ext = path.extname(file.originalname).toLowerCase();
      if (!ALLOWED_MIME.has(file.mimetype) || !ALLOWED_EXT.has(ext)) {
        return cb(
          new ApiError(422, 'Only JPG, PNG, and WebP images are allowed.', 'INVALID_FILE_TYPE'),
        );
      }
      cb(null, true);
    },
  }).array(fieldName, maxCount);

  return (req, res, next) => {
    multerMiddleware(req, res, (err) => {
      if (err) {
        if (err.code === 'LIMIT_FILE_SIZE') {
          return next(new ApiError(413, 'Each image must be 5 MB or smaller.', 'FILE_TOO_LARGE'));
        }
        if (err.code === 'LIMIT_UNEXPECTED_FILE') {
          return next(new ApiError(422, `Maximum ${maxCount} images allowed.`, 'TOO_MANY_FILES'));
        }
        return next(err instanceof ApiError ? err : new ApiError(422, err.message, 'UPLOAD_ERROR'));
      }

      // req.files may be undefined if no files sent — normalise to []
      req.files = req.files || [];

      // Validate magic bytes for each file
      for (const file of req.files) {
        if (!hasValidMagicBytes(file.buffer, file.mimetype)) {
          return next(
            new ApiError(422, 'File content does not match its declared type.', 'INVALID_FILE_TYPE'),
          );
        }
      }

      next();
    });
  };
}

