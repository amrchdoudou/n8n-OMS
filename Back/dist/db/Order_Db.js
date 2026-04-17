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
export { CreateOrder, GetOrdersByUser, GetOrderById, UpdateOrder, DeleteOrder };
//# sourceMappingURL=Order_Db.js.map