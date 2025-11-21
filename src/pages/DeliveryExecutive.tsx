import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Phone, MapPin, Truck, Clock, User } from "lucide-react";
import { AIChatbot } from "@/components/ai/AIChatbot";

export default function DeliveryExecutive() {
  const executives = [
    { 
      id: 1, 
      name: "Alex Rodriguez", 
      phone: "+1 (555) 111-1111",
      vehicle: "Motorcycle", 
      license: "ABC123",
      status: "Available",
      currentOrders: 0,
      totalDeliveries: 145,
      rating: 4.8,
      location: "Downtown Area"
    },
    { 
      id: 2, 
      name: "Maria Santos", 
      phone: "+1 (555) 222-2222",
      vehicle: "Car", 
      license: "XYZ789",
      status: "On Delivery",
      currentOrders: 2,
      totalDeliveries: 203,
      rating: 4.9,
      location: "North District"
    },
    { 
      id: 3, 
      name: "James Wilson", 
      phone: "+1 (555) 333-3333",
      vehicle: "Bicycle", 
      license: "BIK456",
      status: "Off Duty",
      currentOrders: 0,
      totalDeliveries: 87,
      rating: 4.6,
      location: "City Center"
    },
    { 
      id: 4, 
      name: "Lisa Chen", 
      phone: "+1 (555) 444-4444",
      vehicle: "Scooter", 
      license: "SCT789",
      status: "Available",
      currentOrders: 1,
      totalDeliveries: 176,
      rating: 4.7,
      location: "East Side"
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Available': return 'bg-green-100 text-green-800';
      case 'On Delivery': return 'bg-blue-100 text-blue-800';
      case 'Off Duty': return 'bg-gray-100 text-gray-800';
      case 'Break': return 'bg-yellow-100 text-yellow-800';
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
                <h1 className="text-2xl font-bold">Delivery Executive</h1>
                <p className="text-muted-foreground">Manage delivery personnel</p>
              </div>
            </div>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add Executive
            </Button>
          </PageHeader>

          <div className="flex-1 p-6">
            <div className="grid gap-6 md:grid-cols-2">
              {executives.map((executive) => (
                <Card key={executive.id}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                        <User className="w-5 h-5" />
                      </div>
                      <div>
                        <CardTitle className="text-lg font-medium">{executive.name}</CardTitle>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Phone className="w-3 h-3" />
                          {executive.phone}
                        </div>
                      </div>
                    </div>
                    <Badge className={getStatusColor(executive.status)}>
                      {executive.status}
                    </Badge>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <Truck className="w-4 h-4 text-muted-foreground" />
                        <span>{executive.vehicle}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">License:</span>
                        <p className="font-medium">{executive.license}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-muted-foreground" />
                        <span>{executive.location}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Rating:</span>
                        <p className="font-medium">⭐ {executive.rating}</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Current Orders:</span>
                        <p className="font-bold text-lg">{executive.currentOrders}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Total Deliveries:</span>
                        <p className="font-bold text-lg">{executive.totalDeliveries}</p>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">View Details</Button>
                      <Button size="sm" variant="outline">Track</Button>
                      {executive.status === 'Available' && (
                        <Button size="sm">Assign Order</Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </main>
      </div>
      <AIChatbot section="delivery" context="Delivery executive page" />
    </SidebarProvider>
  );
}