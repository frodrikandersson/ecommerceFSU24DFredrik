import express from "express";
import { 
  getOrders, 
  getOrderById, 
  getOrderByPaymentId,
  createOrder, 
  updateOrder, 
  deleteOrder } from "../controllers/orderController";
const router = express.Router();

router.get("/", getOrders)
router.get("/:id", getOrderById)
router.get("/payment/:payment_id", getOrderByPaymentId)
router.post("/", createOrder)
router.patch("/:id", updateOrder)
router.delete("/:id", deleteOrder)

export default router