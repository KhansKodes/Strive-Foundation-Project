// src/services/galleryService.js
import api from "./api";

/** Extract a YouTube video ID from common URL formats */
function getYouTubeId(url = "") {
  try {
    const u = new URL(url);
    if (u.hostname.includes("youtu.be")) return u.pathname.slice(1);
    if (u.hostname.includes("youtube.com")) {
      if (u.searchParams.get("v")) return u.searchParams.get("v");
      // formats like /embed/ID or /v/ID
      const parts = u.pathname.split("/");
      const i = parts.findIndex((p) => p === "embed" || p === "v");
      if (i >= 0 && parts[i + 1]) return parts[i + 1];
    }
  } catch { /* ignore */ }
  return "";
}

export async function fetchPhotos() {
  const { data } = await api.get("/media-center/gallery/photos/");
  const rows = Array.isArray(data) ? data : data?.results || [];
  // Map to your UI shape (src & thumb both from image_url)
  return rows.map((r) => ({
    id: r.id,
    title: r.title,
    desc: r.description || "",
    src: r.image_url || "",     // large view
    thumb: r.image_url || "",   // card image
  }));
}

export async function fetchVideos() {
  const { data } = await api.get("/media-center/gallery/videos/");
  const rows = Array.isArray(data) ? data : data?.results || [];
  return rows.map((r) => {
    const yt = getYouTubeId(r.url || "");
    return {
      id: r.id,
      title: r.title,
      desc: r.description || "",
      youtubeId: yt,                                                // used by modal embed
      thumb: yt ? `https://img.youtube.com/vi/${yt}/hqdefault.jpg`  // card thumbnail
           : "",                                                    // (leave empty if non-YouTube)
      _rawUrl: r.url || "",
    };
  });
}

export async function fetchHighlights() {
  const { data } = await api.get("/media-center/gallery/campaign-highlights/");
  const rows = Array.isArray(data) ? data : data?.results || [];
  return rows.map((r) => ({
    id: r.id,
    title: r.title,
    desc: r.description || "",
    img: r.image_url || "",
    url: r.url || "#!",            // “Read more” link in your card
  }));
}
