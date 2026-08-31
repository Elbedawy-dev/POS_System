import axios from "axios";

const api = axios.create({
  baseURL: "https://pos-system-backend-orpin.vercel.app",
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