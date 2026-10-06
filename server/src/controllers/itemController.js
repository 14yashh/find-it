import asyncHandler  from '../utils/asyncHandler.js';
import { ApiError }  from '../utils/ApiError.js';
import { getItemsQuerySchema } from '../validators/itemSchemas.js';
import * as itemSvc  from '../services/itemService.js';

export const getItems = asyncHandler(async (req, res) => {
  for (const key of Object.keys(req.query)) {
    if (key.includes('[') || key.includes('$')) {
      throw new ApiError(400, 'Invalid query parameter syntax.', 'BAD_REQUEST');
    }
  }

  const result = getItemsQuerySchema.safeParse(req.query);
  if (!result.success) {
    const issues = result.error.issues || [];
    const message = issues.map(e => {
      const field = e.path && e.path.length ? e.path.join('.') : 'field';
      return `${field}: ${e.message}`;
    }).join('; ');
    throw new ApiError(422, message, 'VALIDATION_ERROR');
  }

  const data = await itemSvc.getItems(result.data);
  res.json({ success: true, data });
});

export const getMyItems = asyncHandler(async (req, res) => {
  const items = await itemSvc.getMyItems(req.user._id);
  res.json({ success: true, data: { items } });
});

export const getItemById = asyncHandler(async (req, res) => {
  const item = await itemSvc.getItemById(req.params.id);
  res.json({ success: true, data: { item } });
});

export const createItem = asyncHandler(async (req, res) => {
  const files = req.files || [];
  const item = await itemSvc.createItem(req.user._id, req.body, files);
  res.status(201).json({ success: true, data: { item } });
});

export const updateItem = asyncHandler(async (req, res) => {
  const files = req.files || [];
  const item = await itemSvc.updateItem(req.user._id, req.params.id, req.body, files);
  res.json({ success: true, data: { item } });
});

export const setItemReturned = asyncHandler(async (req, res) => {
  const item = await itemSvc.setItemReturned(req.user._id, req.params.id);
  res.json({ success: true, data: { item } });
});

export const deleteItem = asyncHandler(async (req, res) => {
  await itemSvc.deleteItem(req.user._id, req.user.role, req.params.id);
  res.json({ success: true, data: { message: 'Item deleted.' } });
});
