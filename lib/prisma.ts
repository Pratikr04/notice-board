import { PrismaClient } from "@prisma/client";
import { withAccelerate } from "@prisma/extension-accelerate";

// A single PrismaClient instance is reused across hot reloads in development
// and across serverless invocations on Vercel, which avoids exhausting the
// database connection pool.
const prismaClientSingleton = () => new PrismaClient().$extends(withAccelerate());

type PrismaSingleton = ReturnType<typeof prismaClientSingleton>;

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaSingleton | undefined;
};

export const prisma = globalForPrisma.prisma ?? prismaClientSingleton();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
