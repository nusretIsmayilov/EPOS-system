// ProtectedRoute.tsx
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { usePermissions } from "@/hooks/usePermissions";

export function ProtectedRoute({
  children,
  requireStaff,
  requireAdmin,
  requiredPermissions,
}: any) {
  const { profile, loading: profileLoading } = useAuth();
  const { hasAnyPermission, loading: permLoading } = usePermissions();

  // AUTH & PERMISSION LOADING
  if (profileLoading || permLoading) {
    return <div></div>;
  }

  // USER NOT LOGGED IN
  if (!profile) {
    return <Navigate to="/auth" replace />;
  }

  // ROLE-BASED ACCESS CONTROL
  if (requireAdmin && !["admin", "super_admin"].includes(profile.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  if (
    requireStaff &&
    ![
      "admin",
      "super_admin",
      "manager",
      "owner",
      "front_staff",
      "kitchen_staff",
      "cheff",
      "waiter",
      "cashier",
    ].includes(profile.role)
  ) {
    return <Navigate to="/unauthorized" replace />;
  }

  // PERMISSION-BASED ACCESS CONTROL
  if (requiredPermissions && !hasAnyPermission(requiredPermissions)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
}
