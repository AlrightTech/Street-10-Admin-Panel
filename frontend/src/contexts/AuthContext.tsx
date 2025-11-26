import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import {
  User,
  LoginRequest,
  RegisterRequest,
  VerifyOTPRequest,
} from "../services/types";
import authService from "../services/auth";
import { clearAuthTokens } from "../services/api";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (data: LoginRequest) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  verifyOTP: (data: VerifyOTPRequest) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<User>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load user from localStorage on mount
  useEffect(() => {
    const loadUser = () => {
      try {
        const storedUser = localStorage.getItem("user");
        const token = localStorage.getItem("token");

        if (storedUser && token) {
          setUser(JSON.parse(storedUser));
          // Optionally verify token by fetching user profile
          refreshUser().catch(() => {
            // Token invalid, clear storage
            clearAuthTokens();
            setUser(null);
          });
        }
      } catch (error) {
        console.error("Error loading user:", error);
        clearAuthTokens();
      } finally {
        setIsLoading(false);
      }
    };

    loadUser();
  }, []);

  const refreshUser = async () => {
    try {
      const usersService = (await import("../services/users")).default;
      const currentUser = await usersService.getCurrentUser();
      setUser(currentUser);
      return currentUser;
    } catch (error) {
      console.error("Error refreshing user:", error);
      throw error;
    }
  };

  const login = async (data: LoginRequest) => {
    try {
      const authData = await authService.login(data);
      setUser(authData.user);
    } catch (error: any) {
      throw new Error(error.message || "Login failed");
    }
  };

  const register = async (data: RegisterRequest) => {
    try {
      const authData = await authService.register(data);
      setUser(authData.user);
    } catch (error: any) {
      throw new Error(error.message || "Registration failed");
    }
  };

  const verifyOTP = async (data: VerifyOTPRequest) => {
    try {
      const authData = await authService.verifyOTP(data);
      setUser(authData.user);
    } catch (error: any) {
      throw new Error(error.message || "OTP verification failed");
    }
  };

  const logout = () => {
    authService.logout();
    clearAuthTokens();
    setUser(null);
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    register,
    verifyOTP,
    logout,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
