"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { PageErrorBoundary } from "@/components/error-boundary";
import { PageLoading } from "@/components/ui/page-loading";
import { LoadingProvider } from "@/lib/contexts/loading.provider";
import { useAuthStore } from "@/lib/store/auth.store";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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

  if (!isInitialized) {
    return <PageLoading message="Initializing application..." />;
  }

  if (!isAuthenticated) {
    return null; // Will be redirected
  }

  return (
    <PageErrorBoundary>
      <LoadingProvider>{children}</LoadingProvider>
    </PageErrorBoundary>
  );
}
