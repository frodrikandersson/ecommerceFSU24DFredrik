import express from "express";
import { createStripeHosted, getStripeSession } from "../controllers/stripeController.ts";
const router = express.Router();

router.post("/create-checkout-session-hosted", createStripeHosted);
router.get("/stripe-session/:sessionId", getStripeSession); 

export default router