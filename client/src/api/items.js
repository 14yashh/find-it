/**
 * src/api/items.js
 * Items API endpoints matching docs/API.md
 */
import { apiClient } from './client.js';

export async function getItems(params = {}) {
  const data = await apiClient('/api/items', { params });
  return data; // { items, page, limit, total, totalPages }
}

export async function getItem(id) {
  const data = await apiClient(`/api/items/${id}`);
  return data?.item || data;
}

export async function getMyItems() {
  const data = await apiClient('/api/items/mine');
  return data?.items || (Array.isArray(data) ? data : []);
}

export async function getItemMatches(id) {
  const data = await apiClient(`/api/items/${id}/matches`);
  return data?.matches || [];
}

export async function createItem(formData) {
  const data = await apiClient('/api/items', {
    method: 'POST',
    body: formData,
  });
  return data?.item || data;
}

export async function updateItem(id, formData) {
  const data = await apiClient(`/api/items/${id}`, {
    method: 'PATCH',
    body: formData,
  });
  return data?.item || data;
}

export async function markItemReturned(id) {
  const data = await apiClient(`/api/items/${id}/status`, {
    method: 'PATCH',
  });
  return data?.item || data;
}

export async function deleteItem(id) {
  const data = await apiClient(`/api/items/${id}`, {
    method: 'DELETE',
  });
  return data;
}

export async function createClaim(itemId, formData) {
  const data = await apiClient(`/api/items/${itemId}/claims`, {
    method: 'POST',
    body: formData,
  });
  return data?.claim || data;
}
