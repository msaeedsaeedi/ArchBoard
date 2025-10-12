export interface DataLoader<T = unknown> {
  load: () => Promise<T>;
  loadingKey: string;
  dependencies?: string[];
}

export interface LoaderResult<T = unknown> {
  data: T | null;
  isLoading: boolean;
  error: Error | null;
  reload: () => Promise<void>;
}

export interface AuthState {
  isAuthenticated: boolean;
  isInitialized: boolean;
}
