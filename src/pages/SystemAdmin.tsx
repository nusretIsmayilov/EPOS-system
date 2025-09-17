import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Building2, Package, Users, Settings, LogOut, UserPlus, Mail, Crown } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface Restaurant {
  id: string;
  name: string;
  slug: string;
  description: string;
  address: string;
  phone: string;
  email: string;
  is_active: boolean;
  subscription_status: string;
  created_at: string;
  packages: Package[];
  admins: Profile[];
}

interface Profile {
  id: string;
  user_id: string;
  email: string;
  full_name: string;
  role: string;
  restaurant_id: string;
}

interface Package {
  id: string;
  name: string;
  description: string;
  features: any;
  price_monthly: number;
  price_yearly: number;
}

export default function SystemAdmin() {
  const { profile, isSystemSuperAdmin, signOut } = useAuth();
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [packages, setPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showAssignDialog, setShowAssignDialog] = useState(false);
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);

  // Form states
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    address: '',
    phone: '',
    email: '',
    admin_email: '',
    admin_name: '',
    selected_packages: [] as string[]
  });

  const [assignData, setAssignData] = useState({
    admin_email: '',
    admin_name: '',
    admin_password: ''
  });

  useEffect(() => {
    if (isSystemSuperAdmin) {
      fetchData();
    }
  }, [isSystemSuperAdmin]);

  const fetchData = async () => {
    try {
      // Fetch restaurants with packages and admins
      const { data: restaurantData, error: restError } = await supabase
        .from('restaurants')
        .select(`
          *,
          restaurant_packages(
            packages(*)
          )
        `);

      if (restError) throw restError;

      // Fetch admins for each restaurant
      const restaurantsWithAdmins = await Promise.all(
        (restaurantData || []).map(async (restaurant) => {
          const { data: admins } = await supabase
            .from('profiles')
            .select('*')
            .eq('restaurant_id', restaurant.id)
            .in('role', ['super_admin', 'admin', 'manager']);

          return {
            ...restaurant,
            packages: restaurant.restaurant_packages.map((rp: any) => rp.packages),
            admins: admins || []
          };
        })
      );

      // Fetch all packages
      const { data: packageData, error: pkgError } = await supabase
        .from('packages')
        .select('*')
        .eq('is_active', true);

      if (pkgError) throw pkgError;

      setRestaurants(restaurantsWithAdmins);
      setPackages(packageData || []);
    } catch (error: any) {
      toast.error('Failed to fetch data: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateRestaurant = async () => {
    try {
      // Create restaurant
      const { data: restaurant, error: restError } = await supabase
        .from('restaurants')
        .insert({
          name: formData.name,
          slug: formData.slug,
          description: formData.description,
          address: formData.address,
          phone: formData.phone,
          email: formData.email
        })
        .select()
        .single();

      if (restError) throw restError;

      // Assign packages
      if (formData.selected_packages.length > 0) {
        const packageInserts = formData.selected_packages.map(packageId => ({
          restaurant_id: restaurant.id,
          package_id: packageId
        }));

        const { error: pkgError } = await supabase
          .from('restaurant_packages')
          .insert(packageInserts);

        if (pkgError) throw pkgError;
      }

      toast.success('Restaurant created successfully');
      setShowCreateDialog(false);
      setFormData({
        name: '', slug: '', description: '', address: '', phone: '', email: '',
        admin_email: '', admin_name: '', selected_packages: []
      });
      fetchData();
    } catch (error: any) {
      toast.error('Failed to create restaurant: ' + error.message);
    }
  };

  const handleAssignAdmin = async () => {
    if (!selectedRestaurant) return;
    
    try {
      // First create the user account
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: assignData.admin_email,
        password: assignData.admin_password,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
          data: {
            full_name: assignData.admin_name,
            role: 'admin'
          }
        }
      });

      if (authError) throw authError;

      if (authData.user) {
        // Update the profile to assign restaurant
        const { error: profileError } = await supabase
          .from('profiles')
          .update({
            full_name: assignData.admin_name,
            role: 'admin',
            restaurant_id: selectedRestaurant.id
          })
          .eq('user_id', authData.user.id);

        if (profileError) throw profileError;

        toast.success('Admin assigned successfully');
        setShowAssignDialog(false);
        setAssignData({ admin_email: '', admin_name: '', admin_password: '' });
        fetchData();
      }
    } catch (error: any) {
      toast.error('Failed to assign admin: ' + error.message);
    }
  };

  const generateSlug = (name: string) => {
    return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  };

  if (!isSystemSuperAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-96">
          <CardContent className="pt-6">
            <div className="text-center">
              <h2 className="text-lg font-semibold text-destructive mb-2">Access Denied</h2>
              <p className="text-muted-foreground">You need system administrator privileges to access this page.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">System Administration</h1>
            <p className="text-muted-foreground">Manage restaurants, packages, and system settings</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="font-medium">{profile?.full_name || 'System Admin'}</div>
              <Badge variant="outline" className="text-xs">
                <Crown className="w-3 h-3 mr-1" />
                System Super Admin
              </Badge>
            </div>
            <Button variant="outline" onClick={signOut} className="flex items-center gap-2">
              <LogOut className="w-4 h-4" />
              Logout
            </Button>
          </div>
        </div>

        <Tabs defaultValue="restaurants" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="restaurants" className="flex items-center gap-2">
              <Building2 className="w-4 h-4" />
              Restaurants
            </TabsTrigger>
            <TabsTrigger value="packages" className="flex items-center gap-2">
              <Package className="w-4 h-4" />
              Packages
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              Settings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="restaurants" className="mt-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold">Restaurants ({restaurants.length})</h2>
              <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
                <DialogTrigger asChild>
                  <Button className="flex items-center gap-2">
                    <Plus className="w-4 h-4" />
                    Create Restaurant
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Create New Restaurant</DialogTitle>
                    <DialogDescription>
                      Set up a new restaurant with admin access and feature packages.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="name">Restaurant Name</Label>
                        <Input
                          id="name"
                          value={formData.name}
                          onChange={(e) => {
                            setFormData(prev => ({
                              ...prev,
                              name: e.target.value,
                              slug: generateSlug(e.target.value)
                            }));
                          }}
                          placeholder="Amazing Restaurant"
                        />
                      </div>
                      <div>
                        <Label htmlFor="slug">Slug (URL)</Label>
                        <Input
                          id="slug"
                          value={formData.slug}
                          onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                          placeholder="amazing-restaurant"
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        value={formData.description}
                        onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                        placeholder="Brief description of the restaurant"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="email">Contact Email</Label>
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                          placeholder="contact@restaurant.com"
                        />
                      </div>
                      <div>
                        <Label htmlFor="phone">Phone</Label>
                        <Input
                          id="phone"
                          value={formData.phone}
                          onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                          placeholder="+1 (555) 123-4567"
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="address">Address</Label>
                      <Textarea
                        id="address"
                        value={formData.address}
                        onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                        placeholder="Full restaurant address"
                      />
                    </div>
                    <div>
                      <Label>Feature Packages</Label>
                      <div className="grid grid-cols-2 gap-2 mt-2">
                        {packages.map(pkg => (
                          <div key={pkg.id} className="flex items-center space-x-2">
                            <Checkbox
                              id={pkg.id}
                              checked={formData.selected_packages.includes(pkg.id)}
                              onCheckedChange={(checked) => {
                                setFormData(prev => ({
                                  ...prev,
                                  selected_packages: checked
                                    ? [...prev.selected_packages, pkg.id]
                                    : prev.selected_packages.filter(id => id !== pkg.id)
                                }));
                              }}
                            />
                            <Label htmlFor={pkg.id} className="text-sm">
                              {pkg.name} - ${pkg.price_monthly}/mo
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>
                    <Button onClick={handleCreateRestaurant} className="w-full">
                      Create Restaurant
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {restaurants.map(restaurant => (
                <Card key={restaurant.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{restaurant.name}</CardTitle>
                        <CardDescription className="text-sm text-muted-foreground">
                          /{restaurant.slug}
                        </CardDescription>
                      </div>
                      <Badge variant={restaurant.is_active ? "default" : "secondary"}>
                        {restaurant.is_active ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                  </CardHeader>
                   <CardContent>
                    <div className="space-y-3">
                      {restaurant.description && (
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {restaurant.description}
                        </p>
                      )}
                      <div className="flex flex-wrap gap-1">
                        {restaurant.packages.map(pkg => (
                          <Badge key={pkg.id} variant="outline" className="text-xs">
                            {pkg.name}
                          </Badge>
                        ))}
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">Admins ({restaurant.admins.length})</span>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => {
                              setSelectedRestaurant(restaurant);
                              setShowAssignDialog(true);
                            }}
                            className="text-xs"
                          >
                            <UserPlus className="w-3 h-3 mr-1" />
                            Assign Admin
                          </Button>
                        </div>
                        {restaurant.admins.length > 0 ? (
                          <div className="space-y-1">
                            {restaurant.admins.slice(0, 2).map(admin => (
                              <div key={admin.id} className="flex items-center gap-2 text-xs">
                                <Mail className="w-3 h-3 text-muted-foreground" />
                                <span className="truncate">{admin.email}</span>
                                <Badge variant="secondary" className="text-xs">
                                  {admin.role}
                                </Badge>
                              </div>
                            ))}
                            {restaurant.admins.length > 2 && (
                              <div className="text-xs text-muted-foreground">
                                +{restaurant.admins.length - 2} more
                              </div>
                            )}
                          </div>
                        ) : (
                          <p className="text-xs text-muted-foreground">No admins assigned</p>
                        )}
                      </div>

                      <div className="text-xs text-muted-foreground pt-2 border-t">
                        Created: {new Date(restaurant.created_at).toLocaleDateString()}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="packages" className="mt-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold">Feature Packages ({packages.length})</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {packages.map(pkg => (
                <Card key={pkg.id} className="relative">
                  <CardHeader>
                    <CardTitle className="text-lg">{pkg.name}</CardTitle>
                    <CardDescription>{pkg.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="text-2xl font-bold">
                        ${pkg.price_monthly}<span className="text-sm font-normal">/mo</span>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        ${pkg.price_yearly}/year
                      </div>
                      <div className="space-y-1">
                        {Object.entries(pkg.features).map(([feature, enabled]) => (
                          enabled && (
                            <div key={feature} className="flex items-center text-sm">
                              <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                              {feature.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                            </div>
                          )
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="settings" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>System Settings</CardTitle>
                <CardDescription>Configure global system settings and preferences</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-sm text-muted-foreground">
                    System settings will be available in a future update.
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Assign Admin Dialog */}
        <Dialog open={showAssignDialog} onOpenChange={setShowAssignDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Assign Admin to {selectedRestaurant?.name}</DialogTitle>
              <DialogDescription>
                Create a new admin account and assign them to this restaurant.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="admin_name">Admin Full Name</Label>
                <Input
                  id="admin_name"
                  value={assignData.admin_name}
                  onChange={(e) => setAssignData(prev => ({ ...prev, admin_name: e.target.value }))}
                  placeholder="John Smith"
                />
              </div>
              <div>
                <Label htmlFor="admin_email">Admin Email</Label>
                <Input
                  id="admin_email"
                  type="email"
                  value={assignData.admin_email}
                  onChange={(e) => setAssignData(prev => ({ ...prev, admin_email: e.target.value }))}
                  placeholder="admin@restaurant.com"
                />
              </div>
              <div>
                <Label htmlFor="admin_password">Temporary Password</Label>
                <Input
                  id="admin_password"
                  type="password"
                  value={assignData.admin_password}
                  onChange={(e) => setAssignData(prev => ({ ...prev, admin_password: e.target.value }))}
                  placeholder="Minimum 6 characters"
                />
              </div>
              <Button onClick={handleAssignAdmin} className="w-full">
                Create Admin Account
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}