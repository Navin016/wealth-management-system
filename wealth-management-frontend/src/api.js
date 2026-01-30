import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8000",
});

// 🔥 Attach JWT token to every request
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token"); // ✅ MUST match login
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default API;
