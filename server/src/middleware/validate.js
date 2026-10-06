/**
 * src/middleware/validate.js
 * Zod validation middleware factory.
 *
 * Validates req.body against the provided Zod schema.
 * On success, replaces req.body with the parsed (coerced / trimmed) data.
 * On failure, forwards a 422 ApiError with all field errors joined.
 *
 * Usage:
 *   router.post('/route', validate(mySchema), controller);
 */
import { ApiError } from '../utils/ApiError.js';

/**
 * @param {import('zod').ZodSchema} schema
 * @returns {import('express').RequestHandler}
 */
export function validate(schema) {
  return (req, _res, next) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      const issues = result.error.issues || result.error.errors || [];
      const message = issues
        .map((e) => {
          const field = e.path && e.path.length ? e.path.join('.') : 'field';
          return `${field}: ${e.message}`;
        })
        .join('; ');

      return next(new ApiError(422, message, 'VALIDATION_ERROR'));
    }

    // Replace req.body with parsed data (trimmed, coerced, lowercased, etc.)
    req.body = result.data;
    next();
  };
}
