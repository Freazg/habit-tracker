import prisma from '../utils/prisma.util';
import { Habit, CreateHabitDto, UpdateHabitDto } from '../models/habit.model';

class HabitRepository {
  async findAll(): Promise<Habit[]> {
    return prisma.habit.findMany() as Promise<Habit[]>;
  }

  async findById(id: string): Promise<Habit | null> {
    return prisma.habit.findUnique({ where: { id } }) as Promise<Habit | null>;
  }

  async findByUserId(userId: string): Promise<Habit[]> {
    return prisma.habit.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    }) as Promise<Habit[]>;
  }

  async create(userId: string, data: CreateHabitDto): Promise<Habit> {
    return prisma.habit.create({
      data: {
        userId,
        categoryId: data.categoryId ?? null,
        title: data.title,
        description: data.description ?? null,
        frequency: data.frequency,
        targetDays: data.targetDays ?? undefined,
        isActive: true,
      },
    }) as Promise<Habit>;
  }

  async update(id: string, data: UpdateHabitDto): Promise<Habit | null> {
    return prisma.habit.update({
      where: { id },
      data,
    }) as Promise<Habit>;
  }

  async delete(id: string): Promise<boolean> {
    await prisma.habit.delete({ where: { id } });
    return true;
  }
}

export default new HabitRepository();
