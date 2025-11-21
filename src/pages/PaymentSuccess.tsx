"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export default function PaymentSuccess() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 🚫 Strict Mode ve double render engelleme
    if (localStorage.getItem("payment_processed") === "true") {
      console.log("⛔ Order already processed — skipping duplicate call.");
      return;
    }
    localStorage.setItem("payment_processed", "true");

    const saveOrder = async () => {
      try {
        // CART VERİSİ
        const cartString = localStorage.getItem("stripe_checkout_session");
        if (!cartString) return;

        const cart = JSON.parse(cartString);

        // MASA
        const urlParams = new URLSearchParams(window.location.search);
        const table = urlParams.get("table") ?? "POS";

        // TOTAL
        const total = cart.reduce(
          (sum: number, item: any) => sum + item.price * item.quantity,
          0
        );

        // USER
        const { data: userData } = await supabase.auth.getUser();
        const user = userData?.user;

        let fullName = "Customer";

        if (user) {
          const { data: profile } = await supabase
            .from("profiles")
            .select("full_name")
            .eq("user_id", user.id)
            .single();

          if (profile?.full_name) fullName = profile.full_name;
        }

        // 🔥 1) ORDER EKLE
        const { data: insertedOrder, error: orderErr } = await supabase
          .from("orders")
          .insert([
            {
              customer_name: fullName,
              table: table,
              status: "Pending",
              time: new Date().toLocaleTimeString(),
              total: total,
            },
          ])
          .select()
          .single();

        if (orderErr || !insertedOrder) {
          console.error("Order insert error:", orderErr);
          return;
        }

        // 🔥 2) ORDER ITEMS
        const itemsPayload = cart.map((item: any) => ({
          order_id: insertedOrder.id,
          menu_item_id: item.isSet ? null : item.id,
          menu_set_id: item.isSet ? item.id : null,
          quantity: item.quantity,
          unit_price: item.price,
          total_price: item.price * item.quantity,
        }));

        const { error: itemsErr } = await supabase
          .from("order_items")
          .insert(itemsPayload);

        if (itemsErr) {
          console.error("Order items error:", itemsErr);
          return;
        }

        // 🔥 3) STOK DÜŞ
        for (const item of cart) {
          if (!item.isSet) {
            const { error: invErr } = await supabase.rpc(
              "decrease_inventory_for_menu_item",
              {
                p_menu_item_id: item.id,
                p_qty: item.quantity,
              }
            );

            if (invErr) console.error("Inventory update error:", invErr);
          }
        }

        // CART Temizle
        localStorage.removeItem("stripe_checkout_session");
      } catch (err) {
        console.error("PaymentSuccess error:", err);
      } finally {
        setLoading(false);

        // Lock temizle ve redirect
        setTimeout(() => {
          localStorage.removeItem("payment_processed");
          window.location.href = "/pos";
        }, 1200);
      }
    };

    saveOrder();
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center p-6">
      <div className="bg-green-100 text-green-600 rounded-full p-6 mb-4 shadow-lg">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-16 w-16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M5 13l4 4L19 7" />
        </svg>
      </div>

      <h1 className="text-3xl font-bold text-green-700 mb-2">
        Payment Successful!
      </h1>

      <p className="text-gray-600 text-lg">
        Your order has been recorded. Updating inventory...
      </p>
    </div>
  );
}
