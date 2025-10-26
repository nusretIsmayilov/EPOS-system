import { useState, useEffect, useRef } from "react";
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

type MenuItem = {
  name: string;
  price: number;
};

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
  const [formData, setFormData] = useState<any>(
    initialData || {
      customer: "",
      table: "",
      items: [],
      total: "",
      status: "Pending",
      time: "",
    }
  );

  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    setFormData(
      initialData || {
        customer: "",
        table: "",
        items: [],
        total: "",
        status: "Pending",
        time: "",
      }
    );
  }, [initialData, isOpen]);

  const handleCheckboxChange = (itemName: string, checked: boolean) => {
    setFormData((prev: any) => {
      const current = prev.items || [];
      const newItems = checked
        ? [...current, itemName]
        : current.filter((v: string) => v !== itemName);

      const totalPrice = menuItems
        .filter((item) => newItems.includes(item.name))
        .reduce((sum, item) => sum + (item.price || 0), 0);

      return { ...prev, items: newItems, total: `${totalPrice}$` };
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onCancel();
  };

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (formRef.current && !formRef.current.contains(e.target as Node))
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
        className="flex flex-col gap-[20px] w-[550px] h-[520px] bg-white space-y-3.5 rounded-[20px] pt-4 overflow-y-auto p-10"
      >
        {/* Customer */}
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

        {/* Table */}
        <div className="w-[450px] mx-auto">
          <Label>Table</Label>
          <Input
            name="table"
            placeholder="Table (e.g. T1, Delivery)"
            value={formData.table}
            onChange={handleChange}
            className="bg-gray-200"
          />
        </div>

        {/* Items */}
        <div className="w-[450px] mx-auto">
          <Label>Items</Label>
          <div className="flex flex-col gap-2 bg-gray-100 rounded-md p-3 max-h-[150px] overflow-y-auto">
            {menuItems.map((item, i) => (
              <label key={i} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.items.includes(item.name)}
                  onChange={(e) =>
                    handleCheckboxChange(item.name, e.target.checked)
                  }
                />
                <span>
                  {item.name} — <strong>{item.price}$</strong>
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Total */}
        <div className="w-[450px] mx-auto">
          <Label>Total</Label>
          <Input
            name="total"
            placeholder="Total"
            value={formData.total}
            readOnly
            className="bg-gray-200 cursor-not-allowed"
          />
        </div>

        {/* Status */}
        <div className="w-[450px] mx-auto">
          <Label>Status</Label>
          <Select
            value={formData.status}
            onValueChange={(val) =>
              setFormData((prev: any) => ({ ...prev, status: val }))
            }
          >
            <SelectTrigger className="bg-gray-200">
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent className="bg-white">
              <SelectItem value="Pending">Pending</SelectItem>
              <SelectItem value="Preparing">Preparing</SelectItem>
              <SelectItem value="Ready">Ready</SelectItem>
              <SelectItem value="Delivered">Delivered</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Time */}
        <div className="w-[450px] mx-auto">
          <Label>Time</Label>
          <Input
            name="time"
            placeholder="e.g. 10 mins ago"
            value={formData.time}
            onChange={handleChange}
            className="bg-gray-200"
          />
        </div>

        <Button onClick={onCancel} className="text-black bg-white" type="button">
          Cancel
        </Button>
        <Button type="submit">Save</Button>
      </form>
    </div>
  );
}
