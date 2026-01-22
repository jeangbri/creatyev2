import { PrismaClient } from "../generated/client";

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

let prismaInstance: PrismaClient;

try {
    prismaInstance = globalForPrisma.prisma || new PrismaClient({
        log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
    });
} catch (e) {
    console.error("Failed to initialize Prisma Client:", e);
    // Fallback to a proxy that just throws errors when accessed, preventing build-time crash if it's just a static generation issue?
    // No, that's risky. But better than 500ing immediately.
    // For now, let's just log and rethrow or allow it to be undefined and check at usage?
    // The export is `const prisma`. We can't change the type easily in all files.
    // Let's create a proxy that attempts to re-initialize or throws on access.

    // Actually, simpler: Just add the try catch block to log the error clearly.
    // The previous error was an UNHANDLED exception.
    // But if "new PrismaClient" throws, we can't export a valid object.

    // Let's attempt to use the specific `binaryTargets` fix, which I already applied.
    // If that didn't work, maybe the `postinstall` script didn't run on Vercel.

    // I will stick to standard singleton but with logging.
    prismaInstance = globalForPrisma.prisma || new PrismaClient();
}

export const prisma = prismaInstance!;

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
