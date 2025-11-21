import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Minus, ShoppingCart, CreditCard, Trash } from "lucide-react";
import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";

const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const projectRef = import.meta.env.VITE_PROJECT_REF;

export default function POS() {
  const [cart, setCart] = useState<
    Array<{ id: string; name: string; price: number; quantity: number }>
  >([]);
  const queryClient = useQueryClient();

  const { data: menuItems, isLoading: isLoadingItems } = useQuery({
    queryKey: ["menu-items"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("menu_items")
        .select(`*, menu_categories ( name )`)
        .eq("is_available", true)
        .order("name");

      if (error) throw error;
      return data;
    },
  });


  const { data: menuSets, isLoading: isLoadingSets } = useQuery({
    queryKey: ["menu-sets"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("menu_sets")
        .select("*")
        .eq("status", "Active")
        .order("name");

      if (error) throw error;
      return data;
    },
  });

  const combinedMenu =
    menuItems || menuSets
      ? [
          ...(menuItems || []),
          ...(menuSets?.map((set) => ({
            id: set.id,
            name: set.name,
            price: set.price,
            isSet: true,
          })) || []),
        ]
      : [];


  const addToCart = (item: any) => {
    const existing = cart.find((c) => c.id === item.id);
    if (existing) {
      setCart(
        cart.map((c) =>
          c.id === item.id ? { ...c, quantity: c.quantity + 1 } : c
        )
      );
    } else {
      setCart([...cart, { ...item, quantity: 1 }]);
    }
  };

  const removeFromCart = (id: string) => {
    setCart(cart.filter((i) => i.id !== id));
  };

  const updateQuantity = (id: string, change: number) => {
    setCart(
      cart
        .map((item) => {
          if (item.id === id) {
            const newQty = item.quantity + change;
            return newQty > 0 ? { ...item, quantity: newQty } : item;
          }
          return item;
        })
        .filter((item) => item.quantity > 0)
    );
  };

  const total = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );


  const handleCheckout = async () => {
    if (cart.length === 0) return;

    const success_url = `${window.location.origin}/payment-success`;
    const cancel_url = `${window.location.origin}/pos`;

    try {
      const res = await fetch(
        `https://${projectRef}.functions.supabase.co/create-checkout-session`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${supabaseAnonKey}`,
          },
          body: JSON.stringify({
            items: cart,
            success_url,
            cancel_url,
            total_amount: total,
          }),
        }
      );

      const data = await res.json();

      if (data.url) {
        localStorage.setItem(
          "stripe_checkout_session",
          JSON.stringify(cart)
        );
        window.location.href = data.url;
        setCart([]);
      } else {
        console.error("Checkout URL not returned");
      }
    } catch (err) {
      console.error("Error creating checkout session:", err);
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
                <h1 className="text-2xl font-bold">Point of Sale</h1>
                <p className="text-muted-foreground">
                  Process customer orders
                </p>
              </div>
            </div>
          </PageHeader>

          <div className="flex-1 p-6">
            <div className="grid lg:grid-cols-3 gap-6">
  
              {isLoadingItems || isLoadingSets ? (
                Array.from({ length: 6 }).map((_, i) => (
                  <Card key={i}>
                    <CardHeader>
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-3 w-1/2" />
                    </CardHeader>
                    <CardContent>
                      <Skeleton className="h-4 w-full mb-2" />
                      <Skeleton className="h-4 w-2/3" />
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="lg:col-span-2">
                  <h2 className="text-xl font-semibold mb-4">
                    Menu Items & Sets
                  </h2>

                  <div className="grid gap-4 md:grid-cols-2">
                    {combinedMenu.map((item) => (
                      <Card
                        key={item.id}
                        className="cursor-pointer hover:shadow-md transition-shadow"
                        onClick={() => addToCart(item)}
                      >
                        <CardHeader className="pb-2">
                          <div className="flex justify-between items-center">
                            <CardTitle className="text-lg">
                              {item.name}
                            </CardTitle>

                            {item.isSet ? (
                              <Badge variant="outline">Set Menu</Badge>
                            ) : (
                              item?.menu_categories?.name && (
                                <Badge variant="secondary">
                                  {item.menu_categories.name}
                                </Badge>
                              )
                            )}
                          </div>
                        </CardHeader>

                        <CardContent>
                          <div className="flex justify-between items-center">
                            <span className="text-xl font-bold">
                              ${item.price}
                            </span>
                            <Button size="sm">
                              <Plus className="w-4 h-4" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <ShoppingCart className="w-5 h-5" />
                      Current Order
                    </CardTitle>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    {cart.length === 0 ? (
                      <p className="text-center text-muted-foreground py-8">
                        No items in cart
                      </p>
                    ) : (
                      <>
                        <div className="space-y-3">
                          {cart.map((item) => (
                            <div
                              key={item.id}
                              className="flex items-center justify-between gap-2"
                            >
                              <div className="flex-1 min-w-0">
                                <p className="font-medium truncate">
                                  {item.name}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                  ${item.price}
                                </p>
                              </div>

                              <div className="flex items-center gap-2">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() =>
                                    updateQuantity(item.id, -1)
                                  }
                                >
                                  <Minus className="w-3 h-3" />
                                </Button>

                                <span className="w-8 text-center">
                                  {item.quantity}
                                </span>

                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() =>
                                    updateQuantity(item.id, 1)
                                  }
                                >
                                  <Plus className="w-3 h-3" />
                                </Button>
                              </div>

                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() =>
                                  removeFromCart(item.id)
                                }
                              >
                                <Trash className="w-3 h-3" />
                              </Button>
                            </div>
                          ))}
                        </div>

                        <div className="border-t pt-4">
                          <div className="flex justify-between items-center font-bold text-lg">
                            <span>Total:</span>
                            <span>${total.toFixed(2)}</span>
                          </div>
                        </div>

                        <Button
                          className="w-full"
                          size="lg"
                          onClick={handleCheckout}
                        >
                          <CreditCard className="w-4 h-4 mr-2" />
                          Process Payment
                        </Button>
                      </>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
