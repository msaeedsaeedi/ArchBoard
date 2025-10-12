import { createContext, useContext } from "react";

export interface LoadingState {
  [key: string]: boolean;
}

export interface LoadingContextType {
  loading: LoadingState;
  setLoading: (key: string, value: boolean) => void;
  isAnyLoading: () => boolean;
  isPageLoading: (page: string) => boolean;
  getLoading: (key: string) => boolean;
}

export const LoadingContext = createContext<LoadingContextType | null>(null);

export const useLoading = () => {
  const context = useContext(LoadingContext);
  if (!context) {
    throw new Error("useLoading must be used within a LoadingProvider");
  }
  return context;
};
