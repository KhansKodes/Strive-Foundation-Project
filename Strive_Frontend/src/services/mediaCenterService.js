// Uses the same axios instance as your other working services.
import api from "./api";

/**
 * Try a list of paths until one returns 200 and an array/JSON.
 */
async function getFirstOk(paths) {
  let lastErr;
  for (const path of paths) {
    try {
      const { data } = await api.get(path);
      return data;
    } catch (e) {
      lastErr = e;
      // continue trying next path
    }
  }
  throw lastErr || new Error("No endpoint responded");
}

/**
 * Normalize backend record -> shape expected by your list UI.
 */
function humanDate(iso) {
  try {
    const d = new Date(iso);
    return d.toLocaleDateString(undefined, { day: "2-digit", month: "short", year: "numeric" });
  } catch {
    return iso;
  }
}
function mapPost(p) {
  return {
    id: p.id,
    title: p.title,
    date: humanDate(p.date || p.created_at || p.updated_at),
    img: p.image_url || p.image || p.thumbnail || "",
    excerpt: p.description || p.excerpt || "",
    readMoreUrl: p.url || (p.slug ? `/news/${p.slug}` : "#!"),
  };
}

/**
 * Accept both array and paginated {results: []}.
 */
function coerceArray(data) {
  if (Array.isArray(data)) return data;
  if (data && Array.isArray(data.results)) return data.results;
  return [];
}

export async function getFeaturedStories() {
  // Support hyphen/underscore variants if your urls file differs.
  const data = await getFirstOk([
    "/media-center/featured-stories/",
    "/media_center/featured-stories/",
  ]);
  return coerceArray(data).map(mapPost);
}

export async function getPressReleases() {
  const data = await getFirstOk([
    "/media-center/press-releases/",
    "/media_center/press-releases/",
  ]);
  return coerceArray(data).map(mapPost);
}
