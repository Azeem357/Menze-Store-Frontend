// src/api/api.js
const BASE_URL = 'https://menze-store-backend-1.onrender.com';

function getHeaders(auth = false) {
  const headers = { 'Content-Type': 'application/json' };
  if (auth) {
    const token = localStorage.getItem('access');
    if (token) headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}

async function request(path, { method = 'GET', body, auth = false } = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers: getHeaders(auth),
    body: body ? JSON.stringify(body) : undefined,
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw data;
  return data;
}

// ── Auth ──────────────────────────────────────────────────────────────────────
export const authAPI = {
  register: (body) => request('/auth/register/', { method: 'POST', body }),
  login:    (body) => request('/auth/login/',    { method: 'POST', body }),
  me:       ()     => request('/auth/me/',        { auth: true }),
};

// ── Products ──────────────────────────────────────────────────────────────────
export const productAPI = {
  list:   (search = '') => request(`/products/${search ? `?search=${search}` : ''}`),
  detail: (id)          => request(`/products/${id}/`),
};

// ── Orders ────────────────────────────────────────────────────────────────────
export const orderAPI = {
  list:   ()     => request('/orders/', { auth: true }),
  create: (body) => request('/orders/', { method: 'POST', body, auth: true }),
  detail: (id)   => request(`/orders/${id}/`, { auth: true }),
};
