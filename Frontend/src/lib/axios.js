import axios from "axios";

export const axiosInstance = axios.create({
    baseURL: "https://chatify-b3y1.onrender.com",
    // baseURL: "http://localhost:3000",
    withCredentials: true,
});