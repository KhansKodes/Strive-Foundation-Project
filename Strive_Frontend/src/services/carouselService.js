import api from './api'; // axios baseURL -> http://127.0.0.1:8000/api

// Resolve origin so we can turn /media/... into absolute URLs if needed
function getApiOrigin() {
  const base = api.defaults?.baseURL || '/api';
  try { return new URL(base, window.location.origin).origin; }
  catch { return window.location.origin; }
}
const API_ORIGIN = getApiOrigin();

function absolutize(url) {
  if (!url) return '';
  if (/^https?:\/\//i.test(url)) return url;         // already absolute
  const path = url.startsWith('/') ? url : `/${url}`;
  return `${API_ORIGIN}${path}`;
}

function rowsToUrls(rows) {
  return (Array.isArray(rows) ? rows : [])
    .filter(s => s?.is_active !== false)
    .slice()
    .sort((a, b) => (a?.order ?? 0) - (b?.order ?? 0))
    .map(s => absolutize(s.image))                  // backend gives absolute; absolutize is a safe-guard
    .filter(Boolean);
}

/**
 * Returns an array of slide image URLs.
 * Uses the new endpoint: GET /api/slides/
 * (Also handles paginated shape { results: [] } just in case)
 */
export async function getHomeCarouselImages(/* slug ignored now */) {
  try {
    const { data } = await api.get('/slides/');
    const rows = Array.isArray(data) ? data : (data && data.results) ? data.results : [];
    return rowsToUrls(rows);
  } catch (e) {
    console.error('getHomeCarouselImages /slides/ failed:', e);
    return [];
  }
}
