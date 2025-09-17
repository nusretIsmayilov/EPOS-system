import React from 'react';
import { usePermissions } from '@/hooks/usePermissions';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Shield } from 'lucide-react';

interface PermissionGateProps {
  children: React.ReactNode;
  permissions?: string[];
  roles?: string[];
  fallback?: React.ReactNode;
}

export function PermissionGate({ 
  children, 
  permissions = [], 
  roles = [], 
  fallback 
}: PermissionGateProps) {
  const { hasPermission, hasAnyPermission, loading } = usePermissions();

  if (loading) {
    return (
      <div className="flex items-center justify-center p-4">
        <div className="text-muted-foreground">Checking permissions...</div>
      </div>
    );
  }

  // Check if user has any of the required permissions
  const hasRequiredPermissions = permissions.length === 0 || hasAnyPermission(permissions);

  if (!hasRequiredPermissions) {
    if (fallback) {
      return <>{fallback}</>;
    }

    return (
      <Alert className="m-4">
        <Shield className="h-4 w-4" />
        <AlertDescription>
          You don't have permission to access this feature. Please contact your administrator.
        </AlertDescription>
      </Alert>
    );
  }

  return <>{children}</>;
}