import crypto from 'crypto';
import path from 'path';
import sharp from 'sharp';
import Claim from '../models/Claim.js';
import Item from '../models/Item.js';
import { ApiError } from '../utils/ApiError.js';
import { ITEMS_DIR } from '../config/uploadDirs.js';
import emitter from '../events/emitter.js';
import fs from 'fs/promises';

async function processProofImage(file) {
  if (!file) return null;
  const filename = `${crypto.randomUUID()}.webp`;
  const outPath = path.join(ITEMS_DIR, filename);
  await sharp(file.buffer)
    .resize({ width: 1600, height: 1600, fit: 'inside', withoutEnlargement: true })
    .webp()
    .toFile(outPath);
  return filename;
}

function revealContactIfNeeded(claim, currentUser, itemOwner) {
  const isApproved = claim.status === 'approved';
  if (!isApproved) return;

  const isClaimant = claim.claimant._id.toString() === currentUser._id.toString();
  const isOwner = itemOwner._id.toString() === currentUser._id.toString();
  const isAdmin = currentUser.role === 'admin';

  if (!isClaimant && !isOwner && !isAdmin) return;

  // If currentUser is owner, reveal claimant contact.
  if (isOwner || isAdmin) {
    claim.claimant = { ...claim.claimant.toObject(), email: claim.claimant.email };
    if (claim.claimant.phone) claim.claimant.phone = claim.claimant.phone;
  }
}

export async function createClaim(userId, itemId, data, file) {
  const item = await Item.findById(itemId);
  if (!item) throw new ApiError(404, 'Item not found', 'NOT_FOUND');
  if (item.status !== 'open') throw new ApiError(400, 'Item is not open', 'BAD_REQUEST');
  if (item.postedBy.toString() === userId.toString()) throw new ApiError(400, 'Cannot claim your own item', 'BAD_REQUEST');

  if (item.type === 'found') {
    if (!data.answer || data.answer.trim().length === 0) {
      throw new ApiError(400, 'Answer is required for found items', 'BAD_REQUEST');
    }
  }

  let proofImage = null;
  try {
    proofImage = await processProofImage(file);
    const claim = await Claim.create({
      item: itemId,
      claimant: userId,
      message: data.message,
      answer: data.answer,
      proofImage
    });

    emitter.emit('claim.created', claim);
    return await claim.populate('claimant', 'name department');
  } catch (err) {
    if (proofImage) {
      const p = path.join(ITEMS_DIR, proofImage);
      if (path.resolve(p).startsWith(path.normalize(ITEMS_DIR) + path.sep)) {
        await fs.unlink(p).catch(() => {});
      }
    }
    if (err.code === 11000) {
      throw new ApiError(409, 'You already have a pending claim for this item', 'CONFLICT');
    }
    throw err;
  }
}

export async function getMadeClaims(userId, query) {
  const { page, limit } = query;
  const total = await Claim.countDocuments({ claimant: userId });
  const totalPages = Math.ceil(total / limit);

  const claims = await Claim.find({ claimant: userId })
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit)
    .populate('item', 'title type images status postedBy')
    .populate({
      path: 'item',
      populate: { path: 'postedBy', select: 'name department email' } // Email fetched to conditionally reveal
    })
    .populate('claimant', 'name department email');

  // Contact reveal logic
  const results = claims.map(c => {
    const obj = c.toObject();
    if (c.status !== 'approved') {
      if (obj.item && obj.item.postedBy) {
        delete obj.item.postedBy.email;
        delete obj.item.postedBy.phone;
      }
      if (obj.claimant) {
        delete obj.claimant.email;
        delete obj.claimant.phone;
      }
    }
    return obj;
  });

  return { claims: results, page, limit, total, totalPages };
}

export async function getReceivedClaims(userId, query) {
  const { page, limit } = query;
  // Get my items
  const myItems = await Item.find({ postedBy: userId }).select('_id');
  const myItemIds = myItems.map(i => i._id);

  const total = await Claim.countDocuments({ item: { $in: myItemIds } });
  const totalPages = Math.ceil(total / limit);

  const claims = await Claim.find({ item: { $in: myItemIds } })
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit)
    .populate('item', 'title type images status postedBy')
    .populate('claimant', 'name department email');

  // Contact reveal logic
  const results = claims.map(c => {
    const obj = c.toObject();
    if (c.status !== 'approved') {
      if (obj.claimant) {
        delete obj.claimant.email;
        delete obj.claimant.phone;
      }
    }
    return obj;
  });

  return { claims: results, page, limit, total, totalPages };
}

export async function decideClaim(userId, claimId, data) {
  const claim = await Claim.findById(claimId).populate('item');
  if (!claim) throw new ApiError(404, 'Claim not found', 'NOT_FOUND');
  if (!claim.item) throw new ApiError(404, 'Associated item not found', 'NOT_FOUND');
  if (claim.item.postedBy.toString() !== userId.toString()) throw new ApiError(403, 'Not authorized', 'FORBIDDEN');
  if (claim.status !== 'pending') throw new ApiError(400, 'Claim is not pending', 'BAD_REQUEST');

  const { decision, note } = data;
  
  if (decision === 'approve') {
    claim.status = 'approved';
    claim.decisionNote = note;
    claim.decidedAt = new Date();
    await claim.save();

    // Update item
    claim.item.status = 'claim_pending';
    await claim.item.save();

    // Auto-reject other pending claims
    const others = await Claim.find({ item: claim.item._id, status: 'pending' });
    for (const other of others) {
      other.status = 'rejected';
      other.decisionNote = 'Another claim was approved for this item.';
      other.decidedAt = new Date();
      await other.save();
      emitter.emit('claim.rejected', other);
    }
    emitter.emit('claim.approved', claim);

  } else {
    claim.status = 'rejected';
    claim.decisionNote = note;
    claim.decidedAt = new Date();
    await claim.save();
    emitter.emit('claim.rejected', claim);
  }

  const populated = await claim.populate('claimant', 'name department email');
  const result = populated.toObject();
  if (result.status !== 'approved') {
    delete result.claimant.email;
    delete result.claimant.phone;
  }
  return result;
}

export async function cancelClaim(userId, claimId) {
  const claim = await Claim.findById(claimId);
  if (!claim) throw new ApiError(404, 'Claim not found', 'NOT_FOUND');
  if (claim.claimant.toString() !== userId.toString()) throw new ApiError(403, 'Not authorized', 'FORBIDDEN');
  if (claim.status !== 'pending') throw new ApiError(400, 'Only pending claims can be cancelled', 'BAD_REQUEST');

  claim.status = 'cancelled';
  await claim.save();
  emitter.emit('claim.cancelled', claim);
  return claim;
}
