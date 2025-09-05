import api from "./api";

// Helpers ----------------------------------------------------
function monthYear(iso) {
  try {
    const d = new Date(iso);
    return d.toLocaleString(undefined, { month: "short", year: "numeric" });
  } catch {
    return iso || "";
  }
}

function humanSize(bytes) {
  const b = Number(bytes || 0);
  if (!b) return "";
  const kb = b / 1024;
  if (kb < 1024) return `${Math.round(kb)} KB`;
  const mb = kb / 1024;
  return `${mb.toFixed(1)} MB`;
}

/** Pull everything, even if DRF returns paginated results */
async function fetchAll(url) {
  let rows = [];
  let nextUrl = url;

  // If your backend is same-origin with baseURL, we can follow absolute "next" links too.
  while (nextUrl) {
    const { data } = await api.get(nextUrl);
    if (Array.isArray(data)) {
      rows = data;                // non-paginated: done
      break;
    }
    const pageRows = Array.isArray(data?.results) ? data.results : [];
    rows = rows.concat(pageRows);
    nextUrl = data?.next || null; // absolute or relative; axios handles both
    if (!data || (!data.results && !data.next)) break;
  }

  return rows;
}

function mapDoc(d) {
  const fileUrl = d.file_url || d.url || "#";
  return {
    id: d.id,
    title: d.title,
    date: monthYear(d.date),
    size: humanSize(d.size_bytes),
    type: (d.ext || "").toUpperCase(),        // badge (PDF/PNG/JPG…)
    thumb: d.image_url || "",
    file: fileUrl,                             // used by View/Download buttons
  };
}

// Public API -------------------------------------------------
export async function fetchFlyers() {
  const rows = await fetchAll("/media-center/docs/flyers/");
  return rows.map(mapDoc);
}

export async function fetchReports() {
  const rows = await fetchAll("/media-center/docs/reports/");
  return rows.map(mapDoc);
}

export async function fetchAudits() {
  const rows = await fetchAll("/media-center/docs/audit/");
  return rows.map(mapDoc);
}
