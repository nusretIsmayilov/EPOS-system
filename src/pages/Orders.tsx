import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Eye, Clock } from "lucide-react";

export default function Orders() {
  const orders = [
    { 
      id: "#ORD-001", 
      customer: "John Doe", 
      table: "T2", 
      items: 3, 
      total: "$45.97", 
      status: "Preparing",
      time: "10 mins ago"
    },
    { 
      id: "#ORD-002", 
      customer: "Jane Smith", 
      table: "T5", 
      items: 5, 
      total: "$78.45", 
      status: "Ready",
      time: "5 mins ago"
    },
    { 
      id: "#ORD-003", 
      customer: "Mike Johnson", 
      table: "Delivery", 
      items: 2, 
      total: "$32.50", 
      status: "Delivered",
      time: "30 mins ago"
    },
    { 
      id: "#ORD-004", 
      customer: "Sarah Wilson", 
      table: "T1", 
      items: 4, 
      total: "$56.80", 
      status: "Pending",
      time: "2 mins ago"
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      case 'Preparing': return 'bg-blue-100 text-blue-800';
      case 'Ready': return 'bg-green-100 text-green-800';
      case 'Delivered': return 'bg-gray-100 text-gray-800';
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
                <h1 className="text-2xl font-bold">Orders</h1>
                <p className="text-muted-foreground">Track and manage customer orders</p>
              </div>
            </div>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              New Order
            </Button>
          </PageHeader>

          <div className="flex-1 p-6">
            <div className="grid gap-4">
              {orders.map((order) => (
                <Card key={order.id}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <div>
                      <CardTitle className="text-lg font-medium">{order.id}</CardTitle>
                      <p className="text-sm text-muted-foreground">{order.customer} • {order.table}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <Badge className={getStatusColor(order.status)}>
                        {order.status}
                      </Badge>
                      <Button variant="ghost" size="sm">
                        <Eye className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <span className="text-sm">{order.items} items</span>
                        <span className="text-lg font-bold">{order.total}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="w-4 h-4" />
                        {order.time}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}