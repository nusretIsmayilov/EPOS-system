import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Users } from "lucide-react";

export default function Tables() {
  const tables = [
    { id: 1, number: "T1", capacity: 4, status: "Available", location: "Main Hall" },
    { id: 2, number: "T2", capacity: 2, status: "Occupied", location: "Main Hall" },
    { id: 3, number: "T3", capacity: 6, status: "Reserved", location: "Private Room" },
    { id: 4, number: "T4", capacity: 4, status: "Available", location: "Terrace" },
    { id: 5, number: "T5", capacity: 8, status: "Occupied", location: "VIP Section" },
    { id: 6, number: "T6", capacity: 2, status: "Available", location: "Main Hall" },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Available': return 'bg-green-100 text-green-800';
      case 'Occupied': return 'bg-red-100 text-red-800';
      case 'Reserved': return 'bg-yellow-100 text-yellow-800';
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
                <h1 className="text-2xl font-bold">Tables</h1>
                <p className="text-muted-foreground">Manage restaurant tables and seating</p>
              </div>
            </div>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add Table
            </Button>
          </PageHeader>

          <div className="flex-1 p-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {tables.map((table) => (
                <Card key={table.id} className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardHeader className="text-center">
                    <CardTitle className="text-2xl font-bold">{table.number}</CardTitle>
                    <p className="text-sm text-muted-foreground">{table.location}</p>
                  </CardHeader>
                  <CardContent className="text-center space-y-3">
                    <div className="flex items-center justify-center gap-2">
                      <Users className="w-4 h-4" />
                      <span>{table.capacity} seats</span>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(table.status)}`}>
                      {table.status}
                    </span>
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