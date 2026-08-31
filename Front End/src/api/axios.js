import axios from "axios";

const api = axios.create({
  baseURL: "https://pos-system-backend-orpin.vercel.app",
  withCredentials: true,
});

export default api;