import cron from 'node-cron';
import Item from '../models/Item.js';

export function startCronJobs() {
  // Run every day at midnight
  cron.schedule('0 0 * * *', async () => {
    try {
      const now = new Date();
      const result = await Item.updateMany(
        { status: 'open', expiresAt: { $lt: now } },
        { status: 'expired' }
      );
      
      if (result.modifiedCount > 0) {
        console.log(`[Cron] Marked ${result.modifiedCount} items as expired.`);
      }
    } catch (err) {
      console.error('[Cron Error] Expire items job failed:', err);
    }
  });

  console.log('[Cron] Jobs started');
}
