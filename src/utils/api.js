// frontend/src/api.js
import axios from "axios";

const API = axios.create({
  // 🔥 ЭНД ТАНЫ БӨӨНДӨӨ ХАНДАХ БОДИТ БЭКЭНД ХАЯГ ЗААВАЛ БАЙХ ЁСТОЙ:
  baseURL: "https://shopeeasy-backend.onrender.com", 
  withCredentials: true, // Күүки болон JWT-ийг интернетээр алдаагүй дамжуулахад заавал хэрэгтэй
});

export default API;

import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api/v1",
  withCredentials: true, // Cookie дамжуулахад шаардлагатай
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