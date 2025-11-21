import { supabase } from "@/integrations/supabase/client";

/**
 * Sipariş kaydedildikten sonra çağrılır.
 * orderItems: [{ id: string, quantity: number }]
 */
export async function updateInventoryAfterOrder(orderItems: { id: string; quantity: number }[]) {
  try {
    // 1️⃣ Bütün malzeme bağlantılarını çek (menu_item_ingredients tablosu)
    const { data: allIngredients, error: ingError } = await supabase
      .from("menu_item_ingredients")
      .select("menu_item_id, inventory_id, quantity");

    if (ingError) throw ingError;

    // 2️⃣ Hangi stoktan ne kadar düşüleceğini hesapla
    const totalUsage: Record<string, number> = {};

    for (const item of orderItems) {
      const ingredients = allIngredients?.filter((ing) => ing.menu_item_id === item.id);
      if (!ingredients?.length) continue;

      for (const ing of ingredients) {
        const totalQty = (ing.quantity || 0) * item.quantity;
        totalUsage[ing.inventory_id] = (totalUsage[ing.inventory_id] || 0) + totalQty;
      }
    }

    // 3️⃣ Stokları güncelle
    for (const [inventoryId, usedQty] of Object.entries(totalUsage)) {
      const { data: invItem, error: fetchErr } = await supabase
        .from("inventory")
        .select("current_stock")
        .eq("id", inventoryId)
        .single();

      if (fetchErr || !invItem) continue;

      const newStock = Math.max(0, (invItem.current_stock || 0) - usedQty);

      const { error: updateErr } = await supabase
        .from("inventory")
        .update({ current_stock: newStock })
        .eq("id", inventoryId);

      if (updateErr) console.error("Stok güncelleme hatası:", updateErr);
    }

    console.log("✅ Inventory başarıyla güncellendi.");
  } catch (err) {
    console.error("❌ updateInventoryAfterOrder hatası:", err);
  }
}
