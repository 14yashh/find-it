/**
 * src/validators/authSchemas.js
 * Zod schemas for the auth routes.
 * Imported by the validate() middleware factory.
 */
import { z } from 'zod';

export const signupSchema = z.object({
  name: z
    .string({ required_error: 'Name is required' })
    .trim()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be 100 characters or fewer'),

  email: z
    .string({ required_error: 'Email is required' })
    .trim()
    .email('Invalid email address')
    .toLowerCase(),

  password: z
    .string({ required_error: 'Password is required' })
    .min(8, 'Password must be at least 8 characters'),

  department: z
    .string({ required_error: 'Department is required' })
    .trim()
    .min(1, 'Department is required')
    .max(100, 'Department must be 100 characters or fewer'),

  year: z
    .string({ required_error: 'Year is required' })
    .trim()
    .min(1, 'Year is required'),

  phone: z.string().trim().optional(),
});

export const loginSchema = z.object({
  email: z
    .string({ required_error: 'Email is required' })
    .trim()
    .email('Invalid email address')
    .toLowerCase(),

  password: z
    .string({ required_error: 'Password is required' })
    .min(1, 'Password is required'),
});
