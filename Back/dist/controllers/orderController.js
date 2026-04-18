import { CreateOrder, GetOrdersByUser, GetOrderById, UpdateOrder, DeleteOrder, GetOrdersByWebhookUrl, GetUserByApiKey, UpdateOrderByTracking } from "../db/Order_Db.js";
export const createOrder = async (req, res) => {
    try {
        const userId = req.user.id;
        const { customer, phone, location, product } = req.body;
        if (!customer || !phone || !location || !product) {
            return res.status(400).json({ error: "customer, phone, location, and product are required" });
        }
        const newOrder = await CreateOrder(userId, req.body);
        res.status(201).json(newOrder);
    }
    catch (err) {
        res.status(500).json({ error: "Failed to create order" });
    }
};
export const getOrders = async (req, res) => {
    try {
        const userId = req.user.id;
        const orders = await GetOrdersByUser(userId);
        res.json(orders);
    }
    catch (err) {
        res.status(500).json({ error: "Failed to fetch orders" });
    }
};
export const getOrder = async (req, res) => {
    try {
        const orderId = parseInt(req.params.id);
        if (isNaN(orderId)) {
            return res.status(400).json({ error: "Invalid order ID" });
        }
        const order = await GetOrderById(orderId);
        if (!order) {
            return res.status(404).json({ error: "Order not found" });
        }
        // Verify the order belongs to the authenticated user
        const userId = req.user.id;
        if (order.userId !== userId) {
            return res.status(403).json({ error: "Forbidden" });
        }
        res.json(order);
    }
    catch (err) {
        res.status(500).json({ error: "Failed to fetch order" });
    }
};
export const updateOrder = async (req, res) => {
    try {
        const orderId = parseInt(req.params.id);
        if (isNaN(orderId)) {
            return res.status(400).json({ error: "Invalid order ID" });
        }
        // Verify the order belongs to the authenticated user
        const existingOrder = await GetOrderById(orderId);
        if (!existingOrder) {
            return res.status(404).json({ error: "Order not found" });
        }
        const userId = req.user.id;
        if (existingOrder.userId !== userId) {
            return res.status(403).json({ error: "Forbidden" });
        }
        const updatedOrder = await UpdateOrder(orderId, req.body);
        res.json(updatedOrder);
    }
    catch (err) {
        res.status(500).json({ error: "Failed to update order" });
    }
};
export const updateOrderByTracking = async (req, res) => {
    try {
        const trackingId = req.params.trackingId;
        const userId = req.user.id;
        if (!trackingId) {
            return res.status(400).json({ error: "Tracking ID is required" });
        }
        const updatedOrder = await UpdateOrderByTracking(userId, trackingId, req.body);
        if (!updatedOrder) {
            return res.status(404).json({ error: "Order not found with this tracking ID" });
        }
        res.json(updatedOrder);
    }
    catch (err) {
        console.error("Update error:", err);
        res.status(500).json({ error: "Failed to update order", details: err.message });
    }
};
export const deleteOrder = async (req, res) => {
    try {
        const orderId = parseInt(req.params.id);
        if (isNaN(orderId)) {
            return res.status(400).json({ error: "Invalid order ID" });
        }
        // Verify the order belongs to the authenticated user
        const existingOrder = await GetOrderById(orderId);
        if (!existingOrder) {
            return res.status(404).json({ error: "Order not found" });
        }
        const userId = req.user.id;
        if (existingOrder.userId !== userId) {
            return res.status(403).json({ error: "Forbidden" });
        }
        const deletedOrder = await DeleteOrder(orderId);
        res.json(deletedOrder);
    }
    catch (err) {
        res.status(500).json({ error: "Failed to delete order" });
    }
};
import { prisma } from "../Services/Common.js";
// GET /orders/by-webhook
// Authenticates via JWT, checks if user has a configured webhookUrl,
// and returns all orders with that webhookUrl
export const getOrdersByWebhook = async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await prisma.user.findUnique({ where: { id: userId } });
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        if (!user.webhookUrl) {
            return res.status(400).json({ error: "User does not have a configured webhook URL" });
        }
        const orders = await GetOrdersByWebhookUrl(user.webhookUrl);
        res.json(orders);
    }
    catch (err) {
        res.status(500).json({ error: "Failed to fetch orders by webhook" });
    }
};
//# sourceMappingURL=orderController.js.map