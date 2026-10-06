import { z } from 'zod';

export const verifyUserSchema = z.object({
  decision: z.enum(['approve', 'reject'], { required_error: 'Decision is required' }),
  reason: z.string().trim().optional()
}).refine(data => {
  if (data.decision === 'reject') {
    return data.reason && data.reason.length >= 5;
  }
  return true;
}, {
  message: 'A reason of at least 5 characters is required when rejecting',
  path: ['reason']
});

export const suspendUserSchema = z.object({
  suspend: z.boolean({ required_error: 'Suspend boolean is required' })
});
