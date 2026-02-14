
import axios from "axios";

const api = axios.create({
  baseURL:
    process.env.NODE_ENV === "production"
      ? process.env.NEXT_PUBLIC_PROD_SERVER_URL
      : process.env.NEXT_PUBLIC_SERVER_URL,
  withCredentials: true, 
});

// Add token from localStorage if it exists
if (typeof window !== 'undefined') {
  const token = localStorage.getItem("adminToken");
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }
}

export default api;