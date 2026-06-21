import axios from "axios";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
export const API = `${BACKEND_URL}/api`;
export const ASSET_BASE = BACKEND_URL;

export const api = axios.create({ baseURL: API });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("hilltrack_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const assetUrl = (path) => {
  if (!path) return "";
  if (path.startsWith("http")) return path;
  return `${ASSET_BASE}${path}`;
};
