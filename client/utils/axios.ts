// utils/axios.ts
import axios, { InternalAxiosRequestConfig } from "axios";

const api = axios.create({
  baseURL:
    process.env.NODE_ENV === "production"
      ? process.env.NEXT_PUBLIC_PROD_SERVER_URL
      : process.env.NEXT_PUBLIC_SERVER_URL,
  timeout: 30000,
});

// Add request interceptor to attach token
api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = localStorage.getItem("adminToken");
  if (token) {
    // Properly set the custom header
    config.headers.set('x-auth-token', token);
    console.log("📤 Token attached as x-auth-token");
  }
  return config;
});

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.log("❌ 401 Unauthorized - clearing token");
      localStorage.removeItem("adminToken");
      if (typeof window !== 'undefined' && !window.location.pathname.includes('/login')) {
        window.location.href = "/admin/login";
      }
    }
    return Promise.reject(error);
  }
);

export default api;