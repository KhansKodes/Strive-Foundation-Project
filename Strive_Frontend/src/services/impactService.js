import api from './api';

// Helper: always return an array (handles paginated + non-paginated)
const toArray = (data) => Array.isArray(data) ? data : (Array.isArray(data?.results) ? data.results : []);

export async function fetchImpactStats() {
  const { data } = await api.get('/impact/stats/');
  return toArray(data);
}

export async function fetchImpactTexts() {
  const { data } = await api.get('/impact/texts/');
  return toArray(data);
}
