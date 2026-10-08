import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import * as notificationController from '../controllers/notificationController.js';

const router = Router();

router.use(requireAuth);

router.get('/', notificationController.getNotifications);
router.patch('/read-all', notificationController.markAllAsRead);
router.patch('/:id/read', notificationController.markAsRead);
router.delete('/:id', notificationController.deleteNotification);

export default router;
