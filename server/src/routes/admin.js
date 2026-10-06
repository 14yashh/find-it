import { Router } from 'express';
import * as adminCtrl from '../controllers/adminController.js';
import { requireAuth } from '../middleware/auth.js';
import { requireAdmin } from '../middleware/role.js';
import { validate } from '../middleware/validate.js';
import { verifyUserSchema, suspendUserSchema } from '../validators/adminSchemas.js';

const router = Router();

// All admin routes require authentication and admin role
router.use(requireAuth, requireAdmin);

// GET /api/admin/users
router.get('/users', adminCtrl.getUsers);

// GET /api/admin/users/:id/document
router.get('/users/:id/document', adminCtrl.getDocument);

// PATCH /api/admin/users/:id/verify
router.patch('/users/:id/verify', validate(verifyUserSchema), adminCtrl.verifyUser);

// PATCH /api/admin/users/:id/suspend
router.patch('/users/:id/suspend', validate(suspendUserSchema), adminCtrl.suspendUser);

router.get('/stats', adminCtrl.getStats);
router.get('/items', adminCtrl.getItems);
router.delete('/items/:id', adminCtrl.deleteItem);
router.get('/claims', adminCtrl.getClaims);
router.patch('/claims/:id/handover', adminCtrl.handoverClaim);

export default router;
