import { useEffect, useState } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Package, AlertTriangle, Trash2, Pencil } from "lucide-react";
import { supabase } from "@/lib/supabase";
import AddInventoryForm from "@/components/modals/AddInventoryForm";
import UpdateDataForm from "@/components/modals/UpdateDataForm";

export default function Inventory() {
  const [inventory, setInventory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editItem, setEditItem] = useState<any>(null);

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

  const handleEdit = async (updatedData: any) => {
    const { error } = await supabase
      .from("inventory")
      .update({
        item_name: updatedData.item_name,
        category: updatedData.category,
        current_stock: Number(updatedData.current_stock),
        min_stock: Number(updatedData.min_stock),
        unit: updatedData.unit,
        supplier: updatedData.supplier,
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
            <Button onClick={() => setIsAddOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Item
            </Button>
          </PageHeader>

          <div className="flex-1 p-6">
            {loading ? (
              <p>Loading...</p>
            ) : (
              <div className="grid gap-4">
                {inventory.map((item) => {
                  const stockStatus = getStockStatus(item.current_stock, item.min_stock);
                  return (
                    <Card key={item.id}>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <div className="flex items-center gap-3">
                          <Package className="w-8 h-8 text-muted-foreground" />
                          <div>
                            <CardTitle className="text-lg font-medium">{item.item_name}</CardTitle>
                            <p className="text-sm text-muted-foreground">{item.category}</p>
                          </div>
                        </div>
                        <Badge className={stockStatus.color}>{stockStatus.status}</Badge>
                      </CardHeader>
                      <CardContent>
                        <div className="grid md:grid-cols-4 gap-4">
                          <div>
                            <p className="text-sm text-muted-foreground">Current Stock</p>
                            <p className="text-lg font-semibold">
                              {item.current_stock} {item.unit}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Minimum Stock</p>
                            <p className="text-sm">{item.min_stock} {item.unit}</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Supplier</p>
                            <p className="text-sm">{item.supplier}</p>
                          </div>

                          <div className="flex gap-2">
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

                            {item.current_stock < item.min_stock && (
                              <Button
                                size="sm"
                                className="bg-red-600 hover:bg-red-700 text-white"
                                onClick={() => alert(`Need to reorder ${item.item_name}`)}
                              >
                                <AlertTriangle className="w-4 h-4 mr-1" /> Order Now
                              </Button>
                            )}
                          </div>
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

      {/* Add form */}
      <AddInventoryForm
        isOpen={isAddOpen}
        onCancel={() => setIsAddOpen(false)}
        onSave={() => {
          setIsAddOpen(false);
          fetchInventory();
        }}
      />

      {/* Edit form */}
      <UpdateDataForm
        isOpen={isEditOpen}
        onCancel={() => setIsEditOpen(false)}
        onSave={handleEdit}
        initialData={editItem}
        fields={[
          { id: 1, label: "Item Name", name: "item_name", type: "text", isRequired: true },
          { id: 2, label: "Category", name: "category", type: "text" },
          { id: 3, label: "Current Stock", name: "current_stock", type: "number" },
          { id: 4, label: "Min Stock", name: "min_stock", type: "number" },
          { id: 5, label: "Unit", name: "unit", type: "text" },
          { id: 6, label: "Supplier", name: "supplier", type: "text" },
        ]}
      />
    </SidebarProvider>
  );
}
