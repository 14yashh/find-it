/**
 * src/services/adminService.js
 * Business logic for admin operations.
 */
import fs from 'fs';
import fsp from 'fs/promises';
import path from 'path';
import mongoose from 'mongoose';
import User from '../models/User.js';
import Item from '../models/Item.js';
import Claim from '../models/Claim.js';
import { ApiError } from '../utils/ApiError.js';
import { env } from '../config/env.js';
import emitter from '../events/emitter.js';
import { VERIFICATION_DIR, ITEMS_DIR } from '../config/uploadDirs.js';

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
    const escaped = q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    filter.$or = [
      { name: { $regex: escaped, $options: 'i' } },
      { email: { $regex: escaped, $options: 'i' } }
    ];
  }

  const sortOpt = sort === 'newest' ? { createdAt: -1 } : { createdAt: 1 };

  const total = await User.countDocuments(filter);
  const totalPages = Math.ceil(total / limit);

  let items = await User.find(filter)
    .sort(sortOpt)
    .skip((page - 1) * limit)
    .limit(limit)
    .select('+verificationDocPath');

  items = items.map(doc => {
    const obj = doc.toJSON();
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
  const base = path.normalize(VERIFICATION_DIR) + path.sep;
  if (!resolvedPath.startsWith(base)) {
    throw new ApiError(404, 'Document not found', 'NOT_FOUND');
  }

  try {
    await fsp.access(resolvedPath, fs.constants.R_OK);
  } catch {
    throw new ApiError(404, 'Document not found on disk', 'NOT_FOUND');
  }

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
      res.status(500).json({ success: false, error: { code: 'INTERNAL_SERVER_ERROR', message: 'Error streaming file' } });
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

// ── Stats ─────────────────────────────────────────────────────────────────────

export async function getStats() {
  const [pendingVerifications, openItems, returnedItems, totalUsers, pendingClaims] = await Promise.all([
    User.countDocuments({ verificationStatus: 'pending' }),
    Item.countDocuments({ status: 'open' }),
    Item.countDocuments({ status: 'returned' }),
    User.countDocuments(),
    Claim.countDocuments({ status: 'pending' })
  ]);
  return { pendingVerifications, openItems, returnedItems, totalUsers, pendingClaims };
}

// ── Admin Items ───────────────────────────────────────────────────────────────

export async function getItems(query) {
  const page = Math.max(1, parseInt(query.page, 10) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(query.limit, 10) || 20));

  const filter = {};
  if (query.status) filter.status = query.status;

  const total = await Item.countDocuments(filter);
  const totalPages = Math.ceil(total / limit);

  const items = await Item.find(filter)
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit)
    .populate('postedBy', 'name department email');

  return { items, page, limit, total, totalPages };
}

export async function deleteItem(itemId) {
  const item = await Item.findById(itemId);
  if (!item) throw new ApiError(404, 'Item not found', 'NOT_FOUND');

  // Cancel pending claims
  const claims = await Claim.find({ item: itemId, status: 'pending' });
  for (const claim of claims) {
    claim.status = 'cancelled';
    await claim.save();
    emitter.emit('claim.cancelled', claim);
  }

  // Delete images
  const base = path.normalize(ITEMS_DIR) + path.sep;
  for (const img of item.images) {
    const p = path.resolve(ITEMS_DIR, path.basename(img));
    if (p.startsWith(base)) {
      await fsp.unlink(p).catch(() => {});
    }
  }

  await item.deleteOne();
  return { message: 'Item deleted by admin' };
}

// ── Admin Claims ──────────────────────────────────────────────────────────────

export async function getClaims(query) {
  const page = Math.max(1, parseInt(query.page, 10) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(query.limit, 10) || 20));

  const filter = {};
  if (query.status) filter.status = query.status;

  const total = await Claim.countDocuments(filter);
  const totalPages = Math.ceil(total / limit);

  const claims = await Claim.find(filter)
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit)
    .populate('item', 'title type status')
    .populate('claimant', 'name email department');

  return { claims, page, limit, total, totalPages };
}

export async function handoverClaim(claimId) {
  const claim = await Claim.findById(claimId).populate('item');
  if (!claim) throw new ApiError(404, 'Claim not found', 'NOT_FOUND');
  if (claim.status !== 'approved') throw new ApiError(400, 'Claim must be approved for handover', 'BAD_REQUEST');

  claim.item.status = 'returned';
  await claim.item.save();
  emitter.emit('item.returned', claim.item);
  return claim;
}
