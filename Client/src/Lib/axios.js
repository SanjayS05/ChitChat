import axios from "axios";

export const axiosInstance = axios.create({
    baseURL: "https://chitchat-server-six.vercel.app/api",
    withCredentials: true
});

