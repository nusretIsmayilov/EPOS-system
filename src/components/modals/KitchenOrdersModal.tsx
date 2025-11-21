import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface KitchenOrdersModalProps {
  isOpen: boolean;
  onClose: () => void;
  inventory: any[];
}

export default function KitchenOrdersModal({ isOpen, onClose, inventory }: KitchenOrdersModalProps) {
  const [lowStockItems, setLowStockItems] = useState<any[]>([]);

  useEffect(() => {
    if (isOpen && inventory.length > 0) {
      const filtered = inventory
        .filter((item) => item.current_stock < item.min_stock)
        .map((item) => ({
          ...item,
          orderAmount: item.min_stock - item.current_stock, // eksik miktar
        }));
      setLowStockItems(filtered);
    }
  }, [isOpen, inventory]);

  const handleChange = (id: number, value: number) => {
    setLowStockItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, orderAmount: value } : item))
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Kitchen Orders</DialogTitle>
        </DialogHeader>

        {lowStockItems.length === 0 ? (
          <p className="text-sm text-muted-foreground">All items are sufficiently stocked ✅</p>
        ) : (
          <div className="space-y-3">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2">Item</th>
                  <th className="text-right py-2">Missing</th>
                </tr>
              </thead>
              <tbody>
                {lowStockItems.map((item) => (
                  <tr key={item.id} className="border-b">
                    <td className="py-2">{item.item_name}</td>
                    <td className="py-2 text-right">
                      <Input
                        type="number"
                        value={item.orderAmount}
                        min={0}
                        className="w-20 text-right"
                        onChange={(e) =>
                          handleChange(item.id, Number(e.target.value))
                        }
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          {lowStockItems.length > 0 && (
            <Button onClick={() => alert("Orders saved (future action)")}>
              Save Orders
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
