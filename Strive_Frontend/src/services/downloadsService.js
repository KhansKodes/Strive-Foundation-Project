// src/services/downloadsService.js
import api from "./api";

/** "2025-07-01" -> "Jul 2025" */
function monthYear(iso) {
  try {
    const d = new Date(iso);
    return d.toLocaleString(undefined, { month: "short", year: "numeric" });
  } catch {
    return iso || "";
  }
}

/** 3565158 (bytes) -> "3.4 MB" (or "900 KB") */
function humanSize(bytes) {
  const b = Number(bytes || 0);
  if (!b) return "";
  const kb = b / 1024;
  if (kb < 1024) return `${Math.round(kb)} KB`;
  const mb = kb / 1024;
  return `${mb.toFixed(1)} MB`;
}

/** Coerce array or paginated {results: []} */
function rowsOf(data) {
  if (Array.isArray(data)) return data;
  if (data && Array.isArray(data.results)) return data.results;
  return [];
}

/** Map backend record to your card shape */
function mapDoc(d) {
  const fileUrl = d.file_url || d.url || "#";
  return {
    id: d.id,
    title: d.title,
    date: monthYear(d.date),
    size: humanSize(d.size_bytes),
    type: (d.ext || "").toUpperCase(),  // "PDF", "PNG", "JPG" badge
    thumb: d.image_url || "",           // card image (optional)
    file: fileUrl,                      // used by both View and Download buttons
  };
}

export async function fetchFlyers() {
  const { data } = await api.get("/media-center/docs/flyers/");
  return rowsOf(data).map(mapDoc);
}

export async function fetchReports() {
  const { data } = await api.get("/media-center/docs/reports/");
  return rowsOf(data).map(mapDoc);
}

export async function fetchAudits() {
  const { data } = await api.get("/media-center/docs/audit/");
  return rowsOf(data).map(mapDoc);
}
