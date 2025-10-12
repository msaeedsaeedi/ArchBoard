"use client";

import { useCallback, useMemo, useState } from "react";
import { LoadingContext, type LoadingState } from "./loading.context";

interface LoadingProviderProps {
  children: React.ReactNode;
}

export function LoadingProvider({ children }: LoadingProviderProps) {
  const [loading, setLoadingState] = useState<LoadingState>({});

  const setLoading = useCallback((key: string, value: boolean) => {
    setLoadingState((prev) => ({
      ...prev,
      [key]: value,
    }));
  }, []);

  const isAnyLoading = useCallback(() => {
    return Object.values(loading).some(Boolean);
  }, [loading]);

  const isPageLoading = useCallback(
    (page: string) => {
      return loading.auth || loading[page] || loading.global;
    },
    [loading],
  );

  const getLoading = useCallback(
    (key: string) => {
      return loading[key] || false;
    },
    [loading],
  );

  const value = useMemo(
    () => ({
      loading,
      setLoading,
      isAnyLoading,
      isPageLoading,
      getLoading,
    }),
    [loading, setLoading, isAnyLoading, isPageLoading, getLoading],
  );

  return (
    <LoadingContext.Provider value={value}>{children}</LoadingContext.Provider>
  );
}
