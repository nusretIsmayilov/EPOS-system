import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Order {
  id: string;
  customer: {
    name: string;
    initials: string;
    avatarColor: string;
  };
  time: string;
  status: 'Order Served' | 'Order Placed' | 'Order Preparing';
  orderType: string;
}

const orders: Order[] = [
  {
    id: "1",
    customer: { name: "Doris Kimberly", initials: "T3", avatarColor: "avatar-1" },
    time: "11:30 AM • £94.38",
    status: "Order Served",
    orderType: "Just Dine"
  },
  {
    id: "2", 
    customer: { name: "Christine Palmer", initials: "T1", avatarColor: "avatar-2" },
    time: "11:30 AM • £94.38",
    status: "Order Placed", 
    orderType: "Just Dine"
  },
  {
    id: "3",
    customer: { name: "NA", initials: "NA", avatarColor: "avatar-3" },
    time: "11:30 AM • £94.38", 
    status: "Order Preparing",
    orderType: "Just Dine"
  }
];

export const OrdersList = () => {
  const getStatusBadgeVariant = (status: Order['status']) => {
    switch (status) {
      case 'Order Served':
        return 'success';
      case 'Order Placed':
        return 'warning';
      case 'Order Preparing':
        return 'destructive';
      default:
        return 'secondary';
    }
  };

  return (
    <div className="bg-card rounded-lg border border-border">
      <div className="p-6 border-b border-border">
        <h3 className="text-lg font-semibold text-foreground">Today's Orders</h3>
      </div>
      
      <div className="p-6">
        <div className="space-y-4">
          {orders.map((order, index) => (
            <div key={order.id} className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="text-sm text-muted-foreground font-medium">#{index + 1}</div>
                <Avatar className={`w-10 h-10 bg-${order.customer.avatarColor}`}>
                  <AvatarFallback className="text-white text-sm font-medium">
                    {order.customer.initials}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium text-foreground">{order.customer.name}</p>
                  <p className="text-sm text-muted-foreground">{order.time}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <Badge 
                  variant={getStatusBadgeVariant(order.status) as any}
                  className="text-xs"
                >
                  {order.status}
                </Badge>
                <div className="text-sm text-muted-foreground">{order.orderType}</div>
                <Button variant="ghost" size="icon" className="w-8 h-8">
                  <MoreHorizontal className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};