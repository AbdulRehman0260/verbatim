import { create } from "zustand";
import { persist } from "zustand/middleware";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";

type UserStore = {
  authUser: any;
  isLoggingIn: boolean;
  isSigningUp: boolean;
  setAuthUser: (user: any) => void;
  signup: (data: any) => Promise<void>;
  login: (data: any) => Promise<void>;
  logout: () => Promise<void>;
};

export const authStore = create<UserStore>()(
  persist(
    (set) => ({
      authUser: null,
      isSigningUp: false,
      isLoggingIn: false,
      setAuthUser: (user) => set({ authUser: user }),
      signup: async (data) => {
        set({ isSigningUp: true });
        try {
          const res = await axiosInstance.post("/users", data);
          toast.success("Account created successfully");
          set({ authUser: res.data });
        } catch (error) {
          toast.error("Error signing up");
          console.log(error);
        } finally {
          set({ isSigningUp: false });
        }
      },
      login: async (data) => {
        set({ isLoggingIn: true });
        try {
          const res = await axiosInstance.post("/login", data);
          toast.success("Logged in successfully");
          set({ authUser: res.data });
        } catch (error) {
          toast.error("Error logging in");
          console.log(error);
        } finally {
          set({ isLoggingIn: false });
        }
      },
      logout: async () => {
        try {
          await axiosInstance.post("/logout");
          toast.success("Logged out successfully");
          set({ authUser: null });
        } catch (error) {
          toast.error("Error logging out");
          console.log(error);
        }
      },
    }),
    { name: "auth-storage" }
  )
);
