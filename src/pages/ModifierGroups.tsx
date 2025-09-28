import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Edit, Trash2, Settings } from "lucide-react";
import { useState } from "react";
import UpdateDataForm from "@/components/modals/UpdateDataForm";

export default function ModifierGroups() {
  const [modalOpen, setModalOpen] = useState(false);
  const [activeGroup, setActiveGroup] = useState<any>({});
  const [modifierGroups, setModifierGroups] = useState([
    {
      id: 1,
      name: "Spice Level",
      type: "Single Choice",
      required: true,
      options: ["Mild", "Medium", "Hot", "Extra Hot"],
      menuItems: 15,
    },
    {
      id: 2,
      name: "Extra Toppings",
      type: "Multiple Choice",
      required: false,
      options: ["Cheese", "Jalapeños", "Onions", "Tomatoes"],
      menuItems: 8,
    },
    {
      id: 3,
      name: "Cooking Style",
      type: "Single Choice",
      required: true,
      options: ["Grilled", "Fried", "Baked", "Steamed"],
      menuItems: 12,
    },
    {
      id: 4,
      name: "Portion Size",
      type: "Single Choice",
      required: false,
      options: ["Small", "Regular", "Large"],
      menuItems: 20,
    },
  ]);

  const fields = [
    {
      id: 0,
      label: "Name",
      name: "name",
      type: "text",
      placeholder: "Enter group name",
      isRequired: true,
    },
    {
      id: 1,
      label: "Type",
      name: "type",
      type: "select",
      isRequired: true,
      selectItems: [
        { id: 0, value: "Single Choice", label: "Single Choice" },
        { id: 1, value: "Multiple Choice", label: "Multiple Choice" },
      ],
    },
    {
      id: 2,
      label: "Required",
      name: "required",
      type: "select",
      isRequired: true,
      selectItems: [
        { id: 0, value: true, label: "Yes" },
        { id: 1, value: false, label: "No" },
      ],
    },
    {
      id: 3,
      label: "Options (comma separated)",
      name: "options",
      type: "text",
      placeholder: "Example: Mild, Medium, Hot",
      isRequired: true,
    },
  ];

  const handleSave = (data: any) => {
    if (!data.name || !data.type || !data.options) {
      window.alert("Please fill all required fields.");
      return;
    }

    const parsedOptions = data.options
      .split(",")
      .map((opt: string) => opt.trim())
      .filter((opt: string) => opt.length > 0);

    if (data.id) {
      // update
      setModifierGroups((prev) =>
        prev.map((g) =>
          g.id === data.id
            ? { ...g, ...data, options: parsedOptions, required: data.required === true || data.required === "true" }
            : g
        )
      );
    } else {
      // add
      setModifierGroups((prev) => [
        ...prev,
        {
          id: Date.now(),
          name: data.name,
          type: data.type,
          required: data.required === true || data.required === "true",
          options: parsedOptions,
          menuItems: 0,
        },
      ]);
    }

    setModalOpen(false);
    setActiveGroup({});
  };

  const handleEdit = (group: any) => {
    setActiveGroup({
      ...group,
      options: group.options.join(", "),
    });
    setModalOpen(true);
  };

  const handleDelete = (id: number) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this group?");
    if (!confirmDelete) return;
    setModifierGroups((prev) => prev.filter((g) => g.id !== id));
  };

  const handleCancel = () => {
    setModalOpen(false);
    setActiveGroup({});
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
                <h1 className="text-2xl font-bold">Modifier Groups</h1>
                <p className="text-muted-foreground">
                  Manage menu item modification groups
                </p>
              </div>
            </div>
            <Button onClick={() => setModalOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Group
            </Button>
          </PageHeader>

          <div className="flex-1 p-6">
            {/* Modal */}
            <UpdateDataForm
              initialData={activeGroup}
              fields={fields}
              isOpen={modalOpen}
              onCancel={handleCancel}
              onSave={handleSave}
            />

            {/* Groups list */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {modifierGroups.map((group) => (
                <Card key={group.id}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <div className="flex items-center gap-2">
                      <Settings className="w-5 h-5 text-muted-foreground" />
                      <CardTitle className="text-lg font-medium">{group.name}</CardTitle>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(group)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(group.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <span className="text-muted-foreground">Type:</span>
                        <p className="font-medium">{group.type}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Required:</span>
                        <p className="font-medium">{group.required ? "Yes" : "No"}</p>
                      </div>
                    </div>

                    <div>
                      <span className="text-sm text-muted-foreground">Options:</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {group.options.map((option) => (
                          <span
                            key={option}
                            className="px-2 py-1 bg-gray-100 text-xs rounded"
                          >
                            {option}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="text-sm">
                      <span className="text-muted-foreground">Used in:</span>
                      <p className="font-medium">{group.menuItems} menu items</p>
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
