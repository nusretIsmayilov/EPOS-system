import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Edit, Trash2 } from "lucide-react";
import { useState } from "react";
import UpdateDataForm from "@/components/modals/UpdateDataForm";

export default function ItemCategories() {
  const [modalOpen, setModalOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<any>({});
  const [categories, setCategories] = useState([
    { id: 1, name: "Main Course", items: 12, description: "Primary dishes and entrees" },
    { id: 2, name: "Appetizers", items: 8, description: "Starter dishes and small plates" },
    { id: 3, name: "Beverages", items: 15, description: "Drinks and refreshments" },
    { id: 4, name: "Desserts", items: 6, description: "Sweet treats and desserts" },
    { id: 5, name: "Seafood", items: 5, description: "Fresh fish and seafood dishes" },
  ]);

  const fields = [
    {
      id: 0,
      label: "Name",
      name: "name",
      type: "text",
      placeholder: "Enter category name",
      isRequired: true,
    },
    {
      id: 1,
      label: "Description",
      name: "description",
      type: "text",
      placeholder: "Enter description",
      isRequired: true,
    },
  ];

  const handleSave = (data: any) => {
    if (!data.name || !data.description) {
      window.alert("Please fill in both Name and Description before saving.");
      return;
    }

    if (data.id) {
      // update
      setCategories((prev) =>
        prev.map((c) => (c.id === data.id ? { ...c, ...data } : c))
      );
    } else {
      // new
      setCategories((prev) => [
        ...prev,
        { id: Date.now(), name: data.name, description: data.description, items: 0 },
      ]);
    }

    setModalOpen(false);
    setActiveCategory({});
  };

  const handleEdit = (category: any) => {
    setActiveCategory(category);
    setModalOpen(true);
  };

  const handleDelete = (id: number) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this category?"
    );
    if (!confirmDelete) return;
    setCategories((prev) => prev.filter((c) => c.id !== id));
  };

  const handleCancel = () => {
    setModalOpen(false);
    setActiveCategory({});
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
                <h1 className="text-2xl font-bold">Item Categories</h1>
                <p className="text-muted-foreground">Organize menu items by category</p>
              </div>
            </div>
            <Button onClick={() => setModalOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Category
            </Button>
          </PageHeader>

          <div className="flex-1 p-6">
            {/* Modal */}
            <UpdateDataForm
              initialData={activeCategory}
              fields={fields}
              isOpen={modalOpen}
              onCancel={handleCancel}
              onSave={handleSave}
            />

            {/* Categories list */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {categories.map((category) => (
                <Card key={category.id}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-lg font-medium">{category.name}</CardTitle>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(category)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(category.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">{category.description}</p>
                      <p className="text-sm font-medium">{category.items} items</p>
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
