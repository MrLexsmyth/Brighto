import axios from "axios";

const api = axios.create({
  baseURL:
    process.env.NODE_ENV === "production"
      ? process.env.NEXT_PUBLIC_PROD_SERVER_URL
      : process.env.NEXT_PUBLIC_SERVER_URL,
  withCredentials: true, 
});

// CRITICAL: Add request interceptor to ALWAYS attach token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("adminToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
    console.log("📤 Attaching token to request:", config.url);
  } else {
    console.log("⚠️ No token to attach");
  }
  return config;
});

// Add response interceptor to catch 401 errors
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