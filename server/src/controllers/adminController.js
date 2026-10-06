import asyncHandler from '../utils/asyncHandler.js';
import * as adminService from '../services/adminService.js';

export const getUsers = asyncHandler(async (req, res) => {
  const result = await adminService.getUsers(req.query);
  res.json({ success: true, data: result });
});

export const getDocument = asyncHandler(async (req, res) => {
  // adminService.getUserDocument handles sending the file stream and headers directly
  await adminService.getUserDocument(req.params.id, res);
});

export const verifyUser = asyncHandler(async (req, res) => {
  const { decision, reason } = req.body;
  const user = await adminService.verifyUser(req.params.id, req.user._id, decision, reason);

  res.json({ 
    success: true, 
    data: { message: `User successfully ${decision}ed.`, user } 
  });
});

export const suspendUser = asyncHandler(async (req, res) => {
  const { suspend } = req.body;
  const user = await adminService.suspendUser(req.params.id, req.user._id, suspend);

  res.json({ 
    success: true, 
    data: { message: `User successfully ${suspend ? 'suspended' : 'unsuspended'}.`, user } 
  });
});

export const getStats = asyncHandler(async (req, res) => {
  const stats = await adminService.getStats();
  res.json({ success: true, data: { stats } });
});

export const getItems = asyncHandler(async (req, res) => {
  const data = await adminService.getItems(req.query);
  res.json({ success: true, data });
});

export const deleteItem = asyncHandler(async (req, res) => {
  const data = await adminService.deleteItem(req.params.id);
  res.json({ success: true, data });
});

export const getClaims = asyncHandler(async (req, res) => {
  const data = await adminService.getClaims(req.query);
  res.json({ success: true, data });
});

export const handoverClaim = asyncHandler(async (req, res) => {
  const claim = await adminService.handoverClaim(req.params.id);
  res.json({ success: true, data: { claim } });
});
