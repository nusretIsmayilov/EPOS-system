import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Package, AlertTriangle, TrendingDown } from "lucide-react";

export default function Inventory() {
  const inventory = [
    { 
      id: 1, 
      item: "Chicken Breast", 
      category: "Meat", 
      currentStock: 25,
      minStock: 10,
      unit: "lbs",
      lastRestocked: "2024-01-10",
      supplier: "Fresh Farms Co."
    },
    { 
      id: 2, 
      item: "Basmati Rice", 
      category: "Grains", 
      currentStock: 5,
      minStock: 15,
      unit: "bags",
      lastRestocked: "2024-01-05",
      supplier: "Grain Traders"
    },
    { 
      id: 3, 
      item: "Tomatoes", 
      category: "Vegetables", 
      currentStock: 30,
      minStock: 20,
      unit: "lbs",
      lastRestocked: "2024-01-12",
      supplier: "Garden Fresh"
    },
    { 
      id: 4, 
      item: "Mango Pulp", 
      category: "Fruits", 
      currentStock: 8,
      minStock: 12,
      unit: "cans",
      lastRestocked: "2024-01-08",
      supplier: "Tropical Foods"
    },
  ];

  const getStockStatus = (current: number, min: number) => {
    if (current < min) return { status: 'Low Stock', color: 'bg-red-100 text-red-800' };
    if (current < min * 1.5) return { status: 'Medium', color: 'bg-yellow-100 text-yellow-800' };
    return { status: 'Good', color: 'bg-green-100 text-green-800' };
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
                <h1 className="text-2xl font-bold">Inventory</h1>
                <p className="text-muted-foreground">Track and manage stock levels</p>
              </div>
            </div>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add Item
            </Button>
          </PageHeader>

          <div className="flex-1 p-6">
            <div className="grid gap-4">
              {inventory.map((item) => {
                const stockStatus = getStockStatus(item.currentStock, item.minStock);
                return (
                  <Card key={item.id}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <div className="flex items-center gap-3">
                        <Package className="w-8 h-8 text-muted-foreground" />
                        <div>
                          <CardTitle className="text-lg font-medium">{item.item}</CardTitle>
                          <p className="text-sm text-muted-foreground">{item.category}</p>
                        </div>
                      </div>
                      <Badge className={stockStatus.color}>
                        {stockStatus.status}
                      </Badge>
                    </CardHeader>
                    <CardContent>
                      <div className="grid md:grid-cols-4 gap-4">
                        <div>
                          <p className="text-sm text-muted-foreground">Current Stock</p>
                          <p className="text-lg font-semibold">{item.currentStock} {item.unit}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Minimum Stock</p>
                          <p className="text-sm">{item.minStock} {item.unit}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Last Restocked</p>
                          <p className="text-sm">{item.lastRestocked}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Supplier</p>
                          <p className="text-sm">{item.supplier}</p>
                        </div>
                      </div>
                      <div className="flex gap-2 mt-4">
                        <Button size="sm" variant="outline">Restock</Button>
                        <Button size="sm" variant="outline">Edit</Button>
                        <Button size="sm" variant="outline">History</Button>
                        {item.currentStock < item.minStock && (
                          <Button size="sm" className="bg-red-600 hover:bg-red-700">
                            <AlertTriangle className="w-4 h-4 mr-2" />
                            Order Now
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}