"use client";

import { useSession } from "next-auth/react";
import { useEffect } from "react";
import type { User } from "@/lib/types";
import { useAuthStore } from "../store/auth.store";

/**
 * Custom hook that provides NextAuth session data
 * and keeps the Zustand store in sync for compatibility
 */
export function useAuth() {
  const { data: session, status } = useSession();
  const { user, isLoading, setUser, setLoading, logout } = useAuthStore();

  // Keep Zustand store in sync with NextAuth session
  useEffect(() => {
    if (status === "loading") {
      setLoading(true);
      return;
    }

    setLoading(false);

    if (session?.user) {
      const nextAuthUser: User = {
        userId: session.user.userId,
        email: session.user.email,
        fullName: session.user.fullName,
        pictureUrl: session.user.pictureUrl,
      };
      setUser(nextAuthUser);
    } else {
      setUser(null);
    }
  }, [session, status, setUser, setLoading]);

  return {
    // Session data from NextAuth
    session,

    // User data (from session or Zustand for compatibility)
    user: session?.user || user,

    // Authentication status
    isAuthenticated: !!session,
    isLoading: status === "loading" || isLoading,

    // Actions
    logout,
  };
}
