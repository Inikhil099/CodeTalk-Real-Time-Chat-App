import axios from "axios";
const viteurl = "/";

const baseURL = viteurl;
export const backend_url = axios.create({ baseURL });
backend_url.interceptors.request.use((cfg) => {
  const token = localStorage.getItem("authtoken");
  if (token) cfg.headers.Authorization = `Bearer ${token}`;
  return cfg;
});
