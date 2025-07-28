import { PrismaClient } from "@prisma/client";

declare global {
  // eslint-disable-next-line no-var
  var cachedPrisma: PrismaClient;
}

let prisma: PrismaClient;

if (process.env.NODE_ENV === "production") {
  console.log("Prisma: Running in production mode.");
  prisma = new PrismaClient();
} else {
  console.log("Prisma: Running in development mode.");
  if (!global.cachedPrisma) {
    console.log("Prisma: Initializing new PrismaClient instance...");
    try {
      global.cachedPrisma = new PrismaClient();
      console.log("Prisma: PrismaClient instance created successfully.");
    } catch (e) {
      console.error("Prisma: Error creating PrismaClient instance:", e);
      // Anda bisa menambahkan logging lebih detail di sini, misalnya:
      // console.error("Prisma: PRISMA_QUERY_ENGINE_BINARY:", process.env.PRISMA_QUERY_ENGINE_BINARY);
      // console.error("Prisma: Path to default.js:", require.resolve('@prisma/client/runtime/library.js'));
      throw e; // Re-throw the error to see full stack trace
    }
  } else {
    console.log("Prisma: Using cached PrismaClient instance.");
  }
  prisma = global.cachedPrisma;
}

export default prisma;
