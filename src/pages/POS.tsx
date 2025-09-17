import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Minus, ShoppingCart, CreditCard } from "lucide-react";
import { useState } from "react";

export default function POS() {
  const [cart, setCart] = useState<Array<{id: number, name: string, price: number, quantity: number}>>([]);

  const menuItems = [
    { id: 1, name: "Butter Chicken", price: 18.99, category: "Main Course" },
    { id: 2, name: "Dal Makhani", price: 14.99, category: "Main Course" },
    { id: 3, name: "Tandoori Salmon", price: 24.99, category: "Seafood" },
    { id: 4, name: "Mango Lassi", price: 4.99, category: "Beverage" },
    { id: 5, name: "Gulab Jamun", price: 6.99, category: "Dessert" },
    { id: 6, name: "Biryani", price: 16.99, category: "Main Course" },
  ];

  const addToCart = (item: typeof menuItems[0]) => {
    const existingItem = cart.find(cartItem => cartItem.id === item.id);
    if (existingItem) {
      setCart(cart.map(cartItem => 
        cartItem.id === item.id 
          ? { ...cartItem, quantity: cartItem.quantity + 1 }
          : cartItem
      ));
    } else {
      setCart([...cart, { ...item, quantity: 1 }]);
    }
  };

  const updateQuantity = (id: number, change: number) => {
    setCart(cart.map(item => {
      if (item.id === id) {
        const newQuantity = item.quantity + change;
        return newQuantity > 0 ? { ...item, quantity: newQuantity } : item;
      }
      return item;
    }).filter(item => item.quantity > 0));
  };

  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

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
                <p className="text-muted-foreground">Process customer orders</p>
              </div>
            </div>
          </PageHeader>

          <div className="flex-1 p-6">
            <div className="grid lg:grid-cols-3 gap-6">
              {/* Menu Items */}
              <div className="lg:col-span-2">
                <h2 className="text-xl font-semibold mb-4">Menu Items</h2>
                <div className="grid gap-4 md:grid-cols-2">
                  {menuItems.map((item) => (
                    <Card key={item.id} className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => addToCart(item)}>
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <CardTitle className="text-lg">{item.name}</CardTitle>
                          <Badge variant="secondary">{item.category}</Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="flex justify-between items-center">
                          <span className="text-xl font-bold">${item.price}</span>
                          <Button size="sm">
                            <Plus className="w-4 h-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Cart */}
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
                      <p className="text-center text-muted-foreground py-8">No items in cart</p>
                    ) : (
                      <>
                        <div className="space-y-3">
                          {cart.map((item) => (
                            <div key={item.id} className="flex items-center justify-between">
                              <div className="flex-1">
                                <p className="font-medium">{item.name}</p>
                                <p className="text-sm text-muted-foreground">${item.price}</p>
                              </div>
                              <div className="flex items-center gap-2">
                                <Button size="sm" variant="outline" onClick={() => updateQuantity(item.id, -1)}>
                                  <Minus className="w-3 h-3" />
                                </Button>
                                <span className="w-8 text-center">{item.quantity}</span>
                                <Button size="sm" variant="outline" onClick={() => updateQuantity(item.id, 1)}>
                                  <Plus className="w-3 h-3" />
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                        
                        <div className="border-t pt-4">
                          <div className="flex justify-between items-center font-bold text-lg">
                            <span>Total:</span>
                            <span>${total.toFixed(2)}</span>
                          </div>
                        </div>

                        <Button className="w-full" size="lg">
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