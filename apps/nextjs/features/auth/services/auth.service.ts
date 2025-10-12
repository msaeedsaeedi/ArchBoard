import { apiClient } from "@/lib/services/api-client";
import type { User } from "@/lib/types";
import type { LoginFormData, SignupFormData } from "../validations/schemas";

export class AuthService {
  async isLoggedIn(): Promise<boolean> {
    try {
      await apiClient.get("/auth");
      return true;
    } catch {
      return false;
    }
  }

  async getCurrentUser(): Promise<User | null> {
    try {
      const user = await apiClient.get<User>("/auth/me");
      return user;
    } catch {
      return null;
    }
  }

  async login(data: LoginFormData): Promise<void> {
    try {
      await apiClient.post("/auth/login", data);
    } catch (error: unknown) {
      const apiError = error as { statusCode?: number };
      if (apiError.statusCode === 401) {
        throw new Error("Invalid email or password.");
      }
      throw new Error("Login failed. Please try again later.");
    }
  }

  async signup(data: SignupFormData): Promise<void> {
    const { confirmPassword: _, ...signupData } = data;
    try {
      await apiClient.post("/auth/signup", signupData);
    } catch (error: unknown) {
      const apiError = error as { statusCode?: number };
      if (apiError.statusCode === 409) {
        throw new Error("Account already exists!");
      }
      if (apiError.statusCode === 400) {
        throw new Error("Invalid data provided");
      }
      throw new Error("Signup failed. Please try again later.");
    }
  }

  async logout(): Promise<void> {
    try {
      await apiClient.post("/auth/logout");
    } catch {
      throw new Error("Logout failed. Please try again.");
    }
  }
}

export const authService = new AuthService();
