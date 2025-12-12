// src/services/api.js
import axios from 'axios';
import { getAuthToken } from './authHelpers';

// baseURL should match your Spring Boot API
const api = axios.create({
  baseURL: 'http://localhost:8080/api',
  timeout: 10000
});

// request interceptor to add Authorization header if token exists
api.interceptors.request.use(config => {
  const token = getAuthToken();
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, error => Promise.reject(error));

export default api;
