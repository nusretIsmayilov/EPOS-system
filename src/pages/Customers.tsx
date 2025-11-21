import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Phone, Mail, MapPin, Star } from "lucide-react";
import { AIChatbot } from "@/components/ai/AIChatbot";

export default function Customers() {
  const customers = [
    { 
      id: 1, 
      name: "John Doe", 
      email: "john@example.com", 
      phone: "+1 (555) 123-4567",
      address: "123 Main St, City",
      orders: 12,
      totalSpent: "$456.78",
      lastVisit: "2024-01-10",
      status: "VIP"
    },
    { 
      id: 2, 
      name: "Jane Smith", 
      email: "jane@example.com", 
      phone: "+1 (555) 987-6543",
      address: "456 Oak Ave, City",
      orders: 8,
      totalSpent: "$234.56",
      lastVisit: "2024-01-12",
      status: "Regular"
    },
    { 
      id: 3, 
      name: "Mike Johnson", 
      email: "mike@example.com", 
      phone: "+1 (555) 456-7890",
      address: "789 Pine St, City",
      orders: 3,
      totalSpent: "$89.45",
      lastVisit: "2024-01-14",
      status: "New"
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'VIP': return 'bg-purple-100 text-purple-800';
      case 'Regular': return 'bg-blue-100 text-blue-800';
      case 'New': return 'bg-green-100 text-green-800';
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
                <h1 className="text-2xl font-bold">Customers</h1>
                <p className="text-muted-foreground">Manage customer information</p>
              </div>
            </div>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add Customer
            </Button>
          </PageHeader>

          <div className="flex-1 p-6">
            <div className="grid gap-6">
              {customers.map((customer) => (
                <Card key={customer.id}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <div>
                      <CardTitle className="text-xl font-semibold">{customer.name}</CardTitle>
                      <Badge className={getStatusColor(customer.status)}>
                        {customer.status}
                      </Badge>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold">{customer.totalSpent}</div>
                      <div className="text-sm text-muted-foreground">{customer.orders} orders</div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm">{customer.email}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm">{customer.phone}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm">{customer.address}</span>
                      </div>
                      <div className="text-sm">
                        <span className="text-muted-foreground">Last visit:</span> {customer.lastVisit}
                      </div>
                    </div>
                    <div className="flex gap-2 mt-4">
                      <Button size="sm" variant="outline">View Orders</Button>
                      <Button size="sm" variant="outline">Edit</Button>
                      <Button size="sm" variant="outline">Contact</Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </main>
      </div>
      <AIChatbot section="customers" context="Customers page" />
    </SidebarProvider>
  );
}