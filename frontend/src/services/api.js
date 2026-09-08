import axios from 'axios';

// Khi deploy: VITE_API_URL = https://sbdcs-backend.onrender.com
// Khi local:  proxy vite tự xử lý nên để trống hoặc localhost:8000
const configuredUrl = (import.meta.env.VITE_API_URL || import.meta.env.VITE_API_BASE_URL || '').trim().replace(/\/+$/, '');
const BACKEND_URL = configuredUrl.replace(/\/api$/, '');

// Uploaded files live on the API host; bundled /images stay on the frontend.
export const resolveMediaUrl = (url) => {
  if (typeof url !== 'string') return '';
  const value = url.trim();
  if (/^\/?uploads\//.test(value)) return `${BACKEND_URL}/${value.replace(/^\//, '')}`;
  return value;
};

const api = axios.create({
  baseURL: BACKEND_URL ? `${BACKEND_URL}/api` : '/api',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers = config.headers || {};
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.config?.url !== '/auth/login' && (error.response?.status === 401 || error.response?.status === 403)) {
      if (error.response?.data?.detail === 'Not authenticated' || error.response?.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
