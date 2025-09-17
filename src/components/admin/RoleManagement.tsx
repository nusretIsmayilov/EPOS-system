import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Users, UserPlus, Shield, Edit2 } from 'lucide-react';

interface StaffMember {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  position: string;
  profile_id: string;
  profile: {
    role: string;
  };
}

const roleDescriptions = {
  owner: 'Full access to all features including analytics and business settings',
  admin: 'Manage all restaurant operations and staff',
  manager: 'Oversee daily operations and manage some staff',
  front_staff: 'Handle tables, POS, reservations, and customers',
  kitchen_staff: 'Manage orders, menu items, and inventory',
  cashier: 'Process payments and handle transactions',
  staff: 'Basic staff access'
};

const roleColors = {
  owner: 'bg-purple-100 text-purple-800',
  admin: 'bg-red-100 text-red-800',
  manager: 'bg-blue-100 text-blue-800',
  front_staff: 'bg-green-100 text-green-800',
  kitchen_staff: 'bg-orange-100 text-orange-800',
  cashier: 'bg-yellow-100 text-yellow-800',
  staff: 'bg-gray-100 text-gray-800'
};

export function RoleManagement() {
  const [staffMembers, setStaffMembers] = useState<StaffMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState<StaffMember | null>(null);
  const [newRole, setNewRole] = useState('');
  const { toast } = useToast();
  const { profile } = useAuth();

  useEffect(() => {
    fetchStaffMembers();
  }, []);

  const fetchStaffMembers = async () => {
    try {
      setLoading(true);
      
      // Fetch staff members with their profile roles
      const { data, error } = await supabase
        .from('staff')
        .select(`
          id,
          first_name,
          last_name,
          email,
          position,
          profile_id,
          profile:profile_id (
            role
          )
        `)
        .eq('restaurant_id', profile?.restaurant_id);

      if (error) throw error;

      setStaffMembers(data || []);
    } catch (error) {
      console.error('Error fetching staff members:', error);
      toast({
        title: "Error",
        description: "Failed to fetch staff members",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateStaffRole = async (staffMember: StaffMember, newRole: string) => {
    try {
      if (!staffMember.profile_id) {
        throw new Error('Staff member has no associated profile');
      }

      const { error } = await supabase
        .from('profiles')
        .update({ role: newRole as any })
        .eq('id', staffMember.profile_id);

      if (error) throw error;

      toast({
        title: "Success",
        description: `${staffMember.first_name} ${staffMember.last_name}'s role updated to ${newRole}`,
      });

      // Refresh the staff list
      await fetchStaffMembers();
      setDialogOpen(false);
      setSelectedStaff(null);
      setNewRole('');
    } catch (error) {
      console.error('Error updating staff role:', error);
      toast({
        title: "Error",
        description: "Failed to update staff role",
        variant: "destructive",
      });
    }
  };

  const openRoleDialog = (staff: StaffMember) => {
    setSelectedStaff(staff);
    setNewRole(staff.profile?.role || '');
    setDialogOpen(true);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <Shield className="w-6 h-6" />
          <h2 className="text-2xl font-bold">Role Management</h2>
        </div>
        <Card>
          <CardContent className="p-6">
            <div className="text-center">Loading staff members...</div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Shield className="w-6 h-6" />
          <h2 className="text-2xl font-bold">Role Management</h2>
        </div>
      </div>

      {/* Role Descriptions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Object.entries(roleDescriptions).map(([role, description]) => (
          <Card key={role}>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm capitalize flex items-center gap-2">
                <Badge className={roleColors[role as keyof typeof roleColors]}>
                  {role.replace('_', ' ')}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <CardDescription className="text-xs">
                {description}
              </CardDescription>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Staff Members Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Staff Members & Roles
          </CardTitle>
          <CardDescription>
            Manage staff roles and permissions
          </CardDescription>
        </CardHeader>
        <CardContent>
          {staffMembers.length === 0 ? (
            <div className="text-center py-6 text-muted-foreground">
              No staff members found
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Position</TableHead>
                  <TableHead>Current Role</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {staffMembers.map((staff) => (
                  <TableRow key={staff.id}>
                    <TableCell className="font-medium">
                      {staff.first_name} {staff.last_name}
                    </TableCell>
                    <TableCell>{staff.email}</TableCell>
                    <TableCell>{staff.position}</TableCell>
                    <TableCell>
                      <Badge className={roleColors[staff.profile?.role as keyof typeof roleColors] || 'bg-gray-100 text-gray-800'}>
                        {staff.profile?.role?.replace('_', ' ') || 'No Role'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openRoleDialog(staff)}
                        className="flex items-center gap-2"
                      >
                        <Edit2 className="w-4 h-4" />
                        Change Role
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Role Change Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Change Staff Role</DialogTitle>
            <DialogDescription>
              Update the role for {selectedStaff?.first_name} {selectedStaff?.last_name}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="role">New Role</Label>
              <Select value={newRole} onValueChange={setNewRole}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="owner">Owner</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="manager">Manager</SelectItem>
                  <SelectItem value="front_staff">Front Staff</SelectItem>
                  <SelectItem value="kitchen_staff">Kitchen Staff</SelectItem>
                  <SelectItem value="cashier">Cashier</SelectItem>
                  <SelectItem value="staff">Staff</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {newRole && (
              <div className="p-3 bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground">
                  <strong>Role Description:</strong> {roleDescriptions[newRole as keyof typeof roleDescriptions]}
                </p>
              </div>
            )}

            <div className="flex gap-2 justify-end">
              <Button
                variant="outline"
                onClick={() => setDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={() => selectedStaff && updateStaffRole(selectedStaff, newRole)}
                disabled={!newRole || newRole === selectedStaff?.profile?.role}
              >
                Update Role
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}