// src/routes/orderRoutes.ts
import express from "express";
import { createOrder, getOrders, getOrder, updateOrder, deleteOrder, getOrdersByWebhook } from "../controllers/orderController.js";
import { authenticate } from "../middleware/authMiddleware.js";

const router = express.Router();

// All order routes require authentication
router.post("/", authenticate, createOrder);
router.get("/by-webhook", authenticate, getOrdersByWebhook);
router.get("/", authenticate, getOrders);
router.get("/:id", authenticate, getOrder);
router.put("/:id", authenticate, updateOrder);
router.delete("/:id", authenticate, deleteOrder);

export default router;
