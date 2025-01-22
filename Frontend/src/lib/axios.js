import axios from "axios";

export const axiosInstance = axios.create({
    baseURL: "https://chatify-65ur.onrender.com",
    withCredentials: true,
});