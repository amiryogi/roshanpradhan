import axios, { AxiosError } from 'axios';
import { toast } from 'sonner';
import { useAuthStore } from '@/store/authStore';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  withCredentials: true,
});

// Request: attach token
api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token || localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Response: handle errors
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError<{ message?: string }>) => {
    const status = error.response?.status;
    const message = error.response?.data?.message || 'Something went wrong';

    if (status === 401) {
      const { isAuthenticated, logout } = useAuthStore.getState();
      if (isAuthenticated) {
        logout();
        toast.error('Session expired. Please sign in again.');
      }

      const isAdminPath = window.location.pathname.startsWith('/admin');
      const isLoginPath = window.location.pathname === '/admin/login';
      if (isAdminPath && !isLoginPath) {
        window.location.replace('/admin/login');
      }

      return Promise.reject(error);
    }

    toast.error(message);

    return Promise.reject(error);
  }
);
