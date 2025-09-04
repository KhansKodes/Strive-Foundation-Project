// src/services/mediaCenterService.js

// Point this to your backend origin. Example:
// REACT_APP_API_BASE_URL=http://localhost:8000
const API_BASE = process.env.REACT_APP_API_BASE_URL || "";

/**
 * Format "YYYY-MM-DD" to "DD MMM YYYY" (e.g., 2025-08-12 -> 12 Aug 2025)
 */
function humanDate(isoDate) {
  try {
    const d = new Date(isoDate);
    return d.toLocaleDateString(undefined, { day: "2-digit", month: "short", year: "numeric" });
  } catch {
    return isoDate;
  }
}

/**
 * Map backend post -> frontend card shape your UI expects.
 */
function mapPost(p) {
  return {
    id: p.id,
    title: p.title,
    date: humanDate(p.date),
    img: p.image_url,                      // backend serializer provides image_url
    excerpt: p.description,                // shown as the short text
    readMoreUrl: p.url || `/news/${p.slug}`// external url if set; otherwise internal slug
  };
}

async function fetchJson(url) {
  const res = await fetch(url, { credentials: "include" });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

export async function getFeaturedStories(limit = 6) {
  const url = `${API_BASE}/api/media-center/featured-stories/?limit=${limit}`;
  const data = await fetchJson(url);
  return Array.isArray(data) ? data.map(mapPost) : [];
}

export async function getPressReleases(limit = 6) {
  const url = `${API_BASE}/api/media-center/press-releases/?limit=${limit}`;
  const data = await fetchJson(url);
  return Array.isArray(data) ? data.map(mapPost) : [];
}
