"use client";

import { useEffect, useRef, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface MenuItem {
  item_id: string;
  quantity: number;
  name?: string;
}

export default function AddMenuSetModal({
  isOpen,
  onClose,
  onSave,
  initialData,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
  initialData?: any; // ✔ Edit desteklemek için eklendi
}) {
  const modalRef = useRef<HTMLDivElement>(null);

  const [menuName, setMenuName] = useState("");
  const [menuPrice, setMenuPrice] = useState("");
  const [status, setStatus] = useState("Active");

  const [items, setItems] = useState<any[]>([]);
  const [selectedItems, setSelectedItems] = useState<MenuItem[]>([]);

  // Load menu items + initialData (edit mode)
  useEffect(() => {
    if (!isOpen) return;

    const loadData = async () => {
      // Load all available menu items
      const { data } = await supabase.from("menu_items").select("*");
      setItems(data || []);

      // If editing
      if (initialData) {
        setMenuName(initialData.name);
        setMenuPrice(String(initialData.price));
        setStatus(initialData.status);

        // Load selected items for edit mode
        const selected = initialData.items?.map((i: any) => ({
          item_id: i.item_id,
          quantity: i.quantity,
        })) || [];

        setSelectedItems(selected);
      } else {
        // Add mode → reset
        setMenuName("");
        setMenuPrice("");
        setStatus("Active");
        setSelectedItems([]);
      }
    };

    loadData();
  }, [isOpen, initialData]);

  const toggleItem = (item: any) => {
    const exists = selectedItems.find((i) => i.item_id === item.id);

    if (exists) {
      setSelectedItems((prev) => prev.filter((i) => i.item_id !== item.id));
    } else {
      setSelectedItems((prev) => [
        ...prev,
        { item_id: item.id, quantity: 1 },
      ]);
    }
  };

  const updateQuantity = (itemId: string, qty: number) => {
    setSelectedItems((prev) =>
      prev.map((i) => (i.item_id === itemId ? { ...i, quantity: qty } : i))
    );
  };

  const handleSave = () => {
    if (!menuName || !menuPrice || selectedItems.length === 0) {
      alert("Please fill all fields and select at least one item.");
      return;
    }

    onSave({
      name: menuName,
      price: Number(menuPrice),
      status,
      items: selectedItems,
    });

    onClose();
  };

  if (!isOpen) return null;
  // Check if form has any changes
const hasChanges = () => {
  if (initialData) {
    // EDIT MODE
    const edited =
      initialData.name !== menuName ||
      String(initialData.price) !== menuPrice ||
      initialData.status !== status ||
      JSON.stringify(initialData.items) !== JSON.stringify(selectedItems);

    return edited;
  }

  // ADD MODE
  return (
    menuName !== "" ||
    menuPrice !== "" ||
    selectedItems.length > 0
  );
};

// HANDLE CLICK OUTSIDE
const handleOverlayClick = (e: any) => {
  if (modalRef.current && !modalRef.current.contains(e.target)) {
    if (hasChanges()) {
      const confirmExit = window.confirm(
        "You have unsaved changes. Do you want to close without saving?"
      );
      if (!confirmExit) return;
    }
    onClose();
  }
};


  return (
    <div
  className="fixed inset-0 bg-black/40 flex justify-center items-center z-50"
  onClick={handleOverlayClick}
>

      <div
        ref={modalRef}
        className="w-[600px] bg-white p-6 rounded-xl shadow-xl max-h-[90vh] overflow-y-auto"
      >
        <h2 className="text-xl font-bold mb-4">
          {initialData ? "Edit Menu Set" : "Create Menu Set"}
        </h2>

        {/* Menu Name */}
        <Label>Menu Name</Label>
        <Input
          className="mb-4"
          value={menuName}
          onChange={(e) => setMenuName(e.target.value)}
        />

        {/* Price */}
        <Label>Total Price</Label>
        <Input
          className="mb-4"
          type="number"
          value={menuPrice}
          onChange={(e) => setMenuPrice(e.target.value)}
        />

        {/* Status */}
        <Label>Status</Label>
        <select
          className="border rounded-lg p-2 mb-4 w-full"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option>Active</option>
          <option>Inactive</option>
        </select>

        {/* Items */}
        <h3 className="text-lg font-semibold mt-4 mb-2">Select Items</h3>

        <div className="grid grid-cols-2 gap-3">
          {items.map((item) => {
            const selected = selectedItems.find((i) => i.item_id === item.id);

            return (
              <div
                key={item.id}
                className={`border p-3 rounded-lg ${
                  selected ? "bg-green-100" : ""
                }`}
              >
                <div className="flex justify-between items-center">
                  <span>{item.name}</span>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => toggleItem(item)}
                  >
                    {selected ? "Remove" : "Add"}
                  </Button>
                </div>

                {selected && (
                  <div className="mt-2 flex items-center gap-2">
                    <span className="text-sm">Qty:</span>
                    <input
                      type="number"
                      className="border rounded p-1 w-16"
                      min={1}
                      value={selected.quantity}
                      onChange={(e) =>
                        updateQuantity(item.id, Number(e.target.value))
                      }
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="flex justify-end gap-2 mt-6">
          <Button onClick={onClose} variant="outline">
            Cancel
          </Button>

          <Button onClick={handleSave}>
            {initialData ? "Save Changes" : "Create Menu"}
          </Button>
        </div>
      </div>
    </div>
  );
}
