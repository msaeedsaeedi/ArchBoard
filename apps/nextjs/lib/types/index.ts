export enum CollaboratorRole {
  VIEWER = "VIEWER",
  EDITOR = "EDITOR",
}

export interface Board {
  id: number;
  slug: string;
  title: string;
  description?: string;
  collaborated: boolean;
}

export interface Collaborator {
  email: string;
  role: CollaboratorRole;
}

export interface User {
  userId: number;
  email: string;
  fullName: string;
  pictureUrl?: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface BoardFormData {
  title: string;
  description?: string;
}

export interface LoginFormData {
  email: string;
  password: string;
}

export interface SignupFormData {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface ApiResponse<T = unknown> {
  data: T;
  message?: string;
}

export interface ApiError {
  message: string;
  statusCode: number;
}
