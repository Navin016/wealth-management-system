import axios from "axios";

// 🌐 Detect environment automatically
const BASE_URL =
  window.location.hostname === "localhost"
    ? "http://localhost:8000"
    : "https://wealth-management-system-qo3x.onrender.com";

const API = axios.create({
  baseURL: BASE_URL,
});

// 🔥 Attach JWT token to every request
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token"); // must match login key
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default API;
