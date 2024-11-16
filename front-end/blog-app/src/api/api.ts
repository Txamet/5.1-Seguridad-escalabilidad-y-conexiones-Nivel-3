import axios from 'axios';

const PORT = import.meta.env.VITE_PORT || 3000

const api = axios.create({
  baseURL: `http://localhost:${PORT}`
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;