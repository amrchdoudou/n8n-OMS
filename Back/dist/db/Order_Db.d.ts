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
declare const CreateOrder: (userId: number, data: CreateOrderInput) => Promise<runtime.Types.Result.DefaultSelection<import("../generated/prisma/models.js").$OrderPayload<runtime.Types.Extensions.DefaultArgs>>>;
declare const GetOrdersByUser: (userId: number) => Promise<runtime.Types.Public.PrismaPromise<T>>;
declare const GetOrderById: (orderId: number) => Promise<any>;
declare const UpdateOrder: (orderId: number, data: UpdateOrderInput) => Promise<runtime.Types.Result.DefaultSelection<import("../generated/prisma/models.js").$OrderPayload<runtime.Types.Extensions.DefaultArgs>>>;
declare const DeleteOrder: (orderId: number) => Promise<runtime.Types.Result.GetResult<import("../generated/prisma/models.js").$OrderPayload<ExtArgs>, T, "delete", GlobalOmitOptions>>;
export { CreateOrder, GetOrdersByUser, GetOrderById, UpdateOrder, DeleteOrder };
export type { CreateOrderInput, UpdateOrderInput };
//# sourceMappingURL=Order_Db.d.ts.map