/**
 * src/api/errors.js
 * Human-friendly error translation based on docs/API.md contract.
 */

export const ERROR_MESSAGES = {
  EMAIL_CONFLICT: 'An account with this email address already exists.',
  ROLL_NUMBER_CONFLICT: 'An account with this roll number already exists.',
  INVALID_CREDENTIALS: 'The email address or password entered is incorrect.',
  VALIDATION_ERROR: 'Please review the highlighted fields and correct errors.',
  INVALID_FILE_TYPE: 'Invalid file format. Only JPG, PNG, or WebP files are permitted.',
  FILE_TOO_LARGE: 'File exceeds the 5 MB maximum size limit.',
  FILE_REQUIRED: 'Please attach the required document or image file.',
  TOO_MANY_FILES: 'You have exceeded the maximum allowed number of uploads.',
  UPLOAD_ERROR: 'File processing encountered an error. Please retry with a valid image.',
  NOT_APPROVED: 'Your account is pending verification. Please wait for admin approval.',
  FORBIDDEN: 'Your account has been suspended or you lack permission for this action.',
  UNAUTHORIZED: 'Your session has expired. Please log in again.',
  NOT_FOUND: 'The requested resource was not located in the archive.',
  TOO_MANY_REQUESTS: 'Rate limit reached. Please wait before submitting more requests.',
  BAD_REQUEST: 'The submission contained invalid parameters.',
  CONFLICT: 'A conflict occurred with the current state of this record.',
  INTERNAL_SERVER_ERROR: 'A server error occurred. Please try again shortly.',
  NETWORK_ERROR: 'Unable to connect to the server. Please check your network connection.',
};

export function getErrorMessage(error, defaultMsg = 'An unexpected error occurred.') {
  if (!error) return defaultMsg;
  if (typeof error === 'string') return error;

  const code = error.code;
  if (code && ERROR_MESSAGES[code]) {
    return ERROR_MESSAGES[code];
  }

  // Handle generic MongoDB duplicate key message fallback if code is CONFLICT
  if (code === 'CONFLICT' && error.message) {
    if (error.message.toLowerCase().includes('email')) {
      return ERROR_MESSAGES.EMAIL_CONFLICT;
    }
    if (error.message.toLowerCase().includes('rollnumber') || error.message.toLowerCase().includes('roll number')) {
      return ERROR_MESSAGES.ROLL_NUMBER_CONFLICT;
    }
    return error.message;
  }

  return error.message || defaultMsg;
}
