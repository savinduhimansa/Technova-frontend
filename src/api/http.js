import axios from "axios";

const BASE = (import.meta.env.VITE_BACKEND_URL || "").replace(/\/+$/, "");

export const api = axios.create({
  baseURL: BASE,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((cfg) => {
  const t = localStorage.getItem("token");
  if (t) cfg.headers.Authorization = `Bearer ${t}`;
  return cfg;
});

export const toUrl = (path) => (BASE ? `${BASE}${path}` : path);
