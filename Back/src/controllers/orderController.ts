// src/controllers/orderController.ts
import type { Request, Response } from "express";
import { CreateOrder, GetOrdersByUser, GetOrderById, UpdateOrder, DeleteOrder, GetOrdersByWebhookUrl, GetUserByApiKey, UpdateOrderByTracking } from "../db/Order_Db.js";

export const createOrder = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user.id;
        const { customer, phone, location, product } = req.body;

        if (!customer || !phone || !location || !product) {
            return res.status(400).json({ error: "customer, phone, location, and product are required" });
        }

        const newOrder = await CreateOrder(userId, req.body);
        res.status(201).json(newOrder);
    } catch (err) {
        res.status(500).json({ error: "Failed to create order" });
    }
};

export const getOrders = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user.id;
        const orders = await GetOrdersByUser(userId);
        res.json(orders);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch orders" });
    }
};

export const getOrder = async (req: Request, res: Response) => {
    try {
        const orderId = parseInt(req.params.id as string);
        if (isNaN(orderId)) {
            return res.status(400).json({ error: "Invalid order ID" });
        }

        const order = await GetOrderById(orderId);
        if (!order) {
            return res.status(404).json({ error: "Order not found" });
        }

        // Verify the order belongs to the authenticated user
        const userId = (req as any).user.id;
        if (order.userId !== userId) {
            return res.status(403).json({ error: "Forbidden" });
        }

        res.json(order);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch order" });
    }
};

export const updateOrder = async (req: Request, res: Response) => {
    try {
        const orderId = parseInt(req.params.id as string);
        if (isNaN(orderId)) {
            return res.status(400).json({ error: "Invalid order ID" });
        }

        // Verify the order belongs to the authenticated user
        const existingOrder = await GetOrderById(orderId);
        if (!existingOrder) {
            return res.status(404).json({ error: "Order not found" });
        }

        const userId = (req as any).user.id;
        if (existingOrder.userId !== userId) {
            return res.status(403).json({ error: "Forbidden" });
        }

        const updatedOrder = await UpdateOrder(orderId, req.body);
        res.json(updatedOrder);
    } catch (err) {
        res.status(500).json({ error: "Failed to update order" });
    }
};

export const updateOrderByTracking = async (req: Request, res: Response) => {
    try {
        const trackingId = req.params.trackingId as string;
        const userId = (req as any).user.id;

        if (!trackingId) {
            return res.status(400).json({ error: "Tracking ID is required" });
        }

        const updatedOrder = await UpdateOrderByTracking(userId, trackingId, req.body);
        
        if (!updatedOrder) {
            return res.status(404).json({ error: "Order not found with this tracking ID" });
        }

        res.json(updatedOrder);
    } catch (err: any) {
        console.error("Update error:", err);
        res.status(500).json({ error: "Failed to update order", details: err.message });
    }
};


export const deleteOrder = async (req: Request, res: Response) => {
    try {
        const orderId = parseInt(req.params.id as string);
        if (isNaN(orderId)) {
            return res.status(400).json({ error: "Invalid order ID" });
        }

        // Verify the order belongs to the authenticated user
        const existingOrder = await GetOrderById(orderId);
        if (!existingOrder) {
            return res.status(404).json({ error: "Order not found" });
        }

        const userId = (req as any).user.id;
        if (existingOrder.userId !== userId) {
            return res.status(403).json({ error: "Forbidden" });
        }

        const deletedOrder = await DeleteOrder(orderId);
        res.json(deletedOrder);
    } catch (err) {
        res.status(500).json({ error: "Failed to delete order" });
    }
};

import { prisma } from "../Services/Common.js";

// GET /orders/by-webhook?webhookUrl=...
// Authenticates via JWT and API key in header (x-api-key), checks if user owns the webhook,
// and returns all orders with that webhookUrl
export const getOrdersByWebhook = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user.id;
        const webhookUrl = req.query.webhookUrl as string;
        const apiKey = req.headers['x-api-key'] as string;

        if (!webhookUrl || !apiKey) {
            return res.status(400).json({ error: "webhookUrl query parameter and x-api-key header are required" });
        }

        const user = await prisma.user.findUnique({ where: { id: userId } });
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        if (user.apiKey !== apiKey) {
            return res.status(401).json({ error: "Invalid API key" });
        }

        if (user.webhookUrl !== webhookUrl) {
            return res.status(403).json({ error: "Webhook URL mismatch" });
        }

        const orders = await GetOrdersByWebhookUrl(userId, webhookUrl);
        res.json(orders);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch orders by webhook" });
    }
};

