// src/services/smaEndgameService.js
const API_BASE = process.env.REACT_APP_API_BASE_URL?.replace(/\/+$/, "") || "http://localhost:8000";

export async function fetchSmaEndgame() {
  const res = await fetch(`${API_BASE}/api/sma-endgame/`, {
    headers: { "Accept": "application/json" },
  });
  if (!res.ok) {
    throw new Error(`SMA Endgame API failed: ${res.status}`);
  }
  return res.json();
}
