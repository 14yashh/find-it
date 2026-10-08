/**
 * src/api/admin.js
 * Admin API endpoints matching docs/API.md
 */
import { apiClient } from './client.js';

// --- Stats ---
export async function getAdminStats() {
  const data = await apiClient('/api/admin/stats');
  return data; // { pendingVerifications, openItems, returnedItems, totalUsers, pendingClaims }
}

// --- Users ---
export async function getAdminUsers(params = {}) {
  const data = await apiClient('/api/admin/users', { params });
  return data; // { users, total, page, limit, totalPages }
}

export async function verifyUser(userId, decision, reason = '') {
  const body = { decision };
  if (reason) body.reason = reason;
  const data = await apiClient(`/api/admin/users/${userId}/verify`, {
    method: 'PATCH',
    body,
  });
  return data?.user || data;
}

export async function suspendUser(userId, suspend = true) {
  const data = await apiClient(`/api/admin/users/${userId}/suspend`, {
    method: 'PATCH',
    body: { suspend },
  });
  return data?.user || data;
}

// --- Items ---
export async function getAdminItems(params = {}) {
  const data = await apiClient('/api/admin/items', { params });
  return data; // { items, total, page, limit, totalPages }
}

export async function adminDeleteItem(id) {
  const data = await apiClient(`/api/admin/items/${id}`, { method: 'DELETE' });
  return data;
}

export async function adminUpdateItemStatus(id, status) {
  const data = await apiClient(`/api/admin/items/${id}/status`, {
    method: 'PATCH',
    body: { status },
  });
  return data?.item || data;
}

// --- Claims ---
export async function getAdminClaims(params = {}) {
  const data = await apiClient('/api/admin/claims', { params });
  return data; // { claims, total, page, limit, totalPages }
}

export async function handoverClaim(claimId) {
  const data = await apiClient(`/api/admin/claims/${claimId}/handover`, {
    method: 'PATCH',
  });
  return data?.claim || data;
}
