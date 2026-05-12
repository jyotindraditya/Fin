import api from './api';

const TOKEN_KEY = 'fintracker_access_token';
const REFRESH_KEY = 'fintracker_refresh_token';
const USER_KEY = 'fintracker_user';

export const authService = {
  register: (username, password) =>
    api.post('/auth/register', { username, password }),

  login: (username, password) =>
    api.post('/auth/login', { username, password }),

  refresh: (refreshToken) =>
    api.post('/auth/refresh', { refreshToken }),

  // Token management
  saveTokens(data) {
    localStorage.setItem(TOKEN_KEY, data.accessToken);
    localStorage.setItem(REFRESH_KEY, data.refreshToken);
    localStorage.setItem(USER_KEY, data.username);
  },

  getAccessToken() {
    return localStorage.getItem(TOKEN_KEY);
  },

  getRefreshToken() {
    return localStorage.getItem(REFRESH_KEY);
  },

  getUsername() {
    return localStorage.getItem(USER_KEY);
  },

  clearTokens() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REFRESH_KEY);
    localStorage.removeItem(USER_KEY);
  },

  isAuthenticated() {
    return !!localStorage.getItem(TOKEN_KEY);
  },
};
