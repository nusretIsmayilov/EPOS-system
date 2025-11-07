import { useEffect, useState } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Package, Trash2, Pencil } from "lucide-react";
import { supabase } from "@/lib/supabase";
import AddInventoryForm from "@/components/modals/AddInventoryForm";
import KitchenOrdersModal from "@/components/modals/KitchenOrdersModal";

export default function Inventory() {
  const [inventory, setInventory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editItem, setEditItem] = useState<any>(null);
  const [isKitchenOpen, setIsKitchenOpen] = useState(false);

  const fetchInventory = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("inventory")
      .select("*")
      .order("item_name", { ascending: true });
    if (error) console.error("Fetch error:", error);
    else setInventory(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this item?")) return;
    const { error } = await supabase.from("inventory").delete().eq("id", id);
    if (error) alert("Error deleting item: " + error.message);
    else fetchInventory();
  };

  const handleEditSave = async (data: any) => {
    const { error } = await supabase
      .from("inventory")
      .update({
        item_name: data.item_name,
        category: data.category,
        current_stock: Number(data.current_stock),
        min_stock: Number(data.min_stock),
        unit: data.unit,
        supplier: data.supplier,
      })
      .eq("id", editItem.id);

    if (error) alert("Error updating item: " + error.message);
    else {
      fetchInventory();
      setIsEditOpen(false);
      setEditItem(null);
    }
  };

  const getStockStatus = (current: number, min: number) => {
    if (current < min) return { status: "Low Stock", color: "bg-red-100 text-red-800" };
    if (current < min * 1.5) return { status: "Medium", color: "bg-yellow-100 text-yellow-800" };
    return { status: "Good", color: "bg-green-100 text-green-800" };
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex flex-col md:flex-row w-full">
        <AppSidebar />
        <main className="flex-1 flex flex-col">
          <PageHeader>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <SidebarTrigger />
                <div>
                  <h1 className="text-2xl font-bold">Inventory</h1>
                  <p className="text-muted-foreground text-sm">
                    Track and manage stock levels
                  </p>
                </div>
              </div>

              <div className="flex gap-2 flex-wrap">
                <Button onClick={() => setIsAddOpen(true)}>
                  <Plus className="w-4 h-4 mr-2" /> Add Item
                </Button>
                <Button variant="secondary" onClick={() => setIsKitchenOpen(true)}>
                  🍳 Kitchen Orders
                </Button>
              </div>
            </div>
          </PageHeader>

          <div className="flex-1 p-4 md:p-6">
            {loading ? (
              <p>Loading...</p>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {inventory.map((item) => {
                  const stockStatus = getStockStatus(item.current_stock, item.min_stock);
                  return (
                    <Card key={item.id} className="flex flex-col justify-between">
                      <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <div className="flex items-center gap-3">
                          <Package className="w-8 h-8 text-muted-foreground" />
                          <div>
                            <CardTitle className="text-lg font-medium">
                              {item.item_name}
                            </CardTitle>
                            <p className="text-sm text-muted-foreground">{item.category}</p>
                          </div>
                        </div>
                        <Badge className={stockStatus.color}>{stockStatus.status}</Badge>
                      </CardHeader>

                      <CardContent>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <p>
                            <strong>Current:</strong> {item.current_stock} {item.unit}
                          </p>
                          <p>
                            <strong>Min:</strong> {item.min_stock} {item.unit}
                          </p>
                          <p>
                            <strong>Supplier:</strong> {item.supplier}
                          </p>
                        </div>

                        <div className="flex flex-wrap gap-2 mt-3">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setEditItem(item);
                              setIsEditOpen(true);
                            }}
                          >
                            <Pencil className="w-4 h-4 mr-1" /> Edit
                          </Button>

                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleDelete(item.id)}
                          >
                            <Trash2 className="w-4 h-4 mr-1" /> Delete
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Add Form */}
      <AddInventoryForm
        isOpen={isAddOpen}
        onCancel={() => setIsAddOpen(false)}
        onSave={() => {
          setIsAddOpen(false);
          fetchInventory();
        }}
      />

      {/* Edit Form */}
      <AddInventoryForm
        isOpen={isEditOpen}
        onCancel={() => setIsEditOpen(false)}
        onSave={handleEditSave}
        initialData={editItem}
      />

      <KitchenOrdersModal
        isOpen={isKitchenOpen}
        onClose={() => setIsKitchenOpen(false)}
        inventory={inventory}
      />
    </SidebarProvider>
  );
}
