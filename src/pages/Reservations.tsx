import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Calendar, Users, Phone } from "lucide-react";

export default function Reservations() {
  const reservations = [
    { 
      id: 1, 
      customer: "John Smith", 
      phone: "+1 (555) 123-4567",
      date: "2024-01-15", 
      time: "7:00 PM", 
      guests: 4, 
      table: "T5",
      status: "Confirmed"
    },
    { 
      id: 2, 
      customer: "Emily Johnson", 
      phone: "+1 (555) 987-6543",
      date: "2024-01-15", 
      time: "8:30 PM", 
      guests: 2, 
      table: "T3",
      status: "Pending"
    },
    { 
      id: 3, 
      customer: "Michael Brown", 
      phone: "+1 (555) 456-7890",
      date: "2024-01-16", 
      time: "6:15 PM", 
      guests: 6, 
      table: "T8",
      status: "Confirmed"
    },
    { 
      id: 4, 
      customer: "Sarah Davis", 
      phone: "+1 (555) 321-0987",
      date: "2024-01-16", 
      time: "7:45 PM", 
      guests: 3, 
      table: "T2",
      status: "Seated"
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Confirmed': return 'bg-green-100 text-green-800';
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      case 'Seated': return 'bg-blue-100 text-blue-800';
      case 'Cancelled': return 'bg-red-100 text-red-800';
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
                <h1 className="text-2xl font-bold">Reservations</h1>
                <p className="text-muted-foreground">Manage table reservations</p>
              </div>
            </div>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              New Reservation
            </Button>
          </PageHeader>

          <div className="flex-1 p-6">
            <div className="grid gap-4">
              {reservations.map((reservation) => (
                <Card key={reservation.id}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <div>
                      <CardTitle className="text-lg font-medium">{reservation.customer}</CardTitle>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Phone className="w-4 h-4" />
                        {reservation.phone}
                      </div>
                    </div>
                    <Badge className={getStatusColor(reservation.status)}>
                      {reservation.status}
                    </Badge>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-4 gap-4">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm">{reservation.date}</span>
                      </div>
                      <div className="text-sm">
                        <span className="font-medium">Time:</span> {reservation.time}
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm">{reservation.guests} guests</span>
                      </div>
                      <div className="text-sm">
                        <span className="font-medium">Table:</span> {reservation.table}
                      </div>
                    </div>
                    <div className="flex gap-2 mt-4">
                      <Button size="sm" variant="outline">Edit</Button>
                      <Button size="sm" variant="outline">Cancel</Button>
                      {reservation.status === 'Confirmed' && (
                        <Button size="sm">Seat Now</Button>
                      )}
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