import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RoleManagement } from "@/components/admin/RoleManagement";
import { PermissionGate } from "@/components/PermissionGate";
import { Plus, Phone, Mail, Clock, User, Shield } from "lucide-react";

export default function Staff() {
  const staff = [
    { 
      id: 1, 
      name: "Alice Cooper", 
      role: "Manager", 
      email: "alice@restaurant.com", 
      phone: "+1 (555) 111-2222",
      shift: "Morning",
      status: "On Duty",
      hourlyRate: "$18/hr"
    },
    { 
      id: 2, 
      name: "Bob Wilson", 
      role: "Chef", 
      email: "bob@restaurant.com", 
      phone: "+1 (555) 333-4444",
      shift: "Evening",
      status: "On Duty",
      hourlyRate: "$22/hr"
    },
    { 
      id: 3, 
      name: "Carol Martinez", 
      role: "Waiter", 
      email: "carol@restaurant.com", 
      phone: "+1 (555) 555-6666",
      shift: "Afternoon",
      status: "Off Duty",
      hourlyRate: "$15/hr"
    },
    { 
      id: 4, 
      name: "David Kim", 
      role: "Cashier", 
      email: "david@restaurant.com", 
      phone: "+1 (555) 777-8888",
      shift: "Morning",
      status: "On Break",
      hourlyRate: "$16/hr"
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'On Duty': return 'bg-green-100 text-green-800';
      case 'Off Duty': return 'bg-gray-100 text-gray-800';
      case 'On Break': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <main className="flex-1 flex flex-col">
          <PageHeader>
            <div className="flex items-center gap-4">
              <SidebarTrigger />
              <div>
                <h1 className="text-2xl font-bold">Staff</h1>
                <p className="text-muted-foreground">Manage restaurant staff</p>
              </div>
            </div>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add Staff
            </Button>
          </PageHeader>

          <div className="flex-1 p-6">
            <Tabs defaultValue="staff" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="staff">Staff Management</TabsTrigger>
                <TabsTrigger value="roles">
                  <PermissionGate permissions={['manage_staff']}>
                    <div className="flex items-center gap-2">
                      <Shield className="w-4 h-4" />
                      Role Management
                    </div>
                  </PermissionGate>
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="staff" className="mt-6">
                <div className="grid gap-6 md:grid-cols-2">
                  {staff.map((member) => (
                    <Card key={member.id}>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                            <User className="w-5 h-5" />
                          </div>
                          <div>
                            <CardTitle className="text-lg font-medium">{member.name}</CardTitle>
                            <p className="text-sm text-muted-foreground">{member.role}</p>
                          </div>
                        </div>
                        <Badge className={getStatusColor(member.status)}>
                          {member.status}
                        </Badge>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="flex items-center gap-2">
                            <Mail className="w-4 h-4 text-muted-foreground" />
                            <span className="text-sm">{member.email}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Phone className="w-4 h-4 text-muted-foreground" />
                            <span className="text-sm">{member.phone}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-muted-foreground" />
                            <span className="text-sm">{member.shift} Shift</span>
                          </div>
                          <div className="text-sm">
                            <span className="font-medium">{member.hourlyRate}</span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">Edit</Button>
                          <Button size="sm" variant="outline">Schedule</Button>
                          <Button size="sm" variant="outline">Payroll</Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="roles" className="mt-6">
                <PermissionGate permissions={['manage_staff']}>
                  <RoleManagement />
                </PermissionGate>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}