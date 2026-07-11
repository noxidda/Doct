import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  timeout: 5000 // 5 seconds timeout before fallback
});

// Request interceptor to automatically attach authorization and mock context headers
api.interceptors.request.use((config) => {
  const userStr = localStorage.getItem('wattker_user');
  if (userStr) {
    try {
      const user = JSON.parse(userStr);
      // Pass headers representing the active mock user profile
      config.headers['X-Mock-User-Id'] = user.id || 'usr_owner';
      config.headers['X-Mock-User-Role'] = user.role || 'Owner';
      config.headers['X-Mock-User-Email'] = user.email || 'owner@wattker.com';
      config.headers['X-Mock-User-Name'] = user.name || 'Arthur Bauhaus';
      
      // Clerk authorization header (if configured)
      const token = localStorage.getItem('wattker_clerk_token');
      if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
      }
    } catch (e) {
      console.error('Failed to parse user for api headers:', e);
    }
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default api;
