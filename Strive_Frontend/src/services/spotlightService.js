import api from './api';

/* Build absolute URL for /media/... or relative paths */
function absolutize(u) {
  if (!u) return '';
  if (/^https?:\/\//i.test(u)) return u;
  const base = api?.defaults?.baseURL || '/api';
  let origin;
  try { origin = new URL(base, window.location.origin).origin; }
  catch { origin = window.location.origin; }
  const path = u.startsWith('/') ? u : `/${u}`;
  return `${origin}${path}`;
}

/* Normalize ANY backend shape to: { title, subtitle, items:[{image, description, url}], } */
function normalize(payload) {
  if (!payload || typeof payload !== 'object') {
    return { title: '', subtitle: '', items: [] };
  }

  const title = payload.title || '';
  const subtitle = payload.subtitle || '';

  // Find an array of items in common keys
  let arr =
    (Array.isArray(payload.items) && payload.items) ||
    (Array.isArray(payload.entries) && payload.entries) ||
    (Array.isArray(payload.media) && payload.media) ||
    (Array.isArray(payload.cards) && payload.cards) ||
    null;

  // If no array exists, try legacy flat fields (image1/desc1, image2/desc2)
  if (!arr) {
    const leftImg =
      payload.image1 || payload.left_image || payload.image_left || payload.image || null;
    const leftDesc =
      payload.description1 || payload.left_description || payload.description_left || payload.description || '';
    const leftUrl =
      payload.url1 || payload.left_url || payload.url || '';

    const rightImg = payload.image2 || payload.right_image || null;
    const rightDesc =
      payload.description2 || payload.right_description || '';
    const rightUrl =
      payload.url2 || payload.right_url || '';

    arr = [];
    if (leftImg || leftDesc) arr.push({ image: leftImg, description: leftDesc, url: leftUrl, order: 0, is_active: true });
    if (rightImg || rightDesc) arr.push({ image: rightImg, description: rightDesc, url: rightUrl, order: 1, is_active: true });
  }

  const items = (arr || [])
    .filter((it) => it?.is_active !== false)
    .sort((a, b) => (a?.order ?? 0) - (b?.order ?? 0))
    .map((it) => ({
      image: absolutize(it?.image || it?.image_url || ''),
      description: (it?.description || it?.text || '').trim(),
      url: it?.url || '',
    }));

  // Ensure we always return 2 slots so the layout never collapses
  while (items.length < 2) items.push({ image: '', description: '', url: '' });

  return { title, subtitle, items };
}

/* Try a list of endpoints until one succeeds */
async function fetchPanel(candidates) {
  for (const path of candidates) {
    try {
      const { data } = await api.get(path);
      return normalize(data);
    } catch (_) {
      // try next
    }
  }
  return { title: '', subtitle: '', items: [] };
}

/* Public API: Spotlight + Impact Makers */
export async function getSpotlightPanel() {
  return fetchPanel([
    '/landing/spotlight/',         // recommended
    '/in-the-spotlight/',          // alternate naming
    '/spotlight/',                 // fallback
  ]);
}

export async function getImpactMakersPanel() {
  return fetchPanel([
    '/landing/impact-makers/',     // recommended
    '/impact-makers/',             // alternate naming
  ]);
}
