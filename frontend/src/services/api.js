// In dev the Vite proxy forwards /api to the Express server.
// In production VITE_API_URL points at the deployed API, e.g.
//   VITE_API_URL=https://foodbridge-api.vercel.app/api
const API =
  import.meta.env.VITE_API_URL ||
  (import.meta.env.PROD ? '/api' : 'http://localhost:5001/api');
const SESSION_KEY = 'foodbridge_session';

export const session = () => {
  try { return JSON.parse(localStorage.getItem(SESSION_KEY) || 'null'); }
  catch { return null; }
};

export const saveSession = (value) => localStorage.setItem(SESSION_KEY, JSON.stringify(value));
export const clearSession = () => localStorage.removeItem(SESSION_KEY);

async function request(path, options = {}) {
  const s = session();
  let response;
  try {
    response = await fetch(`${API}${path}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {}),
        ...(s?.token ? { Authorization: `Bearer ${s.token}` } : {})
      }
    });
  } catch {
    // network-level failure (offline, wrong URL, server asleep)
    throw new Error('Cannot reach the FoodBridge API. Please check your connection and try again.');
  }

  const data = await response.json().catch(() => ({}));

  if (response.status === 401 && s?.token) {
    // stale/expired session — clear it so the UI returns to the login screen
    clearSession();
  }
  if (!response.ok) {
    const err = new Error(data.message || `Request failed (${response.status})`);
    err.status = response.status;
    throw err;
  }
  return data;
}

export const api = {
  login: (body) => request('/auth/login', { method: 'POST', body: JSON.stringify(body) }),
  register: (body) => request('/auth/register', { method: 'POST', body: JSON.stringify(body) }),
  donations: (query = '') => request(`/donations${query}`),
  createDonation: (body) => request('/donations', { method: 'POST', body: JSON.stringify(body) }),
  acceptDonation: (id) => request(`/donations/${id}/accept`, { method: 'POST' }),
  status: (id, status) => request(`/donations/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) }),
  deliveries: () => request('/deliveries'),
  createDelivery: (body) => request('/deliveries', { method: 'POST', body: JSON.stringify(body) }),
  updateDelivery: (id, body) => request(`/deliveries/${id}`, { method: 'PATCH', body: JSON.stringify(body) }),
  summary: () => request('/analytics/summary'),
  overview: () => request('/analytics/overview'),
  ai: () => request('/ai/insights'),
  notifications: () => request('/notifications'),
  readNotification: (id) => request(`/notifications/${id}/read`, { method: 'PATCH' }),
  users: () => request('/users'),
  userStatus: (id, status) => request(`/users/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) }),
  me: () => request('/users/me'),
  updateMe: (body) => request('/users/me', { method: 'PATCH', body: JSON.stringify(body) }),
  report: () => request('/reports/summary')
};
