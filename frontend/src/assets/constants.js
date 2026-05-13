import axios from "axios";
const viteurl = "";

const baseURL = viteurl;
export const backend_url = axios.create({ baseURL,withCredentials:true, });
