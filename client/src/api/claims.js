/**
 * src/api/claims.js
 * Claims API endpoints matching docs/API.md
 */
import { apiClient } from './client.js';

// --- Student claim endpoints ---

export async function getClaimsMade() {
  const data = await apiClient('/api/claims/made');
  return data?.claims || (Array.isArray(data) ? data : []);
}

export async function getClaimsReceived() {
  const data = await apiClient('/api/claims/received');
  return data?.claims || (Array.isArray(data) ? data : []);
}

export async function cancelClaim(claimId) {
  const data = await apiClient(`/api/claims/${claimId}`, { method: 'DELETE' });
  return data;
}

export async function decideClaim(claimId, decision, note = '') {
  const data = await apiClient(`/api/claims/${claimId}/decision`, {
    method: 'PATCH',
    body: { decision, note },
  });
  return data?.claim || data;
}

// --- Admin claim endpoints ---

export async function adminGetClaims(params = {}) {
  const data = await apiClient('/api/admin/claims', { params });
  return data; // { claims, total, page, limit, totalPages }
}

export async function adminDecideClaim(claimId, decision, note = '') {
  const data = await apiClient(`/api/admin/claims/${claimId}/decision`, {
    method: 'PATCH',
    body: { decision, note },
  });
  return data?.claim || data;
}
