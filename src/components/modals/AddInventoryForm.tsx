import UpdateDataForm from "@/components/modals/UpdateDataForm";
import { supabase } from "@/lib/supabase";

export default function AddInventoryForm({ isOpen, onCancel, onSave }: any) {
  const handleAdd = async (data: any) => {
    const { error } = await supabase.from("inventory").insert([
      {
        item_name: data.item_name,
        category: data.category,
        current_stock: Number(data.current_stock),
        min_stock: Number(data.min_stock),
        unit: data.unit,
        supplier: data.supplier,
      },
    ]);

    if (error) alert("Error adding item: " + error.message);
    else onSave();
  };

  return (
    <UpdateDataForm
      isOpen={isOpen}
      onCancel={onCancel}
      onSave={handleAdd}
      fields={[
        { id: 1, label: "Item Name", name: "item_name", type: "text", isRequired: true },
        { id: 2, label: "Category", name: "category", type: "text" },
        { id: 3, label: "Current Stock", name: "current_stock", type: "number" },
        { id: 4, label: "Min Stock", name: "min_stock", type: "number" },
        { id: 5, label: "Unit", name: "unit", type: "text" },
        { id: 6, label: "Supplier", name: "supplier", type: "text" },
      ]}
    />
  );
}
