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
  const [userPermissions, setUserPermissions] = useState<string[] | null>(null);
  const [loading, setLoading] = useState(true);
  const { profile } = useAuth();

  useEffect(() => {
    if (!profile) {
      // Profil henüz gelmedi → loading true kalsın → hiçbir şey render etme
      setUserPermissions(null);
      setLoading(true);
      return;
    }

    fetchUserPermissions();
  }, [profile]);

  const fetchUserPermissions = async () => {
    try {
      setLoading(true);

      const { data, error } = await supabase
        .from('role_permissions')
        .select('permission')
        .eq('role', profile?.role);

      if (error) throw error;

      const perms = data?.map(p => p.permission) || [];

      setUserPermissions(perms);
    } catch (error) {
      console.error('Error fetching user permissions:', error);
      setUserPermissions([]); // fallback
    } finally {
      setLoading(false);
    }
  };

  const hasPermission = (permission: string): boolean => {
    if (!userPermissions) return false;
    return userPermissions.includes(permission);
  };

  const hasAnyPermission = (permissionList: string[]): boolean => {
    if (!userPermissions) return false;
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
      'settings': ['view_settings'],
    };

    const required = pagePermissions[page];
    if (!required) return true;

    return hasAnyPermission(required);
  };

  return {
    permissions,
    userPermissions: userPermissions || [],
    loading,
    hasPermission,
    hasAnyPermission,
    canViewPage,
    fetchAllPermissions,
    fetchUserPermissions,
  };
}

async function fetchAllPermissions() {
  try {
    const { data } = await supabase
      .from('role_permissions')
      .select('*')
      .order('role', { ascending: true });

    return data || [];
  } catch (error) {
    console.error('Error fetching permissions:', error);
    return [];
  }
}
