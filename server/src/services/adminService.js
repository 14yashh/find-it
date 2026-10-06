import fs from 'fs';
import fsp from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import User from '../models/User.js';
import { ApiError } from '../utils/ApiError.js';
import { env } from '../config/env.js';
import emitter from '../events/emitter.js';
import { VERIFICATION_DIR } from '../config/uploadDirs.js';

// ── GET Users List ────────────────────────────────────────────────────────────

export async function getUsers(query) {
  let { verificationStatus, q, page = 1, limit = 20, sort } = query;
  page = Math.max(1, parseInt(page, 10) || 1);
  limit = Math.min(100, Math.max(1, parseInt(limit, 10) || 20));

  const filter = {};
  if (verificationStatus) {
    filter.verificationStatus = verificationStatus;
  }
  if (q) {
    filter.$or = [
      { name: { $regex: q, $options: 'i' } },
      { email: { $regex: q, $options: 'i' } }
    ];
  }

  const sortOpt = sort === 'newest' ? { createdAt: -1 } : { createdAt: 1 };

  const total = await User.countDocuments(filter);
  const totalPages = Math.ceil(total / limit);

  // We explicitly select verificationDocPath to check its existence, but must NOT return it to the client
  let items = await User.find(filter)
    .sort(sortOpt)
    .skip((page - 1) * limit)
    .limit(limit)
    .select('+verificationDocPath');

  // Convert to lean objects and add hasDocument
  items = items.map(doc => {
    const obj = doc.toJSON(); // this strips passwordHash, verificationDocPath, __v
    obj.hasDocument = !!doc.verificationDocPath;
    return obj;
  });

  return { items, page, limit, total, totalPages };
}

// ── GET User Document ─────────────────────────────────────────────────────────

export async function getUserDocument(userId, res) {
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    throw new ApiError(400, 'Invalid user ID', 'BAD_REQUEST');
  }

  const user = await User.findById(userId).select('+verificationDocPath');
  if (!user || !user.verificationDocPath) {
    throw new ApiError(404, 'User or document not found', 'NOT_FOUND');
  }

  // Ensure path is inside verification dir to prevent traversal
  const resolvedPath = path.resolve(user.verificationDocPath);
  if (!resolvedPath.startsWith(VERIFICATION_DIR)) {
    throw new ApiError(404, 'Document not found', 'NOT_FOUND');
  }

  try {
    await fsp.access(resolvedPath, fs.constants.R_OK);
  } catch (err) {
    throw new ApiError(404, 'Document not found on disk', 'NOT_FOUND');
  }

  // Determine content type safely based on extension (multer enforced it earlier)
  const ext = path.extname(resolvedPath).toLowerCase();
  let contentType = 'application/octet-stream';
  if (ext === '.jpg' || ext === '.jpeg') contentType = 'image/jpeg';
  else if (ext === '.png') contentType = 'image/png';
  else if (ext === '.webp') contentType = 'image/webp';

  res.setHeader('Content-Type', contentType);
  res.setHeader('Cache-Control', 'private, no-store');
  res.setHeader('X-Content-Type-Options', 'nosniff');

  res.sendFile(resolvedPath, (err) => {
    if (err && !res.headersSent) {
      res.status(500).json({ success: false, error: { code: 'INTERNAL_SERVER_ERROR', message: 'Error streaming file' }});
    }
  });
}

// ── Verify User ───────────────────────────────────────────────────────────────

export async function verifyUser(userId, adminId, decision, reason) {
  const user = await User.findById(userId).select('+verificationDocPath');
  if (!user) throw new ApiError(404, 'User not found', 'NOT_FOUND');

  if (user.role === 'admin') {
    throw new ApiError(400, 'Cannot verify admin accounts', 'BAD_REQUEST');
  }

  if (user.verificationStatus !== 'pending') {
    throw new ApiError(409, 'Only pending accounts can be verified or rejected', 'CONFLICT');
  }

  if (decision === 'approve') {
    user.verificationStatus = 'approved';
    user.rejectionReason = undefined;
    user.verifiedBy = adminId;
    user.verifiedAt = new Date();

    if (env.DELETE_DOC_AFTER_APPROVAL && user.verificationDocPath) {
      await fsp.unlink(user.verificationDocPath).catch(() => {});
      user.verificationDocPath = undefined;
    }

    await user.save();
    emitter.emit('user.verified', user);

  } else if (decision === 'reject') {
    user.verificationStatus = 'rejected';
    user.rejectionReason = reason;
    user.verifiedBy = adminId;
    user.verifiedAt = new Date();

    await user.save();
    emitter.emit('user.rejected', user);
  }

  return user;
}

// ── Suspend User ──────────────────────────────────────────────────────────────

export async function suspendUser(userId, adminId, suspendFlag) {
  const user = await User.findById(userId);
  if (!user) throw new ApiError(404, 'User not found', 'NOT_FOUND');

  if (user.role === 'admin') {
    throw new ApiError(400, 'Admin accounts cannot be suspended', 'BAD_REQUEST');
  }
  
  if (user._id.toString() === adminId.toString()) {
    throw new ApiError(400, 'Cannot suspend yourself', 'BAD_REQUEST');
  }

  user.isSuspended = suspendFlag;
  await user.save();

  return user;
}
