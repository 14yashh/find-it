import { Router } from 'express';
import { requireAuth, requireApproved } from '../middleware/auth.js';
import * as claimController from '../controllers/claimController.js';

const router = Router();

router.use(requireAuth);
router.use(requireApproved);

router.get('/made', claimController.getMadeClaims);
router.get('/received', claimController.getReceivedClaims);
router.patch('/:id/decision', claimController.decideClaim);
router.patch('/:id/cancel', claimController.cancelClaim);

export default router;
