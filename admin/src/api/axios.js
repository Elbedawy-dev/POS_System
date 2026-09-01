import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "https://pos-system-backend-orpin.vercel.app/api",
  withCredentials: true,
});

export default api;