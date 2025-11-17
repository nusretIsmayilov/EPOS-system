"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export default function PaymentSuccess() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const saveOrder = async () => {
      try {
        // ---------------------------
        // 1) CART verisini al
        // ---------------------------
        const cartString = localStorage.getItem("stripe_checkout_session");
        if (!cartString) return;

        const cart = JSON.parse(cartString);
        const total = cart.reduce(
          (sum: number, item: any) => sum + item.price * item.quantity,
          0
        );

        // ---------------------------
        // 2) Login olan kullanıcıyı al
        // ---------------------------
        const {
          data: { user },
        } = await supabase.auth.getUser();

        let fullName = "Unknown Customer";

        if (user) {
          // ---------------------------
          // 3) profiles tablosundan full_name al
          // ---------------------------
          const { data: profile } = await supabase
            .from("profiles")
            .select("full_name")
            .eq("user_id", user.id)
            .single();

          if (profile?.full_name) {
            fullName = profile.full_name;
          }
        }

        // ---------------------------
        // 4) orders tablosuna ekle
        // ---------------------------
        const { data: order, error: orderErr } = await supabase
          .from("orders")
          .insert([
            {
              customer_name: fullName,
              table: "POS",
              status: "Pending",
              time: new Date().toLocaleTimeString(),
              total,
            },
          ])
          .select()
          .single();

        if (orderErr) {
          console.error("Order insert error:", orderErr);
          return;
        }

        // ---------------------------
        // 5) order_items tablosuna ekle
        // ---------------------------
        const orderItemsPayload = cart.map((item: any) => ({
          order_id: order.id,
          menu_item_id: item.isSet ? null : item.id,
          menu_set_id: item.isSet ? item.id : null,
          quantity: item.quantity,
          unit_price: item.price,
          total_price: item.price * item.quantity,
        }));

        const { error: itemErr } = await supabase
          .from("order_items")
          .insert(orderItemsPayload);

        if (itemErr) {
          console.error("Order items insert error:", itemErr);
        }

        // ---------------------------
        // 6) LocalStorage temizle
        // ---------------------------
        localStorage.removeItem("stripe_checkout_session");
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);

        setTimeout(() => {
          window.location.href = "/pos";
        }, 1500);
      }
    };

    saveOrder();
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center p-6">
      <div className="bg-green-100 text-green-600 rounded-full p-6 mb-4 animate-bounce shadow-lg">
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
        Your order has been recorded.
      </p>
    </div>
  );
}
