import asyncHandler from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { createClaimSchema, decisionSchema, getClaimsQuerySchema } from '../validators/claimSchemas.js';
import * as claimSvc from '../services/claimService.js';

export const createClaim = asyncHandler(async (req, res) => {
  const result = createClaimSchema.safeParse(req.body);
  if (!result.success) {
    const issues = result.error.issues || [];
    const message = issues.map(e => `${e.path.join('.')}: ${e.message}`).join('; ');
    throw new ApiError(422, message, 'VALIDATION_ERROR');
  }

  const file = req.files && req.files.length > 0 ? req.files[0] : null;
  const claim = await claimSvc.createClaim(req.user._id, req.params.id, result.data, file);
  res.status(201).json({ success: true, data: { claim } });
});

export const getMadeClaims = asyncHandler(async (req, res) => {
  const result = getClaimsQuerySchema.safeParse(req.query);
  if (!result.success) throw new ApiError(400, 'Invalid query', 'BAD_REQUEST');
  const data = await claimSvc.getMadeClaims(req.user._id, result.data);
  res.json({ success: true, data });
});

export const getReceivedClaims = asyncHandler(async (req, res) => {
  const result = getClaimsQuerySchema.safeParse(req.query);
  if (!result.success) throw new ApiError(400, 'Invalid query', 'BAD_REQUEST');
  const data = await claimSvc.getReceivedClaims(req.user._id, result.data);
  res.json({ success: true, data });
});

export const decideClaim = asyncHandler(async (req, res) => {
  const result = decisionSchema.safeParse(req.body);
  if (!result.success) {
    const issues = result.error.issues || [];
    const message = issues.map(e => `${e.path.join('.')}: ${e.message}`).join('; ');
    throw new ApiError(422, message, 'VALIDATION_ERROR');
  }

  const claim = await claimSvc.decideClaim(req.user._id, req.params.id, result.data);
  res.json({ success: true, data: { claim } });
});

export const cancelClaim = asyncHandler(async (req, res) => {
  const claim = await claimSvc.cancelClaim(req.user._id, req.params.id);
  res.json({ success: true, data: { claim } });
});

export const confirmHandover = asyncHandler(async (req, res) => {
  const result = await claimSvc.confirmHandover(req.user._id, req.params.id);
  res.json({ success: true, data: result });
});

