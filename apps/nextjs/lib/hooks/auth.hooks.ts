import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuthStore } from "../store/auth.store";

/**
 * Hook to protect routes - redirects to login if not authenticated
 */
export const useAuthGuard = () => {
  const { isAuthenticated, isInitialized, initialize } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!isInitialized) {
      initialize();
    }
  }, [isInitialized, initialize]);

  useEffect(() => {
    if (isInitialized && !isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, isInitialized, router]);

  return { isAuthenticated, isInitialized };
};

/**
 * Hook to redirect authenticated users away from auth pages
 */
export const useGuestGuard = () => {
  const { isAuthenticated, isInitialized, initialize } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!isInitialized) {
      initialize();
    }
  }, [isInitialized, initialize]);

  useEffect(() => {
    if (isInitialized && isAuthenticated) {
      router.push("/dashboard");
    }
  }, [isAuthenticated, isInitialized, router]);

  return { isAuthenticated, isInitialized };
};
