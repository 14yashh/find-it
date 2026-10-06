import { z } from 'zod';

export const createItemSchema = z.object({
  type: z.enum(['lost', 'found']),
  title: z.string().trim().min(1),
  description: z.string().trim().min(1),
  category: z.enum(['electronics', 'id_cards', 'bags', 'keys', 'books', 'clothing', 'other']),
  location: z.string().trim().min(1),
  dateOccurred: z.coerce.date(),
  verificationQuestion: z.string().trim().optional()
}).refine(data => {
  if (data.type === 'found') {
    return data.verificationQuestion && data.verificationQuestion.length >= 5;
  }
  return true;
}, {
  message: 'verificationQuestion is required (min 5 chars) for found items.',
  path: ['verificationQuestion']
});

export const updateItemSchema = z.object({
  title: z.string().trim().min(1).optional(),
  description: z.string().trim().min(1).optional(),
  category: z.enum(['electronics', 'id_cards', 'bags', 'keys', 'books', 'clothing', 'other']).optional(),
  location: z.string().trim().min(1).optional(),
  dateOccurred: z.coerce.date().optional(),
  verificationQuestion: z.string().trim().optional(),
  removeImages: z.union([z.string(), z.array(z.string())]).optional()
});

export const getItemsQuerySchema = z.object({
  q: z.string().optional(),
  type: z.enum(['lost', 'found']).optional(),
  category: z.enum(['electronics', 'id_cards', 'bags', 'keys', 'books', 'clothing', 'other']).optional(),
  location: z.string().optional(),
  status: z.enum(['open', 'claim_pending', 'returned', 'expired']).optional(),
  dateFrom: z.coerce.date().optional(),
  dateTo: z.coerce.date().optional(),
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(50).default(12),
  sort: z.enum(['newest', 'relevance']).default('newest')
}).catchall(z.string().optional());
