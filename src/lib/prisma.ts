import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

function getDatabaseUrl() {
  const url = process.env.DATABASE_URL ?? "";
  // Supabase requires SSL for external connections
  if (url && !url.includes("sslmode")) {
    return url + (url.includes("?") ? "&" : "?") + "sslmode=require";
  }
  return url;
}

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    datasources: { db: { url: getDatabaseUrl() } },
    log: ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
