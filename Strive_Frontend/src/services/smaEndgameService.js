// src/services/smaEndgameService.js
const API_BASE =
  import.meta.env.VITE_API_BASE_URL?.replace(/\/+$/, "") || ""; // e.g. https://api.example.com

export async function fetchSmaEndgame() {
  const res = await fetch(`${API_BASE}/api/sma-endgame/`, {
    headers: { "Accept": "application/json" },
  });
  if (!res.ok) {
    throw new Error(`SMA Endgame API failed: ${res.status}`);
  }
  return res.json();
}
