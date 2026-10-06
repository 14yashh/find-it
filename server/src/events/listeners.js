import emitter from './emitter.js';
import * as notificationSvc from '../services/notificationService.js';
import { sendEmail } from '../utils/sendEmail.js';

function wrapListener(name, fn) {
  emitter.on(name, async (...args) => {
    try {
      await fn(...args);
    } catch (err) {
      console.error(`[Event Error] Listener for ${name} failed:`, err);
    }
  });
}

export function registerListeners() {
  wrapListener('user.verified', async (user) => {
    const msg = 'Your account has been verified. You can now post items and make claims.';
    await notificationSvc.createNotification(user._id, 'user_verified', msg, '/profile');
    await sendEmail(user.email, 'Account Verified', msg);
  });

  wrapListener('user.rejected', async (user) => {
    const msg = 'Your verification document was rejected. Please upload a new one.';
    await notificationSvc.createNotification(user._id, 'user_rejected', msg, '/verify');
    await sendEmail(user.email, 'Verification Rejected', msg);
  });

  wrapListener('claim.created', async (claim) => {
    await claim.populate('item');
    const msg = `New claim on your item: ${claim.item.title}`;
    await notificationSvc.createNotification(claim.item.postedBy, 'claim_received', msg, `/items/${claim.item._id}/claims`);
  });

  wrapListener('claim.approved', async (claim) => {
    await claim.populate('item');
    await claim.populate('claimant');
    const msg = `Your claim on "${claim.item.title}" was approved! Contact the owner.`;
    await notificationSvc.createNotification(claim.claimant._id, 'claim_approved', msg, `/claims/${claim._id}`);
    await sendEmail(claim.claimant.email, 'Claim Approved', msg);
  });

  wrapListener('claim.rejected', async (claim) => {
    await claim.populate('item');
    const msg = `Your claim on "${claim.item.title}" was rejected.`;
    await notificationSvc.createNotification(claim.claimant._id, 'claim_rejected', msg, `/claims/${claim._id}`);
  });

  wrapListener('claim.cancelled', async (claim) => {
    await claim.populate('item');
    const msg = `A claim on your item "${claim.item.title}" was cancelled.`;
    await notificationSvc.createNotification(claim.item.postedBy, 'claim_cancelled', msg, `/items/${claim.item._id}`);
  });

  wrapListener('item.returned', async (item) => {
    const msg = `Your item "${item.title}" is now marked as returned.`;
    await notificationSvc.createNotification(item.postedBy, 'item_returned', msg, `/items/${item._id}`);
  });

  wrapListener('item.matched', async (payload) => {
    const { item, matches } = payload;
    for (const match of matches) {
      const msg = `Possible match found for your item "${match.title}": "${item.title}"`;
      await notificationSvc.createNotification(match.postedBy, 'item_matched', msg, `/items/${match._id}/matches`);
      
      const matchOwner = match.postedBy.email ? match.postedBy : null; // populate happens later
      if (matchOwner) {
        // await sendEmail(matchOwner.email, 'Possible Item Match', msg);
      }
    }
  });

  console.log('[Events] Listeners registered');
}
