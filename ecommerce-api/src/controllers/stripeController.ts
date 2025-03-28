import { Request, Response } from "express";
const stripe = require("stripe")(process.env.STRIPE_SECRET);

export const createStripeHosted = async (req: Request, res: Response) => {
    const { line_items, customer } = req.body;

    if (!customer?.email) {
        return res.status(400).json({ error: "Customer email is required" });
    }

    try {
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            customer_email: customer.email,
            line_items: line_items.map((item: any) => ({
                price_data: {
                    currency: "SEK",
                    product_data: {
                        name: item.price_data.product_data.name,
                        description: item.price_data.product_data.description,
                        images: item.price_data.product_data.images || [],
                    },
                    unit_amount: item.price_data.unit_amount,
                },
                quantity: item.quantity,
            })),
            mode: "payment",
            success_url: "http://localhost:5173/success?session_id={CHECKOUT_SESSION_ID}",
            cancel_url: "http://localhost:5173/cart",
        });

        console.log("Stripe session created:", session);
        res.json({ checkout_url: session.url });
    } catch (error) {
        console.error("Error creating checkout session: ", error);
        res.status(500).json({ error: "Could not create Stripe checkout session", details: error.message });
    }
};

export const getStripeSession = async (req: Request, res: Response) => {
    
    const { sessionId } = req.params;
    console.log(sessionId);
    try {
        if (!sessionId) {
            return res.status(400).json({ error: "Session ID is required" });
        }

        // Retrieve session details from Stripe
        const session = await stripe.checkout.sessions.retrieve(sessionId);

        const lineItems = await stripe.checkout.sessions.listLineItems(sessionId, {
            limit: 100,
        });

        res.json({
            session,
            lineItems: lineItems.data,
        }); 
    } catch (error: any) {
        console.error("Error fetching Stripe session:", error);
        res.status(500).json({ error: "Failed to retrieve Stripe session", details: error.message });
    }
};