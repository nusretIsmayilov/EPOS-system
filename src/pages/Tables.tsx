import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Users, Edit, Trash2 } from "lucide-react";
import UpdateDataForm from "@/components/modals/UpdateDataForm";
import { AIChatbot } from "@/components/ai/AIChatbot";

export default function Tables() {
  const [tables, setTables] = useState<any[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [activeTable, setActiveTable] = useState<any>({});

  const fields = [
    { id: 0, label: "Table Number", name: "number", type: "text", isRequired: true },
    { id: 1, label: "Capacity", name: "capacity", type: "number", isRequired: true },
    { id: 2, label: "Location", name: "location", type: "text" },
    {
      id: 3,
      label: "Status",
      name: "status",
      type: "select",
      isRequired: true,
      selectItems: [
        { id: 0, value: "Available", label: "Available" },
        { id: 1, value: "Occupied", label: "Occupied" },
        { id: 2, value: "Reserved", label: "Reserved" },
      ],
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Available": return "bg-green-100 text-green-800";
      case "Occupied":  return "bg-red-100 text-red-800";
      case "Reserved":  return "bg-yellow-100 text-yellow-800";
      default:          return "bg-gray-100 text-gray-800";
    }
  };

  async function fetchTables() {
    const { data, error } = await supabase.from("tables").select("*").order("id");
    if (!error) setTables(data || []);
    else console.error(error);
  }

  async function handleSave(data: any) {
    if (data.id) {
      const { error } = await supabase
        .from("tables")
        .update({
          number: data.number,
          capacity: data.capacity,
          location: data.location,
          status: data.status,
        })
        .eq("id", data.id);
      if (error) return alert(error.message);
    } else {
      const { error } = await supabase.from("tables").insert([data]);
      if (error) return alert(error.message);
    }
    await fetchTables();
    setModalOpen(false);
    setActiveTable({});
  }

  async function handleEdit(table: any) {
    setActiveTable(table);
    setModalOpen(true);
  }

  async function handleDelete(id: number) {
    if (!window.confirm("Are you sure you want to delete this table?")) return;
    const { error } = await supabase.from("tables").delete().eq("id", id);
    if (error) return alert(error.message);
    await fetchTables();
  }

  useEffect(() => {
    fetchTables();
  }, []);

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <main className="flex-1 flex flex-col">
          <PageHeader>
            <div className="flex items-center gap-4">
              <SidebarTrigger />
              <div>
                <h1 className="text-2xl font-bold">Tables</h1>
                <p className="text-muted-foreground">
                  Manage restaurant tables and seating
                </p>
              </div>
            </div>
            <Button
              onClick={() => {
                setActiveTable({});
                setModalOpen(true);
              }}
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Table
            </Button>
          </PageHeader>

          <div className="flex-1 p-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {tables.map((table) => (
                <Card
                  key={table.id}
                  className="cursor-pointer hover:shadow-md transition-shadow"
                >
                  <CardHeader className="text-center">
                    <CardTitle className="text-2xl font-bold">
                      {table.number}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">
                      {table.location}
                    </p>
                  </CardHeader>
                  <CardContent className="text-center space-y-3">
                    <div className="flex items-center justify-center gap-2">
                      <Users className="w-4 h-4" />
                      <span>{table.capacity} seats</span>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                        table.status
                      )}`}
                    >
                      {table.status}
                    </span>

                    {/* Edit/Delete Buttons */}
                    <div className="flex justify-center gap-2 mt-4">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEdit(table)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDelete(table.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </main>
      </div>

      {/* Add / Edit Modal */}
      <UpdateDataForm
        initialData={activeTable}
        fields={fields}
        isOpen={modalOpen}
        onCancel={() => setModalOpen(false)}
        onSave={handleSave}
      />
      <AIChatbot section="tables" context="Table management page" />
    </SidebarProvider>
  );
}
