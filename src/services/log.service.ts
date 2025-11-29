import habitLogRepository from '../repositories/habit-log.repository';
import habitRepository from '../repositories/habit.repository';
import { CreateHabitLogDto, UpdateHabitLogDto, HabitLog } from '../models/habit-log.model';

class LogService {
  async getByHabitId(habitId: string, userId: string): Promise<HabitLog[]> {
    const habit = await habitRepository.findById(habitId);
    if (!habit) {
      throw new Error('Habit not found');
    }
    if (habit.userId !== userId) {
      throw new Error('Access denied');
    }
    return habitLogRepository.findByHabitId(habitId);
  }

  async create(data: CreateHabitLogDto, userId: string): Promise<HabitLog> {
    const habit = await habitRepository.findById(data.habitId);
    if (!habit) {
      throw new Error('Habit not found');
    }
    if (habit.userId !== userId) {
      throw new Error('Access denied');
    }

    const existing = await habitLogRepository.findByHabitAndDate(data.habitId, data.date);
    if (existing) {
      const updated = await habitLogRepository.update(existing.id, {
        completed: data.completed,
        note: data.note,
      });
      if (!updated) {
        throw new Error('Failed to update log');
      }
      return updated;
    }

    return habitLogRepository.create(data);
  }

  async update(id: string, userId: string, data: UpdateHabitLogDto): Promise<HabitLog> {
    const log = await habitLogRepository.findById(id);
    if (!log) {
      throw new Error('Log not found');
    }

    const habit = await habitRepository.findById(log.habitId);
    if (!habit || habit.userId !== userId) {
      throw new Error('Access denied');
    }

    const updated = await habitLogRepository.update(id, data);
    if (!updated) {
      throw new Error('Failed to update log');
    }
    return updated;
  }

  async delete(id: string, userId: string): Promise<void> {
    const log = await habitLogRepository.findById(id);
    if (!log) {
      throw new Error('Log not found');
    }

    const habit = await habitRepository.findById(log.habitId);
    if (!habit || habit.userId !== userId) {
      throw new Error('Access denied');
    }

    const deleted = await habitLogRepository.delete(id);
    if (!deleted) {
      throw new Error('Failed to delete log');
    }
  }
}

export default new LogService();
