import api from "../api/axios";

export async function createStripeHosted(line_items: any, customerData: any) {
    try {
        const response = await api.post("/stripe/create-checkout-session-hosted", { line_items, customer: customerData });
        return response.data;
    } catch (error) {
        console.error("Something went wrong with Stripe checkout:", error);
        throw new Error("Stripe request failed.");
    }
}

export async function fetchStripeSession(sessionId: string) {
    try {
        const response = await api.get(`/stripe/stripe-session/${sessionId}`);
        return response.data;
    } catch (err) {
        console.error("Error fetching Stripe session:", err);
        throw new Error("Stripe session fetch failed.");
    }
};