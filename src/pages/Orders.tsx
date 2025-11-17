"use client";

import { useEffect, useState } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Clock, Pencil, Trash } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import AddOrderForm from "@/components/modals/AddOrderForm";
import { AIChatbot } from "@/components/ai/AIChatbot";

export default function Orders() {
  const [orders, setOrders] = useState<any[]>([]);
  const [menuItems, setMenuItems] = useState<any[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingOrder, setEditingOrder] = useState<any | null>(null);

  // --------------------------------------------------
  // FETCH MENU ITEMS + MENU SETS (for New Order form)
  // --------------------------------------------------
  const fetchMenuItems = async () => {
    const { data: items } = await supabase
      .from("menu_items")
      .select("id, name, price");

    const { data: sets } = await supabase
      .from("menu_sets")
      .select("id, name, price");

    const combined = [
      ...(items || []),
      ...(sets?.map((s) => ({
        id: s.id,
        name: s.name + " (SET)",
        price: s.price,
        isSet: true,
      })) || []),
    ];

    setMenuItems(combined);
  };

  // --------------------------------------------------
  // FETCH ORDERS WITH RELATIONS
  // --------------------------------------------------
  const fetchOrders = async () => {
    const { data, error } = await supabase
      .from("orders")
      .select(
        `
        *,
        order_items (
          id,
          quantity,
          unit_price,
          total_price,
          menu_item_id,
          menu_set_id,
          menu_items:menu_items!order_items_menu_item_id_fkey (id, name),
          menu_sets:menu_sets!order_items_menu_set_id_fkey (id, name)
        )
      `
      )
      .order("created_at", { ascending: true });

    if (!error) setOrders(data || []);
    else console.error("FetchOrders error:", error);
  };

  useEffect(() => {
    fetchOrders();
    fetchMenuItems();
  }, []);

  // --------------------------------------------------
  // SAVE ORDER (NEW or UPDATE)
  // --------------------------------------------------
  const handleSaveOrder = async (data: any) => {
    // 🟡 Eğer editleme yapılıyorsa → UPDATE
    if (editingOrder) {
      await supabase
        .from("orders")
        .update({
          customer_name: data.customer,
          table: data.table,
          status: data.status,
          time: data.time,
          total: data.total,
        })
        .eq("id", editingOrder.id);

      await supabase.from("order_items").delete().eq("order_id", editingOrder.id);

      const items = data.items.map((item: any) => ({
        order_id: order.id,
        menu_item_id: item.isSet ? null : item.id,
        menu_set_id: item.isSet ? item.id : null,
        quantity: item.quantity,
        unit_price: item.price,
        total_price: item.price * item.quantity,
      }));

      await supabase.from("order_items").insert(updatedItems);

      setEditingOrder(null);
      setIsFormOpen(false);
      fetchOrders();
      return;
    }

    // 🟢 Yeni sipariş ekleme (CREATE)
    const { data: order } = await supabase
      .from("orders")
      .insert([
        {
          customer_name: data.customer,
          table: data.table,
          status: data.status,
          time: data.time,
          total: data.total,
        },
      ])
      .select()
      .single();

    const items = data.items.map((item: any) => ({
      order_id: order.id,
      menu_item_id: item.isSet ? null : item.id,
      menu_set_id: item.isSet ? item.id : null,
      quantity: item.quantity,
      unit_price: item.price,
      total_price: item.price * item.quantity,
    }));

    await supabase.from("order_items").insert(items);

    setIsFormOpen(false);
    fetchOrders();
  };

  // --------------------------------------------------
  // DELETE ORDER
  // --------------------------------------------------
  const handleDeleteOrder = async (orderId: string) => {
    if (!confirm("Delete order?")) return;

    await supabase.from("order_items").delete().eq("order_id", orderId);
    await supabase.from("orders").delete().eq("id", orderId);

    fetchOrders();
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
        return "bg-gray-200 text-gray-700";
      default:
        return "bg-gray-200 text-gray-700";
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
              {orders.map((order, index) => (
                <Card key={order.id}>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <div>
                      <CardTitle className="text-lg font-medium">
                        {formatOrderId(index)}
                      </CardTitle>

                      <p className="text-sm text-muted-foreground">
                        {order.customer_name} • {order.table}
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
                          {order.order_items
                            .map((i: any) => {
                              const name =
                                i.menu_items?.name ||
                                i.menu_sets?.name ||
                                "Unknown";
                              return `${name} x${i.quantity}`;
                            })
                            .join(", ")}
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
              ))}
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

      <AIChatbot section="orders" context="Orders management page" />
    </SidebarProvider>
  );
}
