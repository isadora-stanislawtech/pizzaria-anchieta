import { PrismaClient } from '@/generated/prisma';

type GlobalForPrisma = {
  prisma?: PrismaClient;
};

const g = globalThis as unknown as GlobalForPrisma;

export const prisma: PrismaClient = g.prisma ?? new PrismaClient({ log: ['warn', 'error'] });

if (process.env.NODE_ENV !== 'production') g.prisma = prisma;
