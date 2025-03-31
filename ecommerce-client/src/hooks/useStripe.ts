import { useState } from "react";
import { createStripeHosted, fetchStripeSession } from "../services/stripeService";
import { ICustomers } from "../models/ICustomers"
import { ILineItem } from "../models/IStripe";


export function useStripeHosted() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleStripeHosted = async (
    line_items: ILineItem[], 
    customer: Omit<ICustomers, "id" | "created_at">
  ) => {
    try {
      setLoading(true);
      setError(null);

      const checkoutSession = await createStripeHosted(line_items, customer);

      if (checkoutSession?.checkout_url) {
        window.location.href = checkoutSession.checkout_url;
        return checkoutSession;
      }
    } catch (error) {
      console.error("Failed to create a checkout session:", error);
      setError("Failed to create a checkout session.");
    } finally {
      setLoading(false);
    }
  };

  const handleFetchStripeSession = async (sessionId: string) => {
    try {
      setLoading(true);
      setError(null);

      const session = await fetchStripeSession(sessionId);
      return session;
    } catch (error) {
      console.error("Failed to fetch Stripe session:", error);
      setError("Failed to fetch Stripe session.");
    } finally {
      setLoading(false);
    }
  };

  return { handleStripeHosted, handleFetchStripeSession, loading, error };
};