import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Edit, Trash2 } from "lucide-react";
import { useState, useEffect } from "react";
import UpdateDataForm from "@/components/modals/UpdateDataForm";
import { createClient } from "@supabase/supabase-js";
import { AIChatbot } from "@/components/ai/AIChatbot";

const supabaseUrl = "https://vhvjfndzluxlmlnrkagj.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZodmpmbmR6bHV4bG1sbnJrYWdqIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1ODEwMjc3NywiZXhwIjoyMDczNjc4Nzc3fQ.nv8Jo0sbaFUWUYSfgcpwd5zM3x-Nrq8O4VYnRwziUpI";
const supabase = createClient(supabaseUrl, supabaseKey);

export default function ItemCategories() {
  const [modalOpen, setModalOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<any>({});
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

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

  // 🔹 Fetch categories from Supabase
  const fetchCategories = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("item_categories")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) console.error("Fetch error:", error);
    else setCategories(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // 🔹 Add or Update Category
  const handleSave = async (data: any) => {
    if (!data.name || !data.description) {
      alert("Please fill in both Name and Description before saving.");
      return;
    }

    let error = null;

    if (data.id) {
      // Update existing category
      const { error: updateError } = await supabase
        .from("item_categories")
        .update({
          name: data.name,
          description: data.description,
        })
        .eq("id", data.id);
      error = updateError;
    } else {
      // Insert new category
      const { error: insertError } = await supabase
        .from("item_categories")
        .insert([
          { name: data.name, description: data.description, items_count: 0 },
        ]);
      error = insertError;
    }

    if (error) {
      alert("Error saving category: " + error.message);
    } else {
      setModalOpen(false);
      setActiveCategory({});
      fetchCategories();
    }
  };

  // 🔹 Edit category
  const handleEdit = (category: any) => {
    setActiveCategory(category);
    setModalOpen(true);
  };

  // 🔹 Delete category
  const handleDelete = async (id: string) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this category?"
    );
    if (!confirmDelete) return;

    const { error } = await supabase
      .from("item_categories")
      .delete()
      .eq("id", id);

    if (error) alert("Error deleting: " + error.message);
    else fetchCategories();
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
                <p className="text-muted-foreground">
                  Organize menu items by category
                </p>
              </div>
            </div>
            <Button
              onClick={() => {
                setActiveCategory({});
                setModalOpen(true);
              }}
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Category
            </Button>
          </PageHeader>

          <div className="flex-1 p-6">
            <UpdateDataForm
              initialData={activeCategory}
              fields={fields}
              isOpen={modalOpen}
              onCancel={handleCancel}
              onSave={handleSave}
            />

            {loading ? (
              <p>Loading categories...</p>
            ) : categories.length === 0 ? (
              <p className="text-gray-500">No categories found.</p>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {categories.map((category) => (
                  <Card key={category.id}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-lg font-medium">
                        {category.name}
                      </CardTitle>
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
                      <p className="text-sm text-muted-foreground mb-1">
                        {category.description}
                      </p>
                      <p className="text-sm font-medium">
                        {category.items_count} items
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
      <AIChatbot section="categories" context="Item categories management page" />
    </SidebarProvider>
  );
}
