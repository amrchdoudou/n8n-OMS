import { PrismaClient } from '@prisma/client';
export declare const prisma: PrismaClient<import("@prisma/client").Prisma.PrismaClientOptions, never, import("@prisma/client/runtime/library").DefaultArgs>;
declare const HashPassword: (password: string) => string;
declare const GenerateJwtToken: (userId: number, email: string) => string;
declare const GenerateRefreshToken: (userId: number, email: string) => string;
export { HashPassword, GenerateJwtToken, GenerateRefreshToken, };
//# sourceMappingURL=Common.d.ts.map