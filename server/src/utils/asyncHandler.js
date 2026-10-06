/**
 * src/utils/asyncHandler.js
 * Wraps an async Express route/controller so unhandled promise rejections
 * are forwarded to next() — no try/catch boilerplate in every handler.
 *
 * Usage:
 *   router.get('/path', asyncHandler(async (req, res) => { ... }));
 */
const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

export default asyncHandler;
