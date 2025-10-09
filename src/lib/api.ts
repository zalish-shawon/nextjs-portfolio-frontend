import axios from "axios";

const API = process.env.NEXT_PUBLIC_API_URL;

const api = axios.create({
  baseURL: `${API}/api`,
  withCredentials: true, // include cookies if backend sets httpOnly cookie
});

export default api;
