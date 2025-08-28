// src/services/smaEndgameService.js

// Works in CRA; uses env if provided, else defaults to localhost:8000
const API_BASE =
  (process.env.REACT_APP_API_BASE_URL || "http://localhost:8000").replace(/\/+$/, "");

export async function fetchSmaEndgame() {
  const res = await fetch(`${API_BASE}/api/sma-endgame/`, {
    headers: { Accept: "application/json" },
  });
  if (!res.ok) throw new Error(`SMA Endgame API failed: ${res.status}`);
  return res.json();
}

export async function fetchSmaInfoSections() {
  const res = await fetch(`${API_BASE}/api/sma-endgame/info-sections/`, {
    headers: { Accept: "application/json" },
  });
  if (!res.ok) throw new Error(`Info Sections API failed: ${res.status}`);
  return res.json(); // -> [{slug,title,description}, ...]
}
