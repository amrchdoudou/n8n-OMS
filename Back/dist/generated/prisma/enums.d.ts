export declare const OrderStatus: {
    readonly pending: "pending";
    readonly confirmed: "confirmed";
    readonly pushed: "pushed";
    readonly in_transit: "in_transit";
    readonly delivered: "delivered";
    readonly cancelled: "cancelled";
    readonly failed: "failed";
    readonly returned: "returned";
};
export type OrderStatus = (typeof OrderStatus)[keyof typeof OrderStatus];
export declare const DeliveryType: {
    readonly domicile: "domicile";
    readonly stopdesk: "stopdesk";
};
export type DeliveryType = (typeof DeliveryType)[keyof typeof DeliveryType];
//# sourceMappingURL=enums.d.ts.map