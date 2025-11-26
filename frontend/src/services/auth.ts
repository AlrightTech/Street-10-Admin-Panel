import api from "./api";
import {
  ApiResponse,
  AuthResponse,
  LoginRequest,
  RegisterRequest,
  VerifyOTPRequest,
  RefreshTokenRequest,
  ForgotPasswordRequest,
  ResetPasswordRequest,
} from "./types";
import { setAuthTokens } from "./api";

/**
 * Authentication Service
 * Handles all authentication-related API calls
 */

export const authService = {
  /**
   * Register a new user
   */
  async register(data: RegisterRequest): Promise<AuthResponse> {
    const response = await api.post<ApiResponse<AuthResponse>>(
      "/auth/register",
      data
    );
    if (response.data.success && response.data.data) {
      const authData = response.data.data;
      // Store tokens
      setAuthTokens(authData.token, authData.refreshToken);
      // Store user data
      localStorage.setItem("user", JSON.stringify(authData.user));
      return authData;
    }
    throw new Error(response.data.message || "Registration failed");
  },

  /**
   * Login user
   */
  async login(data: LoginRequest): Promise<AuthResponse> {
    const response = await api.post<ApiResponse<AuthResponse>>(
      "/auth/login",
      data
    );
    if (response.data.success && response.data.data) {
      const authData = response.data.data;
      // Store tokens
      setAuthTokens(authData.token, authData.refreshToken);
      // Store user data
      localStorage.setItem("user", JSON.stringify(authData.user));
      return authData;
    }
    throw new Error(response.data.message || "Login failed");
  },

  /**
   * Verify OTP code
   */
  async verifyOTP(data: VerifyOTPRequest): Promise<AuthResponse> {
    const response = await api.post<ApiResponse<AuthResponse>>(
      "/auth/otp/verify",
      data
    );
    if (response.data.success && response.data.data) {
      const authData = response.data.data;
      // Store tokens
      setAuthTokens(authData.token, authData.refreshToken);
      // Store user data
      localStorage.setItem("user", JSON.stringify(authData.user));
      return authData;
    }
    throw new Error(response.data.message || "OTP verification failed");
  },

  /**
   * Refresh access token
   */
  async refreshToken(
    data: RefreshTokenRequest
  ): Promise<{ token: string; refreshToken: string }> {
    const response = await api.post<
      ApiResponse<{ token: string; refreshToken: string }>
    >("/auth/refresh", data);
    if (response.data.success && response.data.data) {
      const tokens = response.data.data;
      setAuthTokens(tokens.token, tokens.refreshToken);
      return tokens;
    }
    throw new Error(response.data.message || "Token refresh failed");
  },

  /**
   * Request password reset
   */
  async forgotPassword(
    data: ForgotPasswordRequest
  ): Promise<{ message: string }> {
    const response = await api.post<ApiResponse<{ message: string }>>(
      "/auth/forgot-password",
      data
    );
    if (response.data.success) {
      return { message: response.data.message || "Password reset code sent" };
    }
    throw new Error(
      response.data.message || "Failed to send password reset code"
    );
  },

  /**
   * Reset password with code
   */
  async resetPassword(
    data: ResetPasswordRequest
  ): Promise<{ message: string }> {
    const response = await api.post<ApiResponse<{ message: string }>>(
      "/auth/reset-password",
      data
    );
    if (response.data.success) {
      return {
        message: response.data.message || "Password reset successfully",
      };
    }
    throw new Error(response.data.message || "Password reset failed");
  },

  /**
   * Logout user (clears local storage)
   */
  logout(): void {
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
  },
};

export default authService;
