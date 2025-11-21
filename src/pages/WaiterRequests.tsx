import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, CheckCircle, AlertCircle } from "lucide-react";
import { AIChatbot } from "@/components/ai/AIChatbot";

export default function WaiterRequests() {
  const requests = [
    { 
      id: 1, 
      table: "T3", 
      type: "Service", 
      request: "Water refill", 
      priority: "Low", 
      time: "2 mins ago",
      status: "Pending"
    },
    { 
      id: 2, 
      table: "T7", 
      type: "Bill", 
      request: "Check please", 
      priority: "High", 
      time: "5 mins ago",
      status: "In Progress"
    },
    { 
      id: 3, 
      table: "T1", 
      type: "Service", 
      request: "Extra napkins", 
      priority: "Low", 
      time: "1 min ago",
      status: "Pending"
    },
    { 
      id: 4, 
      table: "T5", 
      type: "Issue", 
      request: "Food too cold", 
      priority: "High", 
      time: "8 mins ago",
      status: "Resolved"
    },
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return 'bg-red-100 text-red-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'Low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Pending': return <AlertCircle className="w-4 h-4 text-yellow-500" />;
      case 'In Progress': return <Clock className="w-4 h-4 text-blue-500" />;
      case 'Resolved': return <CheckCircle className="w-4 h-4 text-green-500" />;
      default: return <Clock className="w-4 h-4 text-gray-500" />;
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
                <h1 className="text-2xl font-bold">Waiter Requests</h1>
                <p className="text-muted-foreground">Manage customer service requests</p>
              </div>
            </div>
          </PageHeader>

          <div className="flex-1 p-6">
            <div className="grid gap-4">
              {requests.map((request) => (
                <Card key={request.id}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <div className="flex items-center gap-3">
                      {getStatusIcon(request.status)}
                      <div>
                        <CardTitle className="text-lg font-medium">Table {request.table} - {request.type}</CardTitle>
                        <p className="text-sm text-muted-foreground">{request.request}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <Badge className={getPriorityColor(request.priority)}>
                        {request.priority}
                      </Badge>
                      <span className="text-sm text-muted-foreground">{request.time}</span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Status: {request.status}</span>
                      <div className="flex gap-2">
                        {request.status === 'Pending' && (
                          <>
                            <Button size="sm">Accept</Button>
                            <Button size="sm" variant="outline">Assign</Button>
                          </>
                        )}
                        {request.status === 'In Progress' && (
                          <Button size="sm" variant="outline">Mark Complete</Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </main>
      </div>
      <AIChatbot section="waiter-requests" context="Waiter request page" />
    </SidebarProvider>
  );
}