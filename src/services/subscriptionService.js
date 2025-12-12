// src/services/subscriptionService.js
import api from './api';

/**
 * Fetch paginated subscriptions
 * @param {number} page (0-based)
 * @param {number} size
 * @param {string} sort (e.g. "nextBillingDate,asc")
 * @returns Promise resolving to { content: [...], totalElements, totalPages, number, size }
 */
export async function getSubscriptions(page = 0, size = 10, sort = 'id,asc') {
  const params = { page, size, sort };
  const resp = await api.get('/subscriptions', { params });
  // Spring returns a Page object — we pass it through
  return resp.data;
}
