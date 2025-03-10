import axios from "axios";

export const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_URL || "https://chatify-65ur.onrender.com",
    withCredentials: true,
});