import { create } from "zustand";
import { axiosInstance } from '../Lib/axios.js'
import toast from "react-hot-toast";

export const useAuthStore = create((set) => ({
    authUser: null,
    isSigningUp: false,
    isLoggingIn: false,
    isUpdatingProfile: false,

    isCheckingAuth: true,

    checkAuth: async () => {
        try {
            const res = axiosInstance.get('/auth/check');
            
            set({ authUser: res.data });
        } catch (error) {
            console.log("Error ERROR  " + error.message);
            set({ authUser: null });
        } finally {
            set({ isCheckingAuth: false })
        }
    },

    signup: async (data) => {
        set({ isSigningUp: true })
        try {
            const res = await axiosInstance.post("/auth/register", data);
            set({ authUser: res.data });
            toast.success("Account created successfully");
        } catch (error) {
            toast.error(error.message);
        } finally {
            set({ isSigningUp: false });
        }

    },

    logout: async () => {
        try {
            await axiosInstance.post("/auth/logout");
            set({ authUser: null });
        } catch (error) {
            toast.error(error.message);
        }
    }
}));