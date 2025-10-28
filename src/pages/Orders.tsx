import { useEffect, useState } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Eye, Clock, Pencil, Trash } from "lucide-react";
import { createClient } from "@supabase/supabase-js";
import AddOrderForm from "@/components/modals/AddOrderForm";

const supabaseUrl = "https://vhvjfndzluxlmlnrkagj.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZodmpmbmR6bHV4bG1sbnJrYWdqIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1ODEwMjc3NywiZXhwIjoyMDczNjc4Nzc3fQ.nv8Jo0sbaFUWUYSfgcpwd5zM3x-Nrq8O4VYnRwziUpI";
const supabase = createClient(supabaseUrl, supabaseKey);

export default function Orders() {
  const [orders, setOrders] = useState<any[]>([]);
  const [menuItems, setMenuItems] = useState<any[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingOrder, setEditingOrder] = useState<any | null>(null);

  const fetchOrders = async () => {
    const { data, error } = await supabase
      .from("orders")
      .select(`
    *,
    profiles:user_id ( full_name )
  `)
      .order("created_at", { ascending: true });

    if (error) console.error("Fetch error:", error);
    else setOrders(data || []);
  };

  const fetchMenuItems = async () => {
    const { data, error } = await supabase
      .from("menu_items")
      .select("id, name, price")
      .eq("is_available", true);
    if (error) console.error("Menu fetch error:", error);
    else setMenuItems(data || []);
  };


  const getItemNames = (itemIds: any[]) => {
    if (!Array.isArray(itemIds)) return [];

    return itemIds.map((id) => {
      if (typeof id === "string") {
        const item = menuItems.find((m) => m.id === id || m.name === id);
        return item ? item.name : id;
      }
      return "Unknown Item";
    });
  };

  useEffect(() => {
    fetchOrders();
    fetchMenuItems();
  }, []);


  const handleSaveOrder = async (data: any) => {
    const itemIds = Array.isArray(data.items)
      ? data.items.map((name) => {
        const found = menuItems.find((m) => m.name === name);
        return found ? found.id : name;
      })
      : [];

    if (editingOrder) {
      // edit mode
      const { error } = await supabase
        .from("orders")
        .update({
          customer: data.customer,
          table: data.table,
          items: itemIds,
          total: data.total,
          status: data.status,
          time: data.time,
        })
        .eq("id", editingOrder.id);

      if (error) {
        alert("Error updating order: " + error.message);
        return;
      }
      setEditingOrder(null);
    } else {
      const nextNumber = orders.length + 1;
      const orderId = `Order #${String(nextNumber).padStart(3, "0")}`;

      const { error } = await supabase.from("orders").insert([
        {
          // order_id: orderId, new order edende "order id" erroru verir !!!!!!!!!!!!!!!!!!!!!!!!!!!!!
          customer: data.customer,
          table: data.table,
          items: itemIds,
          total: data.total,
          status: data.status,
          time: data.time,
        },
      ]);

      if (error) {
        alert("Error creating order: " + error.message);
        return;
      }
    }

    await fetchOrders();
    alert("Order saved successfully!");
  };


  const handleDeleteOrder = async (orderId: any) => {
    if (!confirm("Are you sure you want to delete this order?")) return;
    const { error } = await supabase.from("orders").delete().eq("id", orderId);
    if (error) alert("Error deleting: " + error.message);
    else {
      await fetchOrders();
      alert("Order deleted successfully!");
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Pending":
        return "bg-yellow-100 text-yellow-800";
      case "Preparing":
        return "bg-blue-100 text-blue-800";
      case "Ready":
        return "bg-green-100 text-green-800";
      case "Delivered":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };


  const formatOrderId = (index: number) => {
    const num = String(index + 1).padStart(3, "0");
    return `Order #${num}`;
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
                <p className="text-muted-foreground">
                  Track and manage customer orders
                </p>
              </div>
            </div>
            <Button
              onClick={() => {
                setEditingOrder(null);
                setIsFormOpen(true);
              }}
            >
              <Plus className="w-4 h-4 mr-2" />
              New Order
            </Button>
          </PageHeader>

          <div className="flex-1 p-6">
            <div className="grid gap-4">
              {orders.length === 0 ? (
                <p className="text-gray-500">No orders yet.</p>
              ) : (
                orders.map((order, index) => (
                  <Card key={order.id}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <div>
                        <CardTitle className="text-lg font-medium">
                          {order.order_id || formatOrderId(index)}
                        </CardTitle>
                        <p className="text-sm text-muted-foreground">
                          {order.profiles?.full_name || "Unknown Customer"} • {order.table}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={getStatusColor(order.status)}>
                          {order.status}
                        </Badge>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setEditingOrder(order);
                            setIsFormOpen(true);
                          }}
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteOrder(order.id)}
                        >
                          <Trash className="w-4 h-4 text-red-500" />
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <span className="text-sm">
                            {Array.isArray(order.items)
                              ? getItemNames(order.items).join(", ")
                              : order.items}
                          </span>
                          <span className="text-lg font-bold">
                            ${order.total}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Clock className="w-4 h-4" />
                          {order.time}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </div>
        </main>
      </div>

      <AddOrderForm
        isOpen={isFormOpen}
        onCancel={() => setIsFormOpen(false)}
        onSave={handleSaveOrder}
        menuItems={menuItems}
        initialData={editingOrder}
      />
    </SidebarProvider>
  );
}
