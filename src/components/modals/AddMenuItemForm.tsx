import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type IngredientInput = {
  inventory_id: string;
  quantity: string;
  unit?: string;
};

type MenuItemFormData = {
  name: string;
  price: string;
  description?: string;
  is_available: boolean | string;
  prep_time?: string;
  calories?: string;
  category_id?: string;
  ingredients: IngredientInput[];
};

export default function AddMenuItemForm({
  isOpen,
  onCancel,
  onSave,
  initialData,
}: any) {
  const [formData, setFormData] = useState<MenuItemFormData>({
    name: "",
    price: "",
    description: "",
    is_available: true,
    prep_time: "",
    calories: "",
    category_id: "",
    ingredients: [],
  });

  const [inventoryItems, setInventoryItems] = useState<
    { id: number; item_name: string; unit: string }[]
  >([]);
  const [categories, setCategories] = useState<{ id: number; name: string }[]>([]);

  useEffect(() => {
    const fetchInventory = async () => {
      const { data, error } = await supabase
        .from("inventory")
        .select("id, item_name, unit");
      if (!error && data) setInventoryItems(data);
    };

    const fetchCategories = async () => {
      const { data, error } = await supabase
        .from("item_categories")
        .select("id, name");
      if (!error && data) setCategories(data);
    };

    fetchInventory();
    fetchCategories();
  }, []);

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || "",
        price: String(initialData.price || ""),
        description: initialData.description || "",
        is_available: initialData.is_available ?? true,
        prep_time: String(initialData.prep_time || ""),
        calories: String(initialData.calories || ""),
        category_id: initialData.category_id ? String(initialData.category_id) : "",
        ingredients:
          initialData.ingredients?.map((ing: any) => ({
            inventory_id: String(ing.inventory_id),
            quantity: String(ing.quantity),
            unit: ing.unit || "",
          })) || [],
      });
    } else {
      setFormData({
        name: "",
        price: "",
        description: "",
        is_available: true,
        prep_time: "",
        calories: "",
        category_id: "",
        ingredients: [],
      });
    }
  }, [initialData, isOpen]);

  const handleAddIngredient = () => {
    setFormData((prev) => ({
      ...prev,
      ingredients: [...prev.ingredients, { inventory_id: "", quantity: "", unit: "" }],
    }));
  };

  const handleIngredientChange = (
    index: number,
    field: keyof IngredientInput,
    value: any
  ) => {
    setFormData((prev) => {
      const updated = [...prev.ingredients];
      updated[index] = { ...updated[index], [field]: value };

      if (field === "inventory_id") {
        const selected = inventoryItems.find((i) => String(i.id) === value);
        updated[index].unit = selected?.unit || "";
      }

      return { ...prev, ingredients: updated };
    });
  };

  const handleRemoveIngredient = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      ingredients: prev.ingredients.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const isEdit = !!initialData?.id;
    let menuItemId = initialData?.id;

    try {
      if (isEdit) {
        const { error } = await supabase
          .from("menu_items")
          .update({
            name: formData.name,
            price: Number(formData.price),
            description: formData.description,
            is_available:
              formData.is_available === "true" || formData.is_available === true,
            prep_time: formData.prep_time ? Number(formData.prep_time) : null,
            calories: formData.calories ? Number(formData.calories) : null,
            category_id: formData.category_id ? Number(formData.category_id) : null,
          })
          .eq("id", menuItemId);

        if (error) throw error;

        await supabase.from("menu_item_ingredients").delete().eq("menu_item_id", menuItemId);
      } else {
        const { data, error } = await supabase
          .from("menu_items")
          .insert([
            {
              name: formData.name,
              price: Number(formData.price),
              description: formData.description,
              is_available:
                formData.is_available === "true" || formData.is_available === true,
              prep_time: formData.prep_time ? Number(formData.prep_time) : null,
              calories: formData.calories ? Number(formData.calories) : null,
              category_id: formData.category_id ? Number(formData.category_id) : null,
            },
          ])
          .select("id")
          .single();

        if (error) throw error;
        menuItemId = data.id;
      }

      if (formData.ingredients.length > 0 && menuItemId) {
        const insertData = formData.ingredients
          .filter((i) => i.inventory_id && i.quantity)
          .map((i) => ({
            menu_item_id: menuItemId,
            inventory_id: i.inventory_id,
            quantity: Number(i.quantity),
          }));
        await supabase.from("menu_item_ingredients").insert(insertData);
      }

      onSave();
    } catch (err) {
      alert("Error saving menu item");
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/40 flex justify-center items-center z-50 p-4"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onCancel();
      }}
    >
      <form
        onClick={(e) => e.stopPropagation()}
        onSubmit={handleSubmit}
        className="bg-white rounded-2xl p-6 w-full max-w-2xl space-y-4"
      >
        <h2 className="text-xl font-semibold">
          {initialData ? "Edit Menu Item" : "Add Menu Item"}
        </h2>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Name</Label>
            <Input
              value={formData.name}
              onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))}
            />
          </div>
          <div>
            <Label>Price</Label>
            <Input
              type="number"
              value={formData.price}
              onChange={(e) => setFormData((p) => ({ ...p, price: e.target.value }))}
            />
          </div>
          <div>
            <Label>Preparation Time</Label>
            <Input
              type="number"
              value={formData.prep_time}
              onChange={(e) => setFormData((p) => ({ ...p, prep_time: e.target.value }))}
            />
          </div>
          <div>
            <Label>Calories</Label>
            <Input
              type="number"
              value={formData.calories}
              onChange={(e) => setFormData((p) => ({ ...p, calories: e.target.value }))}
            />
          </div>
        </div>

        <div>
          <Label>Description</Label>
          <Input
            value={formData.description}
            onChange={(e) =>
              setFormData((p) => ({ ...p, description: e.target.value }))
            }
          />
        </div>

        <div>
          <Label>Availability</Label>
          <Select
            value={String(formData.is_available)}
            onValueChange={(v) => setFormData((p) => ({ ...p, is_available: v }))}
          >
            <SelectTrigger className="bg-white">
              <SelectValue placeholder="Select availability" />
            </SelectTrigger>
            <SelectContent className="bg-white text-black dark:bg-gray-800 dark:text-white border border-gray-200 shadow-lg rounded-lg z-[9999]">
              <SelectItem value="true">Available</SelectItem>
              <SelectItem value="false">Out of Stock</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>Category (from item_categories)</Label>
          <Select
            value={formData.category_id}
            onValueChange={(v) => setFormData((p) => ({ ...p, category_id: v }))}
          >
            <SelectTrigger className="bg-white">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent className="bg-white text-black dark:bg-gray-800 dark:text-white border border-gray-200 shadow-lg rounded-lg z-[9999]">
              {categories.map((cat) => (
                <SelectItem key={cat.id} value={String(cat.id)}>
                  {cat.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <div className="flex justify-between items-center mb-2">
            <Label>Ingredients</Label>
            <Button type="button" variant="outline" onClick={handleAddIngredient}>
              + Add Ingredient
            </Button>
          </div>

          <div className="space-y-2">
            {formData.ingredients.map((ing, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <Select
                  value={ing.inventory_id}
                  onValueChange={(val) =>
                    handleIngredientChange(idx, "inventory_id", val)
                  }
                >
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="Select ingredient" />
                  </SelectTrigger>
                  <SelectContent className="bg-white text-black dark:bg-gray-800 dark:text-white border border-gray-200 shadow-lg rounded-lg z-[9999]">
                    {inventoryItems.map((inv) => (
                      <SelectItem key={inv.id} value={String(inv.id)}>
                        {inv.item_name} ({inv.unit})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Input
                  type="number"
                  placeholder="Qty"
                  className="w-24"
                  value={ing.quantity}
                  onChange={(e) =>
                    handleIngredientChange(idx, "quantity", e.target.value)
                  }
                />
                <span className="text-sm text-gray-600">{ing.unit}</span>
                <Button
                  type="button"
                  variant="destructive"
                  onClick={() => handleRemoveIngredient(idx)}
                >
                  X
                </Button>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">Save</Button>
        </div>
      </form>
    </div>
  );
}
