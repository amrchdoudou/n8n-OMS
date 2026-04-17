export declare const prisma: import("../generated/prisma/internal/class.js").PrismaClient<never, import("../generated/prisma/internal/prismaNamespace.js").GlobalOmitConfig | undefined, runtime.Types.Extensions.DefaultArgs>;
declare const HashPassword: (password: string) => string;
declare const GenerateJwtToken: (userId: number, email: string) => string;
declare const GenerateRefreshToken: (userId: number, email: string) => string;
declare const GetDataFromPath: (filePath: string) => Promise<string | null>;
export { HashPassword, GenerateJwtToken, GenerateRefreshToken, GetDataFromPath, };
//# sourceMappingURL=Common.d.ts.map