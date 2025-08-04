import axios from 'axios';

const api = axios.create({
  baseURL: 'https://api.example.com' // point to your real backend later
});

export default api;
