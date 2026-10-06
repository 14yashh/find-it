import { z } from 'zod';

export const createClaimSchema = z.object({
  message: z.string().trim().min(1),
  answer: z.string().trim().optional()
});

export const decisionSchema = z.object({
  decision: z.enum(['approve', 'reject']),
  note: z.string().trim().optional()
});

export const getClaimsQuerySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(50).default(12)
}).catchall(z.string().optional());
