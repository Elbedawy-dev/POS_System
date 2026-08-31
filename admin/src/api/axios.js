import axios from "axios";

const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/api`,
  withCredentials: true,
});

api.interceptors.request.use(
  (config) => {
    const token = document.cookie
      .split(";")
      .find((cookie) => cookie.trim().startsWith("token="));

    if (token) {
      config.headers["Authorization"] = `Bearer ${token.split("=")[1]}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default api;