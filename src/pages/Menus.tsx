"use client";

import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, Edit } from "lucide-react";
import { useEffect, useState } from "react";
import AddMenuSetModal from "@/components/modals/AddMenuSetModal";
import { supabase } from "@/lib/supabaseClient";
import { AIChatbot } from "@/components/ai/AIChatbot";

export default function Menus() {
  const [menus, setMenus] = useState<any[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingMenu, setEditingMenu] = useState<any>(null);

  // LOAD MENUS
  const loadMenus = async () => {
    const { data, error } = await supabase
      .from("menu_sets")
      .select("*")
      .order("id", { ascending: false });

    if (!error && data) {
      const formatted = await Promise.all(
        data.map(async (menu) => {
          const { count } = await supabase
            .from("menu_set_items")
            .select("*", { count: "exact", head: true })
            .eq("menu_set_id", menu.id);

          return {
            ...menu,
            items: count || 0,
          };
        })
      );

      setMenus(formatted);
    }
  };

  useEffect(() => {
    loadMenus();
  }, []);

  // OPEN ADD MODAL
  const openAddModal = () => {
    setEditingMenu(null);
    setModalOpen(true);
  };

  // OPEN EDIT MODAL
  const openEditModal = async (menu: any) => {
    // ilgili set'in içindeki yemekleri çek
    const { data: items } = await supabase
      .from("menu_set_items")
      .select("*")
      .eq("menu_set_id", menu.id);

    setEditingMenu({
      ...menu,
      items: items || [],
    });

    setModalOpen(true);
  };

  // SAVE (ADD OR EDIT)
  const saveMenuSetToDb = async (data: any) => {
    const { name, price, status, items } = data;

    // 🔹 EDIT MODE
    if (editingMenu) {
      // 1) menu_sets update
      await supabase.from("menu_sets").update({ name, price, status }).eq("id", editingMenu.id);

      // 2) eski item'ları sil
      await supabase.from("menu_set_items").delete().eq("menu_set_id", editingMenu.id);

      // 3) yeni item'ları ekle
      const payload = items.map((i: any) => ({
        menu_set_id: editingMenu.id,
        item_id: i.item_id,
        quantity: i.quantity,
      }));
      await supabase.from("menu_set_items").insert(payload);

      loadMenus();
      return;
    }

    // 🔹 ADD MODE
    const { data: menuSet } = await supabase
      .from("menu_sets")
      .insert([{ name, price, status }])
      .select()
      .single();

    const payload = items.map((i: any) => ({
      menu_set_id: menuSet.id,
      item_id: i.item_id,
      quantity: i.quantity,
    }));

    await supabase.from("menu_set_items").insert(payload);

    loadMenus();
  };

  // DELETE
  const handleDelete = async (id: string) => {
    const confirmDelete = window.confirm("Delete this menu set?");
    if (!confirmDelete) return;

    await supabase.from("menu_sets").delete().eq("id", id);

    setMenus((prev) => prev.filter((m) => m.id !== id));
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
                <h1 className="text-2xl font-bold">Menu Sets</h1>
                <p className="text-muted-foreground">
                  Create and manage your restaurant's set menus
                </p>
              </div>
            </div>

            <Button onClick={openAddModal}>
              <Plus className="w-4 h-4 mr-2" />
              Add Menu
            </Button>
          </PageHeader>

          <div className="flex-1 p-6">

            {/* MODAL */}
            <AddMenuSetModal
              isOpen={modalOpen}
              onClose={() => setModalOpen(false)}
              onSave={saveMenuSetToDb}
              initialData={editingMenu}
            />

            {/* MENU CARDS */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {menus.map((menu) => (
                <Card key={menu.id}>
                  <CardHeader className="flex flex-row justify-between items-center pb-2">
                    <CardTitle className="text-lg font-medium">
                      {menu.name}
                    </CardTitle>

                    {/* Buttons */}
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openEditModal(menu)}
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
                    <p className="text-sm text-muted-foreground">
                      {menu.items} items
                    </p>

                    <div className="mt-2">
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          menu.status === "Active"
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {menu.status}
                      </span>
                    </div>

                    <p className="mt-3 font-bold text-lg">${menu.price}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </main>
      </div>

      <AIChatbot section="menus" context="Menu Sets Page" />
    </SidebarProvider>
  );
}
