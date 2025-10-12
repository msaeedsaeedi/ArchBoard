import { signOut } from "next-auth/react";
import { create } from "zustand";
import type { User } from "@/lib/types";

interface AuthState {
  user: User | null;
  isLoading: boolean;
}

interface AuthActions {
  logout: () => Promise<void>;
  setUser: (user: User | null) => void;
  setLoading: (isLoading: boolean) => void;
}

type AuthStore = AuthState & AuthActions;

// Simplified auth store that works with NextAuth
// Session management is handled by NextAuth, this store is for additional UI state
export const useAuthStore = create<AuthStore>()((set) => ({
  // Initial state
  user: null,
  isLoading: false,

  // Actions
  logout: async () => {
    set({ isLoading: true });
    try {
      await signOut({
        callbackUrl: "/login",
        redirect: true,
      });
    } catch (error) {
      console.error("Logout error:", error);
      set({ isLoading: false });
      throw error;
    }
  },

  setUser: (user: User | null) => {
    set({ user });
  },

  setLoading: (isLoading: boolean) => {
    set({ isLoading });
  },
}));
