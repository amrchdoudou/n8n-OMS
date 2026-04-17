declare const CreateUser: (username: string, storeName: string, email: string, password: string) => Promise<{
    email: string | null;
    id: number;
    username: string;
    storeName: string;
    whatsappNumber: string | null;
    password: string;
    createdAt: Date;
    deliveryProvider: string | null;
    apiKey: string | null;
}>;
declare const CheckUserPassword: (email: string, password: string) => Promise<{
    email: string | null;
    id: number;
    password: string;
} | null>;
declare const updateUserInfo: (userId: number, Email?: string, Password?: string, number?: string, storeName?: string, apiKey?: string) => Promise<{
    email: string | null;
    id: number;
    username: string;
    storeName: string;
    whatsappNumber: string | null;
    password: string;
    createdAt: Date;
    deliveryProvider: string | null;
    apiKey: string | null;
}>;
declare const UpdateContactInfoInfo: (userId: number, number?: string, storeName?: string, apiKey?: string, deliveryProvider?: string) => Promise<{
    email: string | null;
    id: number;
    username: string;
    storeName: string;
    whatsappNumber: string | null;
    password: string;
    createdAt: Date;
    deliveryProvider: string | null;
    apiKey: string | null;
}>;
export { CreateUser, CheckUserPassword, updateUserInfo, UpdateContactInfoInfo };
//# sourceMappingURL=User_Db.d.ts.map