export declare const OrderStatus: {
    readonly pending: "pending";
    readonly confirmed: "confirmed";
    readonly pushed: "pushed";
    readonly in_transit: "in_transit";
    readonly delivered: "delivered";
    readonly cancelled: "cancelled";
    readonly failed: "failed";
    readonly returned: "returned";
    readonly READY: "READY";
    readonly PICKUP: "PICKUP";
    readonly TO_STATION: "TO_STATION";
    readonly IN_STATION: "IN_STATION";
    readonly TO_WILAYA: "TO_WILAYA";
    readonly PREPARING: "PREPARING";
    readonly IN_TRANSIT: "IN_TRANSIT";
    readonly SUSPENDED: "SUSPENDED";
    readonly DELIVERED: "DELIVERED";
    readonly RETURNED: "RETURNED";
};
export type OrderStatus = (typeof OrderStatus)[keyof typeof OrderStatus];
export declare const DeliveryType: {
    readonly domicile: "domicile";
    readonly stopdesk: "stopdesk";
};
export type DeliveryType = (typeof DeliveryType)[keyof typeof DeliveryType];
//# sourceMappingURL=enums.d.ts.map