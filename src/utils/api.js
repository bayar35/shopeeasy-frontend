// frontend/src/api.js
import axios from "axios";

const API = axios.create({
  // 🔥 ЭНД ТАНЫ БӨӨНДӨӨ ХАНДАХ БОДИТ БЭКЭНД ХАЯГ ЗААВАЛ БАЙХ ЁСТОЙ:
  baseURL: "https://shopeeasy-backend.onrender.com", 
  withCredentials: true, // Күүки болон JWT-ийг интернетээр алдаагүй дамжуулахад заавал хэрэгтэй
});

export default API;
