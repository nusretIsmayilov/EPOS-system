import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface MenuItem {
  id: string;
  name: string;
  price: number;
}

interface AddOrderFormProps {
  isOpen: boolean;
  onSave: (data: any) => void;
  onCancel: () => void;
  menuItems: MenuItem[];
  initialData?: any;
}

export default function AddOrderForm({
  onSave,
  onCancel,
  isOpen,
  menuItems,
  initialData,
}: AddOrderFormProps) {
  const [formData, setFormData] = useState<any>({
    customer: "",
    table: "",
    items: [],
    total: 0,
    status: "Pending",
    time: "",
  });

  const formRef = useRef<HTMLFormElement>(null);

  // Reset when opened
  useEffect(() => {
    if (initialData) {
      const convertedItems = initialData.order_items.map((oi: any) => {
        const menu = menuItems.find((m) => m.id === oi.menu_item_id);

        return {
          id: menu?.id || oi.menu_item_id,
          name: menu?.name || "Unknown Item",
          price: menu?.price || oi.unit_price,
          quantity: oi.quantity,
        };
      });

      setFormData({
        customer: initialData.customer_name,
        table: initialData.table,
        items: convertedItems,
        total: initialData.total,
        status: initialData.status,
        time: initialData.time,
      });
    } else {
      setFormData({
        customer: "",
        table: "",
        items: [],
        total: 0,
        status: "Pending",
        time: new Date().toLocaleTimeString(),
      });
    }
  }, [initialData, menuItems, isOpen]);



  // Handle overlay click
  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (formRef.current && !formRef.current.contains(e.target as Node)) {
      onCancel();
    }
  };

  // Add quantity
  const increaseQty = (item: MenuItem) => {
    setFormData((prev: any) => {
      const exists = prev.items.find((x: any) => x.id === item.id);

      let updatedItems;
      if (exists) {
        updatedItems = prev.items.map((x: any) =>
          x.id === item.id ? { ...x, quantity: x.quantity + 1 } : x
        );
      } else {
        updatedItems = [
          ...prev.items,
          {
            id: item.id,
            name: item.name,
            price: item.price,
            quantity: 1,
            isSet: item.isSet || false,
          },
        ];
      }

      const newTotal = updatedItems.reduce(
        (sum: number, i: any) => sum + i.price * i.quantity,
        0
      );

      return { ...prev, items: updatedItems, total: newTotal };
    });
  };

  // Decrease quantity
  const decreaseQty = (item: MenuItem) => {
    setFormData((prev: any) => {
      const exists = prev.items.find((x: any) => x.id === item.id);
      if (!exists) return prev;

      let updatedItems;
      if (exists.quantity <= 1) {
        updatedItems = prev.items.filter((x: any) => x.id !== item.id);
      } else {
        updatedItems = prev.items.map((x: any) =>
          x.id === item.id ? { ...x, quantity: x.quantity - 1 } : x
        );
      }

      const newTotal = updatedItems.reduce(
        (sum: number, i: any) => sum + i.price * i.quantity,
        0
      );

      return { ...prev, items: updatedItems, total: newTotal };
    });
  };

  const handleChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();

    // items MUST be: [{id, price, quantity}]
    const cleaned = {
      ...formData,
      items: formData.items.map((i: any) => ({
  id: i.id,
  price: i.price,
  quantity: i.quantity,
  isSet: i.isSet || false,   // ⭐ MUTLAKA eklenmeli
}))
,
    };

    onSave(cleaned);
    onCancel();
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      onClick={handleOverlayClick}
    >
      <form
        ref={formRef}
        onSubmit={handleSubmit}
        className="flex flex-col gap-[20px] w-[550px] max-h-[90vh] bg-white rounded-[20px] p-10 overflow-y-auto"
      >
        {/* CUSTOMER */}
        <div className="w-[450px] mx-auto">
          <Label>Customer</Label>
          <Input
            name="customer"
            placeholder="Customer name"
            value={formData.customer}
            onChange={handleChange}
            className="bg-gray-200"
          />
        </div>

        {/* TABLE */}
        <div className="w-[450px] mx-auto">
          <Label>Table</Label>
          <Input
            name="table"
            placeholder="Table (e.g. T1)"
            value={formData.table}
            onChange={handleChange}
            className="bg-gray-200"
          />
        </div>

        {/* MENU ITEMS */}
        <div className="w-[450px] mx-auto">
          <Label>Select Items</Label>

          <div className="flex flex-col gap-3 bg-gray-100 rounded-md p-3 max-h-[250px] overflow-y-auto">
            {menuItems.map((item) => {
              const exists = formData.items.find((x: any) => x.id === item.id);
              const qty = exists?.quantity || 0;

              return (
                <div
                  key={item.id}
                  className="flex justify-between items-center"
                >
                  <span>
                    {item.name} — <strong>{item.price}$</strong>
                  </span>

                  <div className="flex items-center gap-2">
                    <Button type="button" onClick={() => decreaseQty(item)}>
                      -
                    </Button>

                    <span className="w-6 text-center">{qty}</span>

                    <Button type="button" onClick={() => increaseQty(item)}>
                      +
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* TOTAL */}
        <div className="w-[450px] mx-auto">
          <Label>Total</Label>
          <Input
            readOnly
            value={formData.total}
            className="bg-gray-200 cursor-not-allowed"
          />
        </div>

        {/* STATUS */}
        <div className="w-[450px] mx-auto">
          <Label>Status</Label>
          <Input
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="bg-gray-200"
          />
        </div>

        {/* TIME */}
        <div className="w-[450px] mx-auto">
          <Label>Time</Label>
          <Input
            name="time"
            value={formData.time}
            onChange={handleChange}
            className="bg-gray-200"
          />
        </div>

        {/* BUTTONS */}
        <Button type="button" className="text-black bg-white" onClick={onCancel}>
          Cancel
        </Button>

        <Button type="submit">Save</Button>
      </form>
    </div>
  );
}
