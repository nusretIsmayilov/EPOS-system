import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2, DollarSign } from "lucide-react";

export default function ItemModifiers() {
  const modifiers = [
    { 
      id: 1, 
      name: "Extra Cheese", 
      group: "Extra Toppings",
      price: 2.50,
      available: true,
      menuItems: ["Pizza", "Sandwich", "Burger"]
    },
    { 
      id: 2, 
      name: "Medium Spice", 
      group: "Spice Level",
      price: 0.00,
      available: true,
      menuItems: ["Curry", "Biryani", "Tandoori"]
    },
    { 
      id: 3, 
      name: "Large Portion", 
      group: "Portion Size",
      price: 4.00,
      available: true,
      menuItems: ["All Mains", "Appetizers"]
    },
    { 
      id: 4, 
      name: "Grilled Style", 
      group: "Cooking Style",
      price: 0.00,
      available: false,
      menuItems: ["Chicken", "Fish", "Vegetables"]
    },
    { 
      id: 5, 
      name: "Extra Hot", 
      group: "Spice Level",
      price: 0.00,
      available: true,
      menuItems: ["All Spicy Items"]
    },
  ];

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <main className="flex-1 flex flex-col">
          <PageHeader>
            <div className="flex items-center gap-4">
              <SidebarTrigger />
              <div>
                <h1 className="text-2xl font-bold">Item Modifiers</h1>
                <p className="text-muted-foreground">Manage individual modifier options</p>
              </div>
            </div>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add Modifier
            </Button>
          </PageHeader>

          <div className="flex-1 p-6">
            <div className="grid gap-4">
              {modifiers.map((modifier) => (
                <Card key={modifier.id}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <div>
                      <CardTitle className="text-lg font-medium">{modifier.name}</CardTitle>
                      <p className="text-sm text-muted-foreground">Group: {modifier.group}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <DollarSign className="w-4 h-4 text-muted-foreground" />
                        <span className="font-semibold">${modifier.price.toFixed(2)}</span>
                      </div>
                      <Badge variant={modifier.available ? "default" : "secondary"}>
                        {modifier.available ? "Available" : "Unavailable"}
                      </Badge>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div>
                      <span className="text-sm text-muted-foreground">Available for:</span>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {modifier.menuItems.map((item) => (
                          <Badge key={item} variant="outline" className="text-xs">
                            {item}
                          </Badge>
                        ))}
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