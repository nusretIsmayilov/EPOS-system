import { useEffect, useState, useRef } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

export default function AddInventoryForm({ isOpen, onCancel, onSave, initialData }: any) {
  const [formData, setFormData] = useState<any>(initialData || {});
  const [units, setUnits] = useState<any[]>([]);
  const formRef = useRef<HTMLFormElement>(null);

  const isEditMode = !!initialData?.id; // 🔹 eğer id varsa, edit modundayız

  useEffect(() => {
    const fetchUnits = async () => {
      const { data, error } = await supabase.from("units").select("*");
      if (error) console.error("Error fetching units:", error);
      else setUnits(data || []);
    };
    fetchUnits();
  }, []);

  useEffect(() => {
    if (isOpen) setFormData(initialData || {});
  }, [isOpen, initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.item_name || !formData.unit) {
      alert("Please fill in all required fields.");
      return;
    }

    let error;

    if (isEditMode) {
      // 🔹 GÜNCELLEME (UPDATE)
      const { error: updateError } = await supabase
        .from("inventory")
        .update({
          item_name: formData.item_name,
          category: formData.category,
          current_stock: Number(formData.current_stock),
          min_stock: Number(formData.min_stock),
          unit: formData.unit,
          supplier: formData.supplier,
        })
        .eq("id", formData.id);
      error = updateError;
    } else {
      // 🔹 EKLEME (INSERT)
      const { error: insertError } = await supabase.from("inventory").insert([
        {
          item_name: formData.item_name,
          category: formData.category,
          current_stock: Number(formData.current_stock),
          min_stock: Number(formData.min_stock),
          unit: formData.unit,
          supplier: formData.supplier,
        },
      ]);
      error = insertError;
    }

    if (error) {
      alert("Error saving item: " + error.message);
    } else {
      onSave();
      onCancel();
    }
  };

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (formRef.current && !formRef.current.contains(e.target as Node)) {
      onCancel();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={handleOverlayClick}
    >
      <form
        ref={formRef}
        onSubmit={handleSubmit}
        className="flex flex-col gap-5 w-full max-w-md bg-white rounded-2xl p-6 overflow-y-auto max-h-[90vh]"
      >
        <h2 className="text-xl font-bold text-center">
          {isEditMode ? "Edit Inventory Item" : "Add Inventory Item"}
        </h2>

        {/* Item Name */}
        <div>
          <Label htmlFor="item_name">Item Name *</Label>
          <Input
            id="item_name"
            name="item_name"
            type="text"
            value={formData.item_name || ""}
            onChange={handleChange}
            required
            className="bg-gray-100"
          />
        </div>

        {/* Category */}
        <div>
          <Label htmlFor="category">Category</Label>
          <Input
            id="category"
            name="category"
            type="text"
            value={formData.category || ""}
            onChange={handleChange}
            className="bg-gray-100"
          />
        </div>

        {/* Current Stock */}
        <div>
          <Label htmlFor="current_stock">Current Stock</Label>
          <Input
            id="current_stock"
            name="current_stock"
            type="number"
            value={formData.current_stock || ""}
            onChange={handleChange}
            className="bg-gray-100"
          />
        </div>

        {/* Min Stock */}
        <div>
          <Label htmlFor="min_stock">Min Stock</Label>
          <Input
            id="min_stock"
            name="min_stock"
            type="number"
            value={formData.min_stock || ""}
            onChange={handleChange}
            className="bg-gray-100"
          />
        </div>

        {/* Unit (Select from Supabase) */}
        <div>
          <Label htmlFor="unit">Unit *</Label>
          <Select
            value={formData.unit || ""}
            onValueChange={(val) => setFormData({ ...formData, unit: val })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a unit" />
            </SelectTrigger>
            <SelectContent className="bg-white">
              {units.length === 0 ? (
                <div className="p-2 text-sm text-gray-500">No units found</div>
              ) : (
                units.map((u: any) => (
                  <SelectItem key={u.id} value={u.unit_name || u.name || u.label}>
                    {u.unit_name || u.name || u.label}
                  </SelectItem>
                ))
              )}
            </SelectContent>
          </Select>
        </div>

        {/* Supplier */}
        <div>
          <Label htmlFor="supplier">Supplier</Label>
          <Input
            id="supplier"
            name="supplier"
            type="text"
            value={formData.supplier || ""}
            onChange={handleChange}
            className="bg-gray-100"
          />
        </div>

        {/* Buttons */}
        <div className="flex justify-between gap-3 mt-4">
          <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
            Cancel
          </Button>
          <Button type="submit" className="flex-1">
            {isEditMode ? "Update" : "Save"}
          </Button>
        </div>
      </form>
    </div>
  );
}
