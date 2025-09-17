import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CreditCard, DollarSign, Clock, CheckCircle, XCircle } from "lucide-react";

export default function Payments() {
  const payments = [
    { 
      id: "PAY-001", 
      orderId: "#ORD-001",
      customer: "John Doe",
      amount: "$45.97",
      method: "Credit Card",
      status: "Completed",
      date: "2024-01-15",
      time: "2:30 PM",
      reference: "CH_3OjQHY2eZvKYlo2C0rXhWc8Q"
    },
    { 
      id: "PAY-002", 
      orderId: "#ORD-002",
      customer: "Jane Smith",
      amount: "$78.45",
      method: "Cash",
      status: "Completed",
      date: "2024-01-15",
      time: "3:15 PM",
      reference: "CASH-001"
    },
    { 
      id: "PAY-003", 
      orderId: "#ORD-003",
      customer: "Mike Johnson",
      amount: "$32.50",
      method: "Digital Wallet",
      status: "Pending",
      date: "2024-01-15",
      time: "4:00 PM",
      reference: "DW_789456123"
    },
    { 
      id: "PAY-004", 
      orderId: "#ORD-004",  
      customer: "Sarah Wilson",
      amount: "$56.80",
      method: "Credit Card",
      status: "Failed",
      date: "2024-01-15",
      time: "4:30 PM",
      reference: "CH_FAILED_001"
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed': return 'bg-green-100 text-green-800';
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      case 'Failed': return 'bg-red-100 text-red-800';
      case 'Refunded': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Completed': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'Pending': return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'Failed': return <XCircle className="w-4 h-4 text-red-500" />;
      default: return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getMethodIcon = (method: string) => {
    switch (method) {
      case 'Credit Card': return <CreditCard className="w-4 h-4" />;
      case 'Cash': return <DollarSign className="w-4 h-4" />;
      case 'Digital Wallet': return <CreditCard className="w-4 h-4" />;
      default: return <CreditCard className="w-4 h-4" />;
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
                <h1 className="text-2xl font-bold">Payments</h1>
                <p className="text-muted-foreground">Track and manage payment transactions</p>
              </div>
            </div>
          </PageHeader>

          <div className="flex-1 p-6">
            <div className="grid gap-4">
              {payments.map((payment) => (
                <Card key={payment.id}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <div className="flex items-center gap-3">
                      {getStatusIcon(payment.status)}
                      <div>
                        <CardTitle className="text-lg font-medium">{payment.id}</CardTitle>
                        <p className="text-sm text-muted-foreground">Order: {payment.orderId} • {payment.customer}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="text-xl font-bold">{payment.amount}</div>
                        <div className="text-sm text-muted-foreground">{payment.date} {payment.time}</div>
                      </div>
                      <Badge className={getStatusColor(payment.status)}>
                        {payment.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-3 gap-4">
                      <div className="flex items-center gap-2">
                        {getMethodIcon(payment.method)}
                        <span className="text-sm font-medium">{payment.method}</span>
                      </div>
                      <div className="text-sm">
                        <span className="text-muted-foreground">Reference:</span>
                        <p className="font-mono text-xs">{payment.reference}</p>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">View Details</Button>
                        {payment.status === 'Completed' && (
                          <Button size="sm" variant="outline">Refund</Button>
                        )}
                        {payment.status === 'Failed' && (
                          <Button size="sm">Retry</Button>
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
    </SidebarProvider>
  );
}