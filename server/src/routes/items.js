import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { requireAuth } from '../middleware/auth.js';
import { requireApproved } from '../middleware/approved.js';
import { validate } from '../middleware/validate.js';
import { multiUpload } from '../middleware/upload.js';
import { createItemSchema, updateItemSchema } from '../validators/itemSchemas.js';
import * as itemController from '../controllers/itemController.js';
import * as claimController from '../controllers/claimController.js';

const router = Router();

const postItemLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: process.env.NODE_ENV === 'test' ? 1000 : 20,
  keyGenerator: (req) => String(req.user?._id || req.ip || 'anon'),
  validate: { keyGeneratorIpFallback: false },
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: {
      code: 'TOO_MANY_REQUESTS',
      message: 'You have posted too many items. Please wait before posting again.'
    }
  }
});

router.use(requireAuth);
router.use(requireApproved);

router.get('/', itemController.getItems);
router.get('/mine', itemController.getMyItems);
// /:id/matches must come before /:id to avoid shadowing
router.get('/:id/matches', itemController.getMatches);
router.get('/:id', itemController.getItemById);

router.post(
  '/',
  postItemLimiter,
  multiUpload('images', 4),
  validate(createItemSchema),
  itemController.createItem
);

router.patch(
  '/:id',
  multiUpload('images', 4),
  validate(updateItemSchema),
  itemController.updateItem
);

router.post(
  '/:id/claims',
  multiUpload('proof', 1),
  claimController.createClaim
);

router.patch('/:id/status', itemController.setItemReturned);
router.delete('/:id', itemController.deleteItem);

export default router;
