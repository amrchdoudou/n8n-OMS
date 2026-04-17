// src/controllers/orderController.ts
import type { Request, Response } from "express";
import { CreateOrder, GetOrdersByUser, GetOrderById, UpdateOrder, DeleteOrder } from "../db/Order_Db.js";

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
