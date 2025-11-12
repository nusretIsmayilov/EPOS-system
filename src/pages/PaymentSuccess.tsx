import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { CheckCircle, Loader2 } from "lucide-react";

export default function PaymentSuccess() {
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const createOrder = async () => {
      const sessionDataString = localStorage.getItem("stripe_checkout_session");
      if (!sessionDataString) {
        console.error("No session data found.");
        setStatus("error");
        return;
      }

      const sessionData = JSON.parse(sessionDataString);

      const items = sessionData.map((data: any) => data.id);
      const total_amount = sessionData.reduce((sum: number, item: any) => sum + (item.price * item.quantity), 0);

      try {
        // Kullanıcı bilgilerini al
        const { data: { user }, error: userError } = await supabase.auth.getUser();
if (userError) throw userError;

const customerName = (user?.user_metadata as any)?.full_name || "Guest";

const { data, error } = await supabase
  .from("orders")
  .insert([
    {
      total: total_amount,
      status: "preparing",
      items: items,
      user_id: user?.id || null,
      customer_name: customerName
    },
  ])
  .select();



        if (error) throw error;

        setStatus("success");
        localStorage.removeItem("stripe_checkout_session");

        setTimeout(() => navigate("/pos"), 3000);
      } catch (error) {
        console.error("Error creating order:", error);
        setStatus("error");
      }
    };

    createOrder();
  }, [location, navigate]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center">
      {status === "loading" && (
        <>
          <Loader2 className="w-12 h-12 animate-spin mb-4" />
          <h1 className="text-2xl font-bold">Processing your order...</h1>
        </>
      )}
      {status === "success" && (
        <>
          <CheckCircle className="w-16 h-16 text-green-500 mb-4" />
          <h1 className="text-3xl font-bold">Payment Successful!</h1>
          <p className="text-muted-foreground">
            Your order has been placed. Redirecting you shortly...
          </p>
        </>
      )}
      {status === "error" && (
        <>
          <h1 className="text-3xl font-bold text-red-500">Error</h1>
          <p className="text-muted-foreground">
            There was an issue creating your order. Please contact support.
          </p>
        </>
      )}
    </div>
  );
}
