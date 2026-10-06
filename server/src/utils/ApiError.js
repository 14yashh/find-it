/**
 * src/utils/ApiError.js
 * Custom error class that carries an HTTP status code and a string code.
 * Thrown by services/controllers; caught by the central error handler.
 */
export class ApiError extends Error {
  /**
   * @param {number} statusCode  - HTTP status code (e.g. 400, 404)
   * @param {string} message     - Human-readable message
   * @param {string} [code]      - Snake-case machine code (e.g. "NOT_FOUND")
   */
  constructor(statusCode, message, code) {
    super(message);
    this.statusCode = statusCode;
    this.code = code || httpCodeToString(statusCode);
    // Capture a clean stack (omits this constructor frame)
    if (Error.captureStackTrace) Error.captureStackTrace(this, ApiError);
  }
}

/** Derives a default code string from a status code. */
function httpCodeToString(status) {
  const map = {
    400: 'BAD_REQUEST',
    401: 'UNAUTHORIZED',
    403: 'FORBIDDEN',
    404: 'NOT_FOUND',
    409: 'CONFLICT',
    413: 'PAYLOAD_TOO_LARGE',
    422: 'UNPROCESSABLE_ENTITY',
    429: 'TOO_MANY_REQUESTS',
    500: 'INTERNAL_SERVER_ERROR',
  };
  return map[status] || 'ERROR';
}
