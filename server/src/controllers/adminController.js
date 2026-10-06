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
