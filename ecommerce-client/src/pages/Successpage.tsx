import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { useOrder } from "../hooks/useOrder";
import { useStripeHosted } from "../hooks/useStripe";

export const Successpage = () => {
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { handleCreateOrder} = useOrder();
  const { handleFetchStripeSession } = useStripeHosted();


  useEffect(() => {
    const sessionId = new URLSearchParams(window.location.search).get("session_id");

    if (sessionId) {
      handleFetchStripeSession(sessionId).then(async (session) => {
        if (session.payment_status === "paid") {
          // Assuming session contains relevant order information like cart items, customer details, etc.
          const orderDetails = {
            customer_id: session.customer_id, // Ensure you get the correct customer ID from your session or database
            payment_status: session.payment_status,
            payment_id: session.payment_intent, // Stripe session ID
            order_status: "processing", // Default to "processing"
            order_items: session.line_items.data.map((item: any) => ({
              product_id: item.price.product, // Ensure the correct product ID is retrieved
              product_name: item.description,
              quantity: item.quantity,
              unit_price: item.price.unite_amount / 100, // Convert from cents to currency
            })),
          };

          const result = await handleCreateOrder(orderDetails);
          if(result) {
            setOrderSuccess(true);
          } else {
            setError("Failed to create order");
          }
        } else {
          setError("Jag hann inte med att skapa en order efter en betalning har gjorts..");
          setLoading(false);
        }
      });
    } else {
      setError("No session ID found");
      setLoading(false);
    }
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      {orderSuccess ? (
        <div>
          <h1>Order Successful!</h1>
          <p>Thank you for your purchase.</p>
          <button onClick={() => navigate("/")}>Go to Home</button>
        </div>
      ) : (
        <div>
          <h1>Order Failed</h1>
          <p>{error}</p>
        </div>
      )}
    </div>
  );
};