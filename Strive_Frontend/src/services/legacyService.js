import api from './api';

// Helper: always return an array (handles paginated + non-paginated)
const toArray = (data) => Array.isArray(data) ? data : (Array.isArray(data?.results) ? data.results : []);

export async function fetchIPRC() {
  const { data } = await api.get('legacy/iprc/');
  return toArray(data); // ← now returns array
}

export async function fetchEvents() {
  const { data } = await api.get('legacy/events/');
  return toArray(data); // ← now returns array
}

export async function fetchEventDetail(id) {
  const { data } = await api.get(`legacy/events/${id}/detail/`);
  return data; // detail is an object, keep as-is
}

