import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useOrder } from "../hooks/useOrder";
import { useStripeHosted } from "../hooks/useStripe";
import { IStripeLineItem, IStripeLineItems, IStripeProduct, IStripeProducts, IStripeSession } from "../models/IStripe";

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
      handleFetchStripeSession(sessionId).then(async (StripeData) => {

        const session: IStripeSession = StripeData.session;
        const lineItems: IStripeLineItems = StripeData.lineItems;
        const products: IStripeProducts = StripeData.products;

        if (session.payment_status === "paid") {
          
          const totalPrice = session.amount_total / 100;

          const orderDetails = {
            customer_id: session.metadata.customer_id,
            payment_status: session.payment_status,
            order_status: "processing",
            total_price: totalPrice,
            payment_id: session.payment_intent,
            order_items: lineItems.map((lineItem: IStripeLineItem, index: number) => ({
              product_id: products[index]?.metadata.product_id,
              product_name: products[index]?.name,
              quantity: lineItem.quantity,
              unit_price: lineItem.price.unit_amount / 100,
            })),
          };

          const result = await handleCreateOrder(orderDetails);
          if(result.message == "Product created") {
            setOrderSuccess(true);
            setLoading(false);
          } else {
            setError("Failed to create order");
          }
        } else {
          //else if (session.payment_status === "invoice")
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