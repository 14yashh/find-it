/**
 * src/api/client.js
 * Central fetch wrapper for the FindIt API.
 * - Sends credentials: "include" for httpOnly cookies.
 * - Handles JSON and FormData payloads (never sets Content-Type for FormData).
 * - Unwraps { success, data } envelopes.
 * - Throws structured ApiError instances on HTTP/API errors.
 */

export class ApiError extends Error {
  constructor(status, code, message, details = null) {
    super(message || 'An error occurred');
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

const BASE_URL = import.meta.env.VITE_API_URL || '';

export async function apiClient(endpoint, options = {}) {
  const {
    method = 'GET',
    body,
    headers = {},
    params,
    ...restOptions
  } = options;

  let url = `${BASE_URL}${endpoint}`;
  if (params) {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, val]) => {
      if (val !== undefined && val !== null && val !== '') {
        searchParams.append(key, val);
      }
    });
    const qs = searchParams.toString();
    if (qs) {
      url += (url.includes('?') ? '&' : '?') + qs;
    }
  }

  const finalHeaders = { ...headers };
  let finalBody = body;

  const isFormData = typeof FormData !== 'undefined' && body instanceof FormData;
  if (!isFormData && body && typeof body === 'object') {
    finalHeaders['Content-Type'] = 'application/json';
    finalBody = JSON.stringify(body);
  }

  const fetchOptions = {
    method,
    headers: finalHeaders,
    body: finalBody,
    credentials: 'include',
    ...restOptions,
  };

  let response;
  try {
    response = await fetch(url, fetchOptions);
  } catch (err) {
    throw new ApiError(0, 'NETWORK_ERROR', 'Network connection failure. Please check your internet connection.', err);
  }

  // Handle empty or non-JSON responses
  const contentType = response.headers.get('content-type') || '';
  let payload = null;
  if (contentType.includes('application/json')) {
    try {
      payload = await response.json();
    } catch {
      payload = null;
    }
  }

  if (!response.ok) {
    const status = response.status;
    const errorCode = payload?.error?.code || (status === 401 ? 'UNAUTHORIZED' : status === 403 ? 'FORBIDDEN' : status === 404 ? 'NOT_FOUND' : 'API_ERROR');
    const errorMessage = payload?.error?.message || response.statusText || 'Request failed';
    const errorDetails = payload?.error?.details || payload?.error || null;
    throw new ApiError(status, errorCode, errorMessage, errorDetails);
  }

  // If backend uses standard envelope { success: true, data: { ... } }
  if (payload && typeof payload === 'object' && 'success' in payload) {
    if (!payload.success) {
      const code = payload.error?.code || 'API_ERROR';
      const msg = payload.error?.message || 'Operation failed';
      throw new ApiError(response.status, code, msg, payload.error);
    }
    return payload.data;
  }

  return payload;
}
