import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

// Defensive check for Vercel invalid env vars
if (process.env.PRISMA_CLIENT_ENGINE_TYPE) {
    const val = process.env.PRISMA_CLIENT_ENGINE_TYPE.trim().toLowerCase();
    if (val !== 'library' && val !== 'binary') {
        console.warn(`[Prisma] Invalid PRISMA_CLIENT_ENGINE_TYPE "${process.env.PRISMA_CLIENT_ENGINE_TYPE}". Removing it to allow default.`);
        delete process.env.PRISMA_CLIENT_ENGINE_TYPE;
    }
}

export const prisma = globalForPrisma.prisma || new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
});

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
