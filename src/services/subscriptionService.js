// src/services/subscriptionService.js
import api from './api';

/**
 * Fetch paginated subscriptions
 * @param {number} page (0-based)
 * @param {number} size
 * @param {string} sort (e.g. "nextBillingDate,asc")
 * @returns Promise resolving to { content: [...], totalElements, totalPages, number, size }
 */
export async function getSubscriptions(page = 0, size = 10, sort = 'id,asc', search = '') {
  const params = { page, size, sort };
  if (search && search.length > 0) params.search = search;
  const resp = await api.get('/subscriptions', { params });
  // Spring returns a Page object — we pass it through
  return resp.data;
}

export async function createSubscription(payload) {
  const resp = await api.post('/subscriptions', payload);
  return resp.data;
}

export async function deleteSubscription(id) {
  await api.delete(`/subscriptions/${id}`);
}

export async function updateSubscription(id, payload) {
  const resp = await api.put(`/subscriptions/${id}`, payload);
  return resp.data;
}

export async function getSubscriptionById(id) {
  const resp = await api.get(`/subscriptions/${id}`);
  return resp.data;
}
