// src/services/api.js
import axios from 'axios';

const BASE_URL = import.meta.env.VITE_BACKEND_API;

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to attach token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('rabsToken')?.replace(/^"|"$/g, '');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add a response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Optionally handle global errors here
    return Promise.reject(error);
  }
);

export default api;
