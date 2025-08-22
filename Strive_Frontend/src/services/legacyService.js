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


/**
 * Fetch gallery images for a specific event.
 * Tries public API first:
 *   GET /api/legacy/event-images/?event=<id>
 * Falls back to admin list you said is working:
 *   GET /admin/core/eventimage/   (filters client-side)
 *
 * Returns an array of absolute image URLs sorted by `order`.
 */
export async function fetchEventImages(eventId) {
  if (!eventId) return [];

  // helper to normalize different response shapes
  const toSortedUrls = (rows, evId) =>
    (Array.isArray(rows) ? rows : (rows && rows.results) ? rows.results : [])
      .filter((r) => String(r.event) === String(evId))
      .slice()
      .sort((a, b) => (a?.order ?? 0) - (b?.order ?? 0))
      .map((r) => r.image)
      .filter(Boolean);

  // 1) public endpoint
  try {
    const { data } = await api.get('/legacy/event-images/', { params: { event: eventId } });
    const urls = toSortedUrls(data, eventId);
    if (urls.length) return urls;
  } catch { /* fall through */ }

  // 2) admin fallback (absolute URL to avoid baseURL prefixing)
  try {
    const base = api.defaults?.baseURL || '/api';
    const origin = base.startsWith('http') ? new URL(base).origin : window.location.origin;
    const { data } = await api.get(`${origin}/admin/core/eventimage/`, { params: { event: eventId } });
    return toSortedUrls(data, eventId);
  } catch (err) {
    console.error('fetchEventImages fallback failed:', err);
    return [];
  }
}