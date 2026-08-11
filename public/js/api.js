/**
 * Capa de consumo de la API REST de CampusFest.
 * Todas las funciones devuelven el JSON ya parseado, o lanzan un Error
 * con el mensaje amigable que envía el backend (RNF-18).
 */

const API_BASE = '/api';

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });

  const body = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(body.message || 'Ocurrió un error inesperado. Por favor intenta de nuevo más tarde.');
  }

  return body;
}

const api = {
  getActivities: (queryString = '') => request(`/activities${queryString}`),
  getFeaturedActivities: () => request('/activities/featured'),
  getActivityResults: () => request('/activities/results'),
  getActivityById: (id) => request(`/activities/${id}`),

  createInscription: (data) => request('/inscriptions', { method: 'POST', body: JSON.stringify(data) }),

  getStands: () => request('/stands'),

  getConfiguration: () => request('/configuration'),
  sendContact: (data) => request('/contact', { method: 'POST', body: JSON.stringify(data) }),

  // --- Admin ---
  createActivity: (data) => request('/admin/activities', { method: 'POST', body: JSON.stringify(data) }),
  updateActivity: (id, data) => request(`/admin/activities/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteActivity: (id) => request(`/admin/activities/${id}`, { method: 'DELETE' }),
  publishActivityResult: (id, data) =>
    request(`/admin/activities/${id}/result`, { method: 'PUT', body: JSON.stringify(data) }),

  getAdminInscriptions: (queryString = '') => request(`/admin/inscriptions${queryString}`),
  updateInscription: (id, data) => request(`/admin/inscriptions/${id}`, { method: 'PUT', body: JSON.stringify(data) }),

  createStand: (data) => request('/admin/stands', { method: 'POST', body: JSON.stringify(data) }),
  updateStand: (id, data) => request(`/admin/stands/${id}`, { method: 'PUT', body: JSON.stringify(data) }),

  updateConfiguration: (section, data) =>
    request(`/admin/configuration/${section}`, { method: 'PUT', body: JSON.stringify(data) }),
};
