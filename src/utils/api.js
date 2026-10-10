import axios from "axios";

// ⭐ Production Backend URL (Vercel дээр ажиллана)
const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  "https://shopeeasy-backend.onrender.com/api/v1";

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Response interceptor — 429 (Too Many Requests) алдааг зохицуулах
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 429) {
      console.warn("Rate limit хэтэрлээ. Түр хүлээнэ үү.");
    }
    return Promise.reject(error);
  }
);

export default api;