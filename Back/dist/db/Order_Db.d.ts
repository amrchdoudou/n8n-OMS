import type { OrderStatus, DeliveryType } from "../generated/prisma/client.js";
interface CreateOrderInput {
    shopifyId?: string;
    customer: string;
    phone: string;
    location: string;
    product: string;
    price: number;
    currency?: string;
    deliveryType?: DeliveryType;
}
interface UpdateOrderInput {
    customer?: string;
    phone?: string;
    location?: string;
    product?: string;
    price?: number;
    currency?: string;
    whatsappAttempts?: number;
    status?: OrderStatus;
    trackingId?: string;
    deliveryType?: DeliveryType;
}
declare const CreateOrder: (userId: number, data: CreateOrderInput) => Promise<{
    userId: number;
    id: number;
    createdAt: Date;
    shopifyId: string | null;
    customer: string;
    phone: string;
    location: string;
    product: string;
    price: number;
    currency: string;
    whatsappAttempts: number;
    status: OrderStatus;
    trackingId: string | null;
    deliveryType: DeliveryType;
}>;
declare const GetOrdersByUser: (userId: number) => Promise<{
    userId: number;
    id: number;
    createdAt: Date;
    shopifyId: string | null;
    customer: string;
    phone: string;
    location: string;
    product: string;
    price: number;
    currency: string;
    whatsappAttempts: number;
    status: OrderStatus;
    trackingId: string | null;
    deliveryType: DeliveryType;
}[]>;
declare const GetOrderById: (orderId: number) => Promise<{
    userId: number;
    id: number;
    createdAt: Date;
    shopifyId: string | null;
    customer: string;
    phone: string;
    location: string;
    product: string;
    price: number;
    currency: string;
    whatsappAttempts: number;
    status: OrderStatus;
    trackingId: string | null;
    deliveryType: DeliveryType;
} | null>;
declare const UpdateOrder: (orderId: number, data: UpdateOrderInput) => Promise<{
    userId: number;
    id: number;
    createdAt: Date;
    shopifyId: string | null;
    customer: string;
    phone: string;
    location: string;
    product: string;
    price: number;
    currency: string;
    whatsappAttempts: number;
    status: OrderStatus;
    trackingId: string | null;
    deliveryType: DeliveryType;
}>;
declare const DeleteOrder: (orderId: number) => Promise<{
    userId: number;
    id: number;
    createdAt: Date;
    shopifyId: string | null;
    customer: string;
    phone: string;
    location: string;
    product: string;
    price: number;
    currency: string;
    whatsappAttempts: number;
    status: OrderStatus;
    trackingId: string | null;
    deliveryType: DeliveryType;
}>;
export { CreateOrder, GetOrdersByUser, GetOrderById, UpdateOrder, DeleteOrder };
export type { CreateOrderInput, UpdateOrderInput };
//# sourceMappingURL=Order_Db.d.ts.map