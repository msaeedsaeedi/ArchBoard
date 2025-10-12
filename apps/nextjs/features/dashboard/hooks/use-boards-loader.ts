import { useDataLoader } from "../../../lib/hooks/use-data-loader";
import { boardsLoader } from "../../../lib/loaders/board.loaders";
import type { Board } from "../../../lib/types";

/**
 * Specialized hook for loading boards data
 * Uses the generic data loader with boards-specific configuration
 */
export function useBoardsLoader() {
  const { data, isLoading, error, reload } = useDataLoader<Board[]>(
    boardsLoader,
    {
      requireAuth: true,
      autoLoad: true,
      minLoadingDelay: 200, // Reduced delay for dashboard
      onError: (error) => {
        console.error("[useBoardsLoader] Failed to load boards:", error);
      },
    },
  );

  return {
    boards: data || [],
    isLoading,
    error,
    refresh: reload,
    hasData: (data?.length || 0) > 0,
  };
}
