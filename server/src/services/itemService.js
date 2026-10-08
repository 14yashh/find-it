import fs from 'fs/promises';
import path from 'path';
import sharp from 'sharp';
import crypto from 'crypto';
import Item from '../models/Item.js';
import Claim from '../models/Claim.js';
import { ApiError } from '../utils/ApiError.js';
import { ITEMS_DIR } from '../config/uploadDirs.js';
import emitter from '../events/emitter.js';

async function deleteImages(filenames) {
  const base = path.normalize(ITEMS_DIR) + path.sep;
  for (const filename of filenames) {
    if (!filename) continue;
    const resolvedPath = path.resolve(ITEMS_DIR, path.basename(filename));
    if (resolvedPath.startsWith(base)) {
      await fs.unlink(resolvedPath).catch(() => {});
    }
  }
}

export async function getItems(query) {
  const { q, type, category, location, status, dateFrom, dateTo, page, limit, sort } = query;
  const filter = {};

  if (q) filter.$text = { $search: q };
  if (type) filter.type = type;
  if (category) filter.category = category;
  
  if (location) {
    filter.location = { $regex: location.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), $options: 'i' };
  }
  
  if (status) {
    filter.status = status;
  } else {
    filter.status = { $in: ['open', 'claim_pending'] };
  }

  if (dateFrom || dateTo) {
    filter.dateOccurred = {};
    if (dateFrom) filter.dateOccurred.$gte = dateFrom;
    if (dateTo) filter.dateOccurred.$lte = dateTo;
  }

  const sortOpt = (sort === 'relevance' && q) ? { score: { $meta: 'textScore' } } : { createdAt: -1 };

  const total = await Item.countDocuments(filter);
  const totalPages = Math.ceil(total / limit);

  const items = await Item.find(filter)
    .sort(sortOpt)
    .skip((page - 1) * limit)
    .limit(limit)
    .populate('postedBy', 'name department');

  return { items, page, limit, total, totalPages };
}

export async function getMyItems(userId) {
  return await Item.find({ postedBy: userId }).sort({ createdAt: -1 }).populate('postedBy', 'name department');
}

export async function getItemById(id) {
  const item = await Item.findById(id).populate('postedBy', 'name department');
  if (!item) throw new ApiError(404, 'Item not found', 'NOT_FOUND');
  const activeClaim = await Claim.findOne({ item: id, status: { $in: ['pending', 'approved'] } }).select('_id status');
  const itemObj = item.toJSON();
  itemObj.hasActiveClaim = !!activeClaim;
  itemObj.activeClaimStatus = activeClaim ? activeClaim.status : null;
  return itemObj;
}

export async function createItem(userId, data, files = []) {
  const savedImages = [];
  try {
    for (const file of files) {
      const filename = `${crypto.randomUUID()}.webp`;
      const outPath = path.join(ITEMS_DIR, filename);
      
      await sharp(file.buffer)
        .resize({ width: 1600, height: 1600, fit: 'inside', withoutEnlargement: true })
        .webp()
        .toFile(outPath);

      savedImages.push(filename);
    }

    if (data.type === 'lost') {
      data.verificationQuestion = undefined;
    }

    const item = await Item.create({
      ...data,
      images: savedImages,
      postedBy: userId
    });

    const populatedItem = await item.populate('postedBy', 'name department');
    
    // Async matching
    computeMatchesAsync(populatedItem).catch(() => {});

    return populatedItem;
  } catch (err) {
    await deleteImages(savedImages);
    throw err;
  }
}

export async function updateItem(userId, itemId, data, newFiles = []) {
  const item = await Item.findById(itemId);
  if (!item) throw new ApiError(404, 'Item not found', 'NOT_FOUND');
  if (item.postedBy.toString() !== userId.toString()) throw new ApiError(403, 'Not authorized', 'FORBIDDEN');
  if (item.status === 'returned' || item.status === 'expired') throw new ApiError(403, 'Cannot edit returned/expired item', 'FORBIDDEN');

  const newlySavedImages = [];
  try {
    let images = [...item.images];

    if (data.removeImages) {
      const toRemove = Array.isArray(data.removeImages) ? data.removeImages : [data.removeImages];
      await deleteImages(toRemove);
      images = images.filter(img => !toRemove.includes(img));
    }

    if (images.length + newFiles.length > 4) {
      throw new ApiError(400, 'Max 4 images allowed', 'BAD_REQUEST');
    }

    for (const file of newFiles) {
      const filename = `${crypto.randomUUID()}.webp`;
      const outPath = path.join(ITEMS_DIR, filename);
      await sharp(file.buffer)
        .resize({ width: 1600, height: 1600, fit: 'inside', withoutEnlargement: true })
        .webp()
        .toFile(outPath);

      newlySavedImages.push(filename);
      images.push(filename);
    }

    data.images = images;
    if (data.type === 'lost') data.verificationQuestion = undefined;
    
    Object.assign(item, data);
    await item.save();

    return await item.populate('postedBy', 'name department');
  } catch (err) {
    await deleteImages(newlySavedImages);
    throw err;
  }
}

export async function setItemReturned(userId, itemId) {
  const item = await Item.findById(itemId);
  if (!item) throw new ApiError(404, 'Item not found', 'NOT_FOUND');
  if (item.postedBy.toString() !== userId.toString()) throw new ApiError(403, 'Not authorized', 'FORBIDDEN');
  if (item.status !== 'open' && item.status !== 'claim_pending') {
    throw new ApiError(400, 'Item must be open or claim_pending', 'BAD_REQUEST');
  }

  item.status = 'returned';
  await item.save();
  emitter.emit('item.returned', item);
  return await item.populate('postedBy', 'name department');
}

export async function deleteItem(userId, userRole, itemId) {
  const item = await Item.findById(itemId);
  if (!item) throw new ApiError(404, 'Item not found', 'NOT_FOUND');
  if (item.postedBy.toString() !== userId.toString() && userRole !== 'admin') {
    throw new ApiError(403, 'Not authorized', 'FORBIDDEN');
  }

  await deleteImages(item.images);
  await item.deleteOne();
}

export async function getMatches(userId, itemId) {
  const item = await Item.findById(itemId);
  if (!item) throw new ApiError(404, 'Item not found', 'NOT_FOUND');
  // Check ownership unless called internally for triggers
  if (userId && item.postedBy.toString() !== userId.toString()) {
    throw new ApiError(403, 'Not authorized', 'FORBIDDEN');
  }

  const oppositeType = item.type === 'lost' ? 'found' : 'lost';
  const sevenDays = 7 * 24 * 60 * 60 * 1000;
  const dateMin = new Date(item.dateOccurred.getTime() - sevenDays);
  const dateMax = new Date(item.dateOccurred.getTime() + sevenDays);

  const queryText = `${item.title} ${item.description}`;

  const matches = await Item.find(
    {
      type: oppositeType,
      category: item.category,
      status: 'open',
      dateOccurred: { $gte: dateMin, $lte: dateMax },
      $text: { $search: queryText }
    },
    { score: { $meta: 'textScore' } }
  )
  .sort({ score: { $meta: 'textScore' } })
  .limit(10)
  .populate('postedBy', 'name department email');

  return matches;
}

export async function computeMatchesAsync(item) {
  try {
    const matches = await getMatches(null, item._id);
    const topMatches = matches.slice(0, 3);
    if (topMatches.length > 0) {
      emitter.emit('item.matched', { item, matches: topMatches });
    }
  } catch (err) {
    console.error('[Matching Error] Failed to compute matches:', err);
  }
}

