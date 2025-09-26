import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Edit, Trash2 } from "lucide-react";
import UpdateDataForm from "@/components/modals/UpdateDataForm";
import { useState } from "react";

export default function Menus() {
  const [modalOpen, setModalOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState<any>({});
  const [menus, setMenus] = useState([
    { id: 1, name: "Main Menu", items: 25, status: "Active" },
    { id: 2, name: "Dessert Menu", items: 12, status: "Active" },
    { id: 3, name: "Beverage Menu", items: 18, status: "Active" },
    { id: 4, name: "Lunch Special", items: 8, status: "Inactive" },
  ]);

  const fields = [
    {
      id: 0,
      label: "Name",
      name: "name",
      type: "text",
      placeholder: "Enter menu name",
      isRequired: true,
    },
    {
      id: 1,
      label: "Status",
      name: "status",
      type: "select",
      isRequired: true,
      selectItems: [
        { id: 0, value: "Active", label: "Active" },
        { id: 1, value: "Inactive", label: "Inactive" },
      ],
    },
  ];

  const handleSave = (data: any) => {
    if (data.id) {
      setMenus((prev) =>
        prev.map((m) => (m.id === data.id ? { ...m, ...data } : m))
      );
    } else {
      setMenus((prev) => [
        ...prev,
        {
          id: Date.now(),
          name: data.name,
          status: data.status,
          items: 0,
        },
      ]);
    }
    setModalOpen(false);
    setActiveMenu({});
  };

  const handleEdit = (menu: any) => {
    setActiveMenu(menu);
    setModalOpen(true);
  };

  const handleDelete = (id: number) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this menu?"
    );
    if (!confirmDelete) return;
    setMenus((prev) => prev.filter((m) => m.id !== id));
  };

  const handleCancel = () => {
    setModalOpen(false);
    setActiveMenu({});
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
                <h1 className="text-2xl font-bold">Menus</h1>
                <p className="text-muted-foreground">
                  Manage your restaurant menus
                </p>
              </div>
            </div>
            <Button onClick={() => setModalOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Menu
            </Button>
          </PageHeader>

          <div className="flex-1 p-6">
            {/* Modal */}
            <UpdateDataForm
              initialData={activeMenu}
              fields={fields}
              isOpen={modalOpen}
              onCancel={handleCancel}
              onSave={handleSave}
            />

            {/* Menus list */}
            <div className="grid gap-6">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {menus.map((menu) => (
                  <Card key={menu.id}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-lg font-medium">
                        {menu.name}
                      </CardTitle>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(menu)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(menu.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <p className="text-sm text-muted-foreground">
                          {menu.items} items
                        </p>
                        <div className="flex items-center justify-between">
                          <span
                            className={`px-2 py-1 rounded-full text-xs ${
                              menu.status === "Active"
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {menu.status}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
