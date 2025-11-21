import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2, DollarSign } from "lucide-react";
import { useState } from "react";
import UpdateDataForm from "@/components/modals/UpdateDataForm";
import { AIChatbot } from "@/components/ai/AIChatbot";

export default function ItemModifiers() {
  const [modifiers, setModifiers] = useState([
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
  ]);

  const [modalOpen, setModalOpen] = useState(false);
  const [activeModifier, setActiveModifier] = useState<any>({});

  const fields = [
    {
      id: 0,
      label: "Name",
      name: "name",
      type: "text",
      placeholder: "Enter modifier name",
      isRequired: true,
    },
    {
      id: 1,
      label: "Group",
      name: "group",
      type: "text",
      placeholder: "Enter group name",
      isRequired: true,
    },
    {
      id: 2,
      label: "Price",
      name: "price",
      type: "number",
      placeholder: "Enter price",
      isRequired: true,
    },
    {
      id: 3,
      label: "Available",
      name: "available",
      type: "select",
      isRequired: true,
      selectItems: [
        { id: 0, value: "true", label: "Available" },
        { id: 1, value: "false", label: "Unavailable" },
      ],
    },
    {
      id: 4,
      label: "Menu Items (comma separated)",
      name: "menuItems",
      type: "text",
      placeholder: "Pizza, Burger, etc.",
      isRequired: false,
    },
  ];

  const handleSave = (data: any) => {
    const newData = {
      ...data,
      price: parseFloat(data.price || 0),
      available: data.available === "true" || data.available === true,
      menuItems: typeof data.menuItems === "string" 
        ? data.menuItems.split(",").map((i: string) => i.trim()).filter(Boolean)
        : data.menuItems
    };

    if (activeModifier?.id) {
      // Edit
      setModifiers(prev =>
        prev.map(m => (m.id === activeModifier.id ? { ...m, ...newData } : m))
      );
    } else {
      // Add
      setModifiers(prev => [
        ...prev,
        { id: Date.now(), ...newData }
      ]);
    }

    setModalOpen(false);
    setActiveModifier({});
  };

  const handleCancel = () => {
    setModalOpen(false);
    setActiveModifier({});
  };

  const handleDelete = (id: number) => {
    if (window.confirm("Delete this modifier?")) {
      setModifiers(prev => prev.filter(m => m.id !== id));
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
                <h1 className="text-2xl font-bold">Item Modifiers</h1>
                <p className="text-muted-foreground">
                  Manage individual modifier options
                </p>
              </div>
            </div>
            <Button
              onClick={() => {
                setActiveModifier({});
                setModalOpen(true);
              }}
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Modifier
            </Button>
          </PageHeader>

          <div className="flex-1 p-6">
            <UpdateDataForm
              initialData={{
                ...activeModifier,
                available:
                  activeModifier.available !== undefined
                    ? String(activeModifier.available)
                    : "",
                menuItems: activeModifier.menuItems
                  ? activeModifier.menuItems.join(", ")
                  : "",
              }}
              fields={fields}
              isOpen={modalOpen}
              onCancel={handleCancel}
              onSave={handleSave}
            />

            <div className="grid gap-4">
              {modifiers.map((modifier) => (
                <Card key={modifier.id}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <div>
                      <CardTitle className="text-lg font-medium">
                        {modifier.name}
                      </CardTitle>
                      <p className="text-sm text-muted-foreground">
                        Group: {modifier.group}
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <DollarSign className="w-4 h-4 text-muted-foreground" />
                        <span className="font-semibold">
                          ${modifier.price.toFixed(2)}
                        </span>
                      </div>
                      <Badge
                        variant={
                          modifier.available ? "default" : "secondary"
                        }
                      >
                        {modifier.available ? "Available" : "Unavailable"}
                      </Badge>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setActiveModifier(modifier);
                            setModalOpen(true);
                          }}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(modifier.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div>
                      <span className="text-sm text-muted-foreground">
                        Available for:
                      </span>
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
      <AIChatbot section="modifiers" context="Modifiers management page" />
    </SidebarProvider>
  );
}
