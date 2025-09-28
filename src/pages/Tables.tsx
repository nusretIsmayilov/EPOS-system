import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Users } from "lucide-react";
import AddTableForm from "@/components/AddTableForm";

export default function Tables() {
  const [tables, setTables] = useState<any[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);

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
  }

  async function addTable(data: any) {
    const { error } = await supabase.from("tables").insert(data);
    if (!error) {
      await fetchTables();
      setShowAddForm(false);
    } else {
      alert(error.message);
    }
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
                <p className="text-muted-foreground">Manage restaurant tables and seating</p>
              </div>
            </div>
            <Button onClick={() => setShowAddForm(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Table
            </Button>
          </PageHeader>

          <div className="flex-1 p-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {tables.map((table) => (
                <Card key={table.id} className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardHeader className="text-center">
                    <CardTitle className="text-2xl font-bold">{table.number}</CardTitle>
                    <p className="text-sm text-muted-foreground">{table.location}</p>
                  </CardHeader>
                  <CardContent className="text-center space-y-3">
                    <div className="flex items-center justify-center gap-2">
                      <Users className="w-4 h-4" />
                      <span>{table.capacity} seats</span>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(table.status)}`}
                    >
                      {table.status}
                    </span>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </main>
      </div>

      {/* Modal Form */}
      <AddTableForm
        isOpen={showAddForm}
        onSave={addTable}
        onCancel={() => setShowAddForm(false)}
      />
    </SidebarProvider>
  );
}
