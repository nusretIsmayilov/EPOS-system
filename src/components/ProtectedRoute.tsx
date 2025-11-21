// ProtectedRoute.tsx
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { usePermissions } from "@/hooks/usePermissions";

export function ProtectedRoute({ children, requireStaff, requireAdmin, requiredPermissions }: any) {
  const { profile, loading: profileLoading } = useAuth();
  const { hasAnyPermission, loading: permLoading } = usePermissions();

  if (profileLoading || permLoading) {
    return <div></div>;
  }

  if (!profile) {
    return <Navigate to="/auth" />;
  }

  // ROLE-BAZLI KONTROL
  if (requireAdmin && profile.role !== "admin" && profile.role !== "super_admin") {
    return <Navigate to="/" />;
  }

  if (requireStaff && !["admin", "super_admin", "manager", "owner", "front_staff", "kitchen_staff"].includes(profile.role)) {
    return <Navigate to="/" />;
  }

  // PERMISSION-BAZLI KONTROL
  if (requiredPermissions && !hasAnyPermission(requiredPermissions)) {
    return <Navigate to="/" />;
  }

  return children;
}
