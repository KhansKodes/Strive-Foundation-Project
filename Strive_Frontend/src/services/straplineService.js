import api from './api';

/**
 * Returns a single string for the banner.
 * Prefers GET /api/straplines/latest/ (recommended),
 * falls back to GET /api/straplines/ (takes active, lowest priority).
 */
export async function fetchStrapline() {
  // 1) Preferred: /straplines/latest/
  try {
    const { data } = await api.get('/straplines/latest/');
    if (data && typeof data.text === 'string' && data.text.trim()) {
      return data.text.trim();
    }
  } catch (_) {
    // ignore and try fallback
  }

  // 2) Fallback: /straplines/ (array)
  try {
    const { data } = await api.get('/straplines/');
    const rows = Array.isArray(data) ? data : [];
    const active = rows.filter(r => r?.is_active);
    active.sort((a, b) => (a?.priority ?? 0) - (b?.priority ?? 0));
    const chosen = active[0] || rows[0];
    if (chosen?.text) return String(chosen.text).trim();
  } catch (e) {
    console.error('fetchStrapline error:', e);
  }

  // last resort: keep your current hardcoded message
  return 'Re-discovering a world where every ailment is curable';
}
