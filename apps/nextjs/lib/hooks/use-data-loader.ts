import { useCallback, useEffect, useRef, useState } from "react";
import { useLoading } from "../contexts/loading.context";
import { useAuthStore } from "../store/auth.store";
import type { DataLoader, LoaderResult } from "../types/loader.types";

export function useDataLoader<T>(
  loader: DataLoader<T>,
  options: {
    requireAuth?: boolean;
    autoLoad?: boolean;
    onError?: (error: Error) => void;
    minLoadingDelay?: number;
  } = {},
): LoaderResult<T> {
  const {
    requireAuth = true,
    autoLoad = true,
    onError,
    minLoadingDelay = 300,
  } = options;
  const { isAuthenticated, isInitialized } = useAuthStore();
  const { setLoading } = useLoading();

  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const hasLoadedRef = useRef(false);
  const isLoadingRef = useRef(false);

  const canLoad = useCallback((): boolean => {
    if (!isInitialized) return false;
    if (requireAuth && !isAuthenticated) return false;
    return true;
  }, [isInitialized, isAuthenticated, requireAuth]);

  const loadData = useCallback(async (): Promise<void> => {
    if (!canLoad() || isLoadingRef.current) return;

    isLoadingRef.current = true;
    setLoading(loader.loadingKey, true);
    setError(null);

    // Start both the data loading and minimum delay timer
    const startTime = Date.now();

    try {
      console.log(`[useDataLoader] Loading ${loader.loadingKey}...`);
      const result = await loader.load();

      // Ensure minimum loading time to prevent blinking
      const elapsedTime = Date.now() - startTime;
      if (elapsedTime < minLoadingDelay) {
        await new Promise((resolve) =>
          setTimeout(resolve, minLoadingDelay - elapsedTime),
        );
      }

      setData(result);
      hasLoadedRef.current = true;
      console.log(`[useDataLoader] Successfully loaded ${loader.loadingKey}`);
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      console.error(
        `[useDataLoader] Failed to load ${loader.loadingKey}:`,
        error,
      );
      onError?.(error);
    } finally {
      isLoadingRef.current = false;
      setLoading(loader.loadingKey, false);
    }
  }, [canLoad, loader, setLoading, onError, minLoadingDelay]);

  // Auto-load data when conditions are met
  useEffect(() => {
    if (autoLoad && canLoad() && !hasLoadedRef.current) {
      loadData();
    }
  }, [autoLoad, canLoad, loadData]);

  // Reset data when auth state changes
  useEffect(() => {
    if (requireAuth && !isAuthenticated) {
      setData(null);
      setError(null);
      hasLoadedRef.current = false;
    }
  }, [isAuthenticated, requireAuth]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      setLoading(loader.loadingKey, false);
    };
  }, [loader.loadingKey, setLoading]);

  const reload = useCallback(async (): Promise<void> => {
    hasLoadedRef.current = false;
    await loadData();
  }, [loadData]);

  return {
    data,
    isLoading: isLoadingRef.current,
    error,
    reload,
  };
}
