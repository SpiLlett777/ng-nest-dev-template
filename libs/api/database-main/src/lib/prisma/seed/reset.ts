import { SeedPrismaClient } from './client';

export const resetDatabase = (prisma: SeedPrismaClient) =>
	prisma.$executeRawUnsafe(`
    TRUNCATE TABLE
      "sessions",
      "users"
    RESTART IDENTITY CASCADE;
  `);
