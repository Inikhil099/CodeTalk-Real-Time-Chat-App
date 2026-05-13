import axios from "axios";
const viteurl = "https://commented-sets-future-opposed.trycloudflare.com";

const baseURL = viteurl;
export const backend_url = axios.create({ baseURL,withCredentials:true, });
