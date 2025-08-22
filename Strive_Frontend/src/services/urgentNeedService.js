import api from './api';

// Helper: always return an array (handles paginated + non-paginated)
const toArray = (data) => Array.isArray(data) ? data : (Array.isArray(data?.results) ? data.results : []);

export async function fetchUrgentNeeds() {
  const { data } = await api.get('/urgent-need/');
  return toArray(data);
}

export async function fetchGetInvolved() {
  const { data } = await api.get('/get-involved/');
  return toArray(data);
}
