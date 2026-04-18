import { prisma } from "../Services/Common.js";
const CreateOrder = async (userId, data) => {
    try {
        const newOrder = await prisma.order.create({
            data: {
                userId: userId,
                customer: data.customer,
                phone: data.phone,
                location: data.location,
                product: data.product,
                ...(data.shopifyId ? { shopifyId: data.shopifyId } : {}),
                price: data.price,
                ...(data.currency ? { currency: data.currency } : {}),
                ...(data.deliveryType ? { deliveryType: data.deliveryType } : {}),
                ...(data.webhookUrl ? { webhookUrl: data.webhookUrl } : {}),
            },
        });
        return newOrder;
    }
    catch (error) {
        console.error("Error creating order:", error);
        throw error;
    }
};
const GetOrdersByUser = async (userId) => {
    try {
        const orders = await prisma.order.findMany({
            where: { userId: userId },
            orderBy: { createdAt: "desc" },
        });
        return orders;
    }
    catch (error) {
        console.error("Error fetching orders:", error);
        throw error;
    }
};
const GetOrderById = async (orderId) => {
    try {
        const order = await prisma.order.findUnique({
            where: { id: orderId },
        });
        return order;
    }
    catch (error) {
        console.error("Error fetching order:", error);
        throw error;
    }
};
const UpdateOrder = async (orderId, data) => {
    try {
        const updatedOrder = await prisma.order.update({
            where: { id: orderId },
            data: {
                ...(data.customer ? { customer: data.customer } : {}),
                ...(data.phone ? { phone: data.phone } : {}),
                ...(data.location ? { location: data.location } : {}),
                ...(data.product ? { product: data.product } : {}),
                ...(data.price !== undefined ? { price: data.price } : {}),
                ...(data.currency ? { currency: data.currency } : {}),
                ...(data.whatsappAttempts !== undefined ? { whatsappAttempts: data.whatsappAttempts } : {}),
                ...(data.status ? { status: data.status } : {}),
                ...(data.trackingId !== undefined ? { trackingId: data.trackingId } : {}),
                ...(data.deliveryType ? { deliveryType: data.deliveryType } : {}),
                ...(data.webhookUrl !== undefined ? { webhookUrl: data.webhookUrl } : {}),
            },
        });
        return updatedOrder;
    }
    catch (error) {
        console.error("Error updating order:", error);
        throw error;
    }
};
const DeleteOrder = async (orderId) => {
    try {
        const deletedOrder = await prisma.order.delete({
            where: { id: orderId },
        });
        return deletedOrder;
    }
    catch (error) {
        console.error("Error deleting order:", error);
        throw error;
    }
};
const GetOrdersByWebhookUrl = async (webhookUrl) => {
    try {
        const orders = await prisma.order.findMany({
            where: {
                webhookUrl: webhookUrl,
            },
            orderBy: { createdAt: "desc" },
        });
        return orders;
    }
    catch (error) {
        console.error("Error fetching orders by webhook:", error);
        throw error;
    }
};
const GetUserByApiKey = async (apiKey) => {
    try {
        const user = await prisma.user.findFirst({
            where: { apiKey: apiKey },
        });
        return user;
    }
    catch (error) {
        console.error("Error fetching user by API key:", error);
        throw error;
    }
};
const UpdateOrderByTracking = async (userId, trackingId, data) => {
    try {
        const order = await prisma.order.findFirst({
            where: {
                userId: userId,
                trackingId: trackingId,
            },
        });
        if (!order) {
            return null;
        }
        const updatedOrder = await prisma.order.update({
            where: { id: order.id },
            data: {
                ...(data.customer ? { customer: data.customer } : {}),
                ...(data.phone ? { phone: data.phone } : {}),
                ...(data.location ? { location: data.location } : {}),
                ...(data.product ? { product: data.product } : {}),
                ...(data.price !== undefined ? { price: data.price } : {}),
                ...(data.currency ? { currency: data.currency } : {}),
                ...(data.whatsappAttempts !== undefined ? { whatsappAttempts: data.whatsappAttempts } : {}),
                ...(data.status ? { status: data.status } : {}),
                ...(data.webhookUrl !== undefined ? { webhookUrl: data.webhookUrl } : {}),
            },
        });
        return updatedOrder;
    }
    catch (error) {
        console.error("Error updating order by tracking:", error);
        throw error;
    }
};
export { CreateOrder, GetOrdersByUser, GetOrderById, UpdateOrder, DeleteOrder, GetOrdersByWebhookUrl, GetUserByApiKey, UpdateOrderByTracking };
//# sourceMappingURL=Order_Db.js.map