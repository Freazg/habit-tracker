import prisma from '../utils/prisma.util';
import { HabitLog, CreateHabitLogDto, UpdateHabitLogDto } from '../models/habit-log.model';

class HabitLogRepository {
  async findAll(): Promise<HabitLog[]> {
    return prisma.habitLog.findMany();
  }

  async findById(id: string): Promise<HabitLog | null> {
    return prisma.habitLog.findUnique({ where: { id } });
  }

  async findByHabitId(habitId: string): Promise<HabitLog[]> {
    return prisma.habitLog.findMany({
      where: { habitId },
      orderBy: { date: 'desc' },
    });
  }

  async findByHabitAndDate(habitId: string, date: string): Promise<HabitLog | null> {
    return prisma.habitLog.findFirst({
      where: {
        habitId,
        date: new Date(date),
      },
    });
  }

  async create(data: CreateHabitLogDto): Promise<HabitLog> {
    return prisma.habitLog.create({
      data: {
        habitId: data.habitId,
        date: new Date(data.date),
        completed: data.completed,
        note: data.note,
      },
    });
  }

  async update(id: string, data: UpdateHabitLogDto): Promise<HabitLog | null> {
    return prisma.habitLog.update({
      where: { id },
      data,
    });
  }

  async delete(id: string): Promise<boolean> {
    await prisma.habitLog.delete({ where: { id } });
    return true;
  }
}

export default new HabitLogRepository();
