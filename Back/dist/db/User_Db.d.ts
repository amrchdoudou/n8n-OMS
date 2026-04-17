declare const CreateUser: (username: string, storeName: string, telegram: string, email: string, password: string) => Promise<runtime.Types.Result.DefaultSelection<import("../generated/prisma/models.js").$UserPayload<runtime.Types.Extensions.DefaultArgs>>>;
declare const CheckUserPassword: (email: string, password: string) => Promise<any>;
declare const updateUserInfo: (userId: number, Email?: string, Password?: string, Telegram?: string) => Promise<runtime.Types.Result.DefaultSelection<import("../generated/prisma/models.js").$UserPayload<runtime.Types.Extensions.DefaultArgs>>>;
export { CreateUser, CheckUserPassword, updateUserInfo };
//# sourceMappingURL=User_Db.d.ts.map