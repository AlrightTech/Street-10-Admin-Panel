import axios, {
  AxiosError,
  AxiosInstance,
  InternalAxiosRequestConfig,
} from "axios";
import { env } from "../config/env";
import { ApiResponse, ApiError } from "./types";

/**
 * API Client Configuration
 * Handles authentication, error handling, and token refresh
 */

class ApiClient {
  private instance: AxiosInstance;
  private refreshTokenPromise: Promise<string> | null = null;

  constructor() {
    this.instance = axios.create({
      baseURL: env.apiUrl,
      headers: {
        "Content-Type": "application/json",
      },
      timeout: 30000,
    });

    this.setupInterceptors();
  }

  private setupInterceptors(): void {
    // Request interceptor - Add auth token
    this.instance.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        const token = this.getToken();
        if (token && config.headers) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error: unknown) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor - Handle errors and token refresh
    this.instance.interceptors.response.use(
      (response: any) => {
        // Backend returns data directly in response.data
        return response;
      },
      async (error: AxiosError<ApiError>) => {
        const originalRequest = error.config as InternalAxiosRequestConfig & {
          _retry?: boolean;
        };

        // Handle 401 Unauthorized - Token expired
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          try {
            const newToken = await this.refreshAccessToken();
            if (newToken && originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${newToken}`;
              return this.instance(originalRequest);
            }
          } catch (refreshError) {
            // Refresh failed - logout user
            this.handleLogout();
            return Promise.reject(refreshError);
          }
        }

        // Transform error to consistent format
        const apiError: ApiError = {
          success: false,
          message:
            error.response?.data?.message ||
            error.message ||
            "An error occurred",
          errors: error.response?.data?.errors,
        };

        return Promise.reject(apiError);
      }
    );
  }

  private async refreshAccessToken(): Promise<string> {
    // Prevent multiple simultaneous refresh requests
    if (this.refreshTokenPromise) {
      return this.refreshTokenPromise;
    }

    this.refreshTokenPromise = (async () => {
      try {
        const refreshToken = this.getRefreshToken();
        if (!refreshToken) {
          throw new Error("No refresh token available");
        }

        const response = await axios.post<
          ApiResponse<{ token: string; refreshToken: string }>
        >(`${env.apiUrl}/auth/refresh`, { refreshToken });

        if (response.data.success && response.data.data) {
          this.setToken(response.data.data.token);
          this.setRefreshToken(response.data.data.refreshToken);
          return response.data.data.token;
        }

        throw new Error("Token refresh failed");
      } catch (error) {
        this.handleLogout();
        throw error;
      } finally {
        this.refreshTokenPromise = null;
      }
    })();

    return this.refreshTokenPromise;
  }

  private getToken(): string | null {
    return localStorage.getItem("token");
  }

  private getRefreshToken(): string | null {
    return localStorage.getItem("refreshToken");
  }

  private setToken(token: string): void {
    localStorage.setItem("token", token);
  }

  private setRefreshToken(refreshToken: string): void {
    localStorage.setItem("refreshToken", refreshToken);
  }

  private handleLogout(): void {
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
    // Redirect to login page
    if (window.location.pathname !== "/login") {
      window.location.href = "/login";
    }
  }

  // Public methods
  public setAuthTokens(token: string, refreshToken: string): void {
    this.setToken(token);
    this.setRefreshToken(refreshToken);
  }

  public clearAuthTokens(): void {
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
  }

  public getInstance(): AxiosInstance {
    return this.instance;
  }
}

// Create singleton instance
const apiClient = new ApiClient();

// Export configured axios instance
export const api = apiClient.getInstance();

// Export helper functions
export const setAuthTokens = (token: string, refreshToken: string) => {
  apiClient.setAuthTokens(token, refreshToken);
};

export const clearAuthTokens = () => {
  apiClient.clearAuthTokens();
};

export default api;
