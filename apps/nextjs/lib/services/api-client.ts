import axios, { type AxiosInstance, type AxiosResponse } from "axios";
import { environment } from "../config/environment";
import type { ApiError } from "../types";

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: environment.apiUrl,
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
      },
    });

    // Response interceptor for error handling
    this.client.interceptors.response.use(
      (response: AxiosResponse) => response,
      (error) => {
        const apiError: ApiError = {
          message: error.response?.data?.message || "Something went wrong",
          statusCode: error.response?.status || 500,
        };

        // Handle specific error cases
        if (error.response?.status === 401) {
          // Redirect to login if unauthorized and not already on login page
          if (
            typeof window !== "undefined" &&
            !window.location.pathname.includes("/login")
          ) {
            window.location.href = "/login";
          }
        }

        return Promise.reject(apiError);
      },
    );
  }

  public get<T>(url: string): Promise<T> {
    return this.client.get<T>(url).then((response) => response.data);
  }

  public post<T>(url: string, data?: unknown): Promise<T> {
    return this.client.post<T>(url, data).then((response) => response.data);
  }

  public patch<T>(url: string, data?: unknown): Promise<T> {
    return this.client.patch<T>(url, data).then((response) => response.data);
  }

  public delete<T>(url: string, data?: unknown): Promise<T> {
    return this.client
      .delete<T>(url, { data })
      .then((response) => response.data);
  }
}

export const apiClient = new ApiClient();
