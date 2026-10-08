/**
 * src/api/auth.js
 * Auth API endpoints matching docs/API.md
 */
import { apiClient } from './client.js';

export async function getMe() {
  const data = await apiClient('/api/auth/me');
  return data?.user || null;
}

export async function login({ email, password }) {
  const data = await apiClient('/api/auth/login', {
    method: 'POST',
    body: { email, password },
  });
  return data;
}

export async function signup(formData) {
  const data = await apiClient('/api/auth/signup', {
    method: 'POST',
    body: formData,
  });
  return data;
}

export async function logout() {
  const data = await apiClient('/api/auth/logout', {
    method: 'POST',
  });
  return data;
}

export async function resubmitDocument(formData) {
  const data = await apiClient('/api/auth/resubmit-document', {
    method: 'POST',
    body: formData,
  });
  return data;
}
