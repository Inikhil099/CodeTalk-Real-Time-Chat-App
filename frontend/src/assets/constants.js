import axios from "axios";
const viteurl = "https://entirely-consist-dedicated-apparel.trycloudflare.com";

const baseURL = viteurl;
export const backend_url = axios.create({ baseURL,withCredentials:true, });
