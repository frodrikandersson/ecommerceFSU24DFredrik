import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useOrder } from "../hooks/useOrder";
import { useStripeHosted } from "../hooks/useStripe";
import { IStripeLineItem, IStripeLineItems, IStripeProducts, IStripeSession } from "../models/IStripe";
import { useCartContext } from "../contexts/CartContext";
import classes from "./Pages.module.css";

export const Successpage = () => {
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [purchasedItems, setPurchasedItems] = useState<any[]>([]);
  const [customerInfo, setCustomerInfo] = useState<any | null>(null);
  const navigate = useNavigate();
  const { handleUpdateOrder, handleShowOneOrderByPaymentId } = useOrder();
  const { handleFetchStripeSession } = useStripeHosted();
  const { clearCart } = useCartContext();


  useEffect(() => {
    localStorage.removeItem("customerData");
    const sessionId = new URLSearchParams(window.location.search).get("session_id");

    if (sessionId) {
      handleFetchStripeSession(sessionId).then(async (StripeData) => {

        const session: IStripeSession = StripeData.session;
        const lineItems: IStripeLineItems = StripeData.lineItems;
        const products: IStripeProducts = StripeData.products;

        if (session.payment_status === "paid") {

          const orderDetails = {
            payment_status: session.payment_status,
            order_status: "Received",
            payment_id: session.payment_intent,
          };

          const purchasedItems = lineItems.map((lineItem: IStripeLineItem, index: number) => ({
            product_id: products[index]?.metadata.product_id,
            product_name: products[index]?.name,
            product_image: products[index]?.images[0],
            product_description: products[index]?.description,
            quantity: lineItem.quantity,
            unit_price: lineItem.price.unit_amount / 100,
          }));
          
          setPurchasedItems(purchasedItems);

          const customerDetails = session.customer_details;
          const customerData = {
            name: customerDetails.name,
            email: customerDetails.email,
            address: customerDetails.address
              ? `${customerDetails.address.line1}, ${customerDetails.address.city}, ${customerDetails.address.postal_code}, ${customerDetails.address.country}`
              : "No address provided",
          };
          setCustomerInfo(customerData);

          const currentOrderInfo = await handleShowOneOrderByPaymentId(session.id);
          const result = await handleUpdateOrder(currentOrderInfo.id , orderDetails );
          if(result.message == "Order updated") {
            setOrderSuccess(true);
            setLoading(false);

            clearCart();
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
    <div className={classes.successContainer}>
      {orderSuccess ? (
        <div>
          <h1>Order Successful!</h1>
          <p>Thank you for your purchase.</p>

          <div className={classes.customerInfo}>
            <h2>Customer Information</h2>
            <p><strong>Name:</strong> {customerInfo?.name}</p>
            <p><strong>Email:</strong> {customerInfo?.email}</p>
            <p><strong>Address:</strong> {customerInfo?.address}</p>
          </div>

          <div className={classes.purchasedItems}>
            {purchasedItems.map((item, index) => (
              <div key={index} className={classes.itemCard}>
                <img src={item.product_image} alt={item.product_name} className={classes.itemImage} />
                <div className={classes.itemInfo}>
                  <h2 className={classes.itemName}>{item.product_name}</h2>
                  <p className={classes.itemDescription}>{item.product_description}</p>
                  <p className={classes.itemQuantity}>Quantity: {item.quantity}</p>
                  <p className={classes.itemPrice}>${item.unit_price.toFixed(2)} each</p>
                </div>
              </div>
            ))}
          </div>
          <button className={classes.homeButton} onClick={() => navigate("/")}>Go to Home</button>
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