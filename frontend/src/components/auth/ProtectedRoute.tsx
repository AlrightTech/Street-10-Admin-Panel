import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { useRole } from "../../contexts/RoleContext";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: "user" | "vendor" | "sub-admin" | "super-admin";
  allowedRoles?: Array<"user" | "vendor" | "sub-admin" | "super-admin">;
}

/**
 * Protected Route Component
 * Wraps routes that require authentication and optionally specific roles
 */
export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredRole,
  allowedRoles,
}) => {
  const { isAuthenticated, isLoading } = useAuth();
  const { role } = useRole();

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Check role requirements
  if (requiredRole && role !== requiredRole) {
    return <Navigate to="/dashboard" replace />;
  }

  if (allowedRoles && role && !allowedRoles.includes(role as any)) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
