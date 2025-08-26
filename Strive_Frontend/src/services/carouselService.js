import api from './api'; // axios instance with baseURL -> http://127.0.0.1:8000/api

// Resolve API origin so we can turn /media/... into absolute URLs
function getApiOrigin() {
  const base = api.defaults?.baseURL || '/api';
  try { return new URL(base, window.location.origin).origin; }
  catch { return window.location.origin; }
}
const API_ORIGIN = getApiOrigin();

function absolutize(url) {
  if (!url) return '';
  if (/^https?:\/\//i.test(url)) return url;        // already absolute
  const path = url.startsWith('/') ? url : `/${url}`; // ensure leading slash
  return `${API_ORIGIN}${path}`;
}

function rowsToUrls(rows) {
  return (Array.isArray(rows) ? rows : [])
    .filter(s => s?.is_active !== false)
    .slice()
    .sort((a, b) => (a?.order ?? 0) - (b?.order ?? 0))
    // accept several possible field names just in case
    .map(s => absolutize(s.image || s.image_url || s.file || s.src))
    .filter(Boolean);
}

/**
 * Returns an array of slide image URLs for a given carousel slug.
 * Tries /carousel/{slug}/ first, then /carousel/slides/?carousel=slug
 * Handles both array and paginated (results) shapes.
 */
export async function getHomeCarouselImages(slug = 'home') {
  // 1) Preferred one-shot
  try {
    const { data } = await api.get(`/carousel/${encodeURIComponent(slug)}/`);
    const urls = rowsToUrls(data?.slides || (data?.results ?? []));
    if (urls.length) return urls;
  } catch (e) {
    // console.debug('carousel/<slug> failed', e);
  }

  // 2) Fallback: slides-only endpoint
  try {
    const { data } = await api.get('/carousel/slides/', { params: { carousel: slug } });
    const rows = Array.isArray(data) ? data : (data && data.results) ? data.results : [];
    const urls = rowsToUrls(rows);
    if (urls.length) return urls;
  } catch (e) {
    // console.debug('carousel/slides failed', e);
  }

  // 3) Nothing to show
  return [];
}
