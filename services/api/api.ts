import axios from 'axios';
import { useAuthStore } from '@/store/auth.store';

const BASE_URL = 'https://api.bunyodoptom.uz/api/v1';

export const api = axios.create({
  baseURL: BASE_URL,
});

// 🔐 REQUEST INTERCEPTOR
api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// 🚪 RESPONSE INTERCEPTOR
api.interceptors.response.use(
  (response) => response,

  async (error) => {
    if (error.response?.status === 401) {
      // logout
      useAuthStore.getState().clearAuth();
    }

    return Promise.reject(error);
  }
);
