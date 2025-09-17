import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface Permission {
  id: string;
  role: string;
  permission: string;
  created_at: string;
}

export function usePermissions() {
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [userPermissions, setUserPermissions] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const { profile } = useAuth();

  useEffect(() => {
    if (profile) {
      fetchUserPermissions();
    }
  }, [profile]);

  const fetchUserPermissions = async () => {
    if (!profile) return;

    try {
      setLoading(true);
      
      // Fetch user's permissions based on their role
      const { data, error } = await supabase
        .from('role_permissions')
        .select('permission')
        .eq('role', profile.role);

      if (error) throw error;

      const userPermissionsList = data?.map(p => p.permission) || [];
      setUserPermissions(userPermissionsList);
    } catch (error) {
      console.error('Error fetching user permissions:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAllPermissions = async () => {
    try {
      const { data, error } = await supabase
        .from('role_permissions')
        .select('*')
        .order('role', { ascending: true });

      if (error) throw error;

      setPermissions(data || []);
      return data;
    } catch (error) {
      console.error('Error fetching permissions:', error);
      return [];
    }
  };

  const hasPermission = (permission: string): boolean => {
    return userPermissions.includes(permission);
  };

  const hasAnyPermission = (permissionList: string[]): boolean => {
    return permissionList.some(permission => userPermissions.includes(permission));
  };

  const canViewPage = (page: string): boolean => {
    const pagePermissions: Record<string, string[]> = {
      'dashboard': ['view_reports', 'view_analytics'],
      'tables': ['view_tables'],
      'pos': ['view_pos'],
      'reservations': ['view_reservations'],
      'orders': ['view_orders'],
      'menu-items': ['view_menu_items'],
      'inventory': ['view_inventory'],
      'customers': ['view_customers'],
      'staff': ['view_staff'],
      'reports': ['view_reports'],
      'settings': ['view_settings']
    };

    const requiredPermissions = pagePermissions[page];
    if (!requiredPermissions) return true; // Allow access if no specific permissions defined
    
    return hasAnyPermission(requiredPermissions);
  };

  return {
    permissions,
    userPermissions,
    loading,
    hasPermission,
    hasAnyPermission,
    canViewPage,
    fetchAllPermissions,
    fetchUserPermissions
  };
}