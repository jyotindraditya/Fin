import axios from 'axios';
import { API_BASE_URL } from '../utils/constants';
import { authService } from './authService';

const api = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  headers: { 'Content-Type': 'application/json' },
  timeout: 90000,
});

// Request interceptor — attach JWT
api.interceptors.request.use((config) => {
  const token = authService.getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor — unwrap ApiResponse + auto-refresh on 401
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

api.interceptors.response.use(
  (response) => response.data,
  async (error) => {
    const originalRequest = error.config;

    // If 401 and we haven't already retried
    if (error.response?.status === 401 && !originalRequest._retry) {
      const refreshToken = authService.getRefreshToken();

      // No refresh token → go to login
      if (!refreshToken) {
        authService.clearTokens();
        window.location.href = '/';
        return Promise.reject(error);
      }

      if (isRefreshing) {
        // Queue this request while refresh is in progress
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then((token) => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return api(originalRequest);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const res = await axios.post(`${API_BASE_URL}/api/auth/refresh`, { refreshToken });
        const newTokens = res.data.data;
        authService.saveTokens(newTokens);

        originalRequest.headers.Authorization = `Bearer ${newTokens.accessToken}`;
        processQueue(null, newTokens.accessToken);

        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        authService.clearTokens();
        window.location.href = '/';
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    const message =
      error.response?.data?.message ||
      error.message ||
      'An unexpected error occurred';
    return Promise.reject(new Error(message));
  }
);

export default api;
