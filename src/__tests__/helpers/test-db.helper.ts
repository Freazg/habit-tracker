import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const clearDatabase = async (): Promise<void> => {
  await prisma.habitLog.deleteMany();
  await prisma.habit.deleteMany();
  await prisma.category.deleteMany();
  await prisma.user.deleteMany();
};

export const closeDatabase = async (): Promise<void> => {
  await prisma.$disconnect();
};

export default prisma;
