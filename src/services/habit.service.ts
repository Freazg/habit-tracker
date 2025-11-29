import habitRepository from '../repositories/habit.repository';
import categoryRepository from '../repositories/category.repository';
import { CreateHabitDto, UpdateHabitDto, Habit } from '../models/habit.model';

class HabitService {
  async getAll(userId: string): Promise<Habit[]> {
    return habitRepository.findByUserId(userId);
  }

  async getById(id: string, userId: string): Promise<Habit> {
    const habit = await habitRepository.findById(id);
    if (!habit) {
      throw new Error('Habit not found');
    }
    if (habit.userId !== userId) {
      throw new Error('Access denied');
    }
    return habit;
  }

  async create(userId: string, data: CreateHabitDto): Promise<Habit> {
    if (data.categoryId) {
      const category = await categoryRepository.findById(data.categoryId);
      if (!category) {
        throw new Error('Category not found');
      }
    }

    if (data.frequency === 'weekly' && (!data.targetDays || data.targetDays.length === 0)) {
      throw new Error('Target days are required for weekly habits');
    }

    if (data.frequency === 'daily' && data.targetDays) {
      data.targetDays = undefined;
    }

    return habitRepository.create(userId, data);
  }

  async update(id: string, userId: string, data: UpdateHabitDto): Promise<Habit> {
    await this.getById(id, userId);

    if (data.categoryId) {
      const category = await categoryRepository.findById(data.categoryId);
      if (!category) {
        throw new Error('Category not found');
      }
    }

    if (data.frequency === 'weekly' && (!data.targetDays || data.targetDays.length === 0)) {
      throw new Error('Target days are required for weekly habits');
    }

    if (data.frequency === 'daily') {
      data.targetDays = undefined;
    }

    const updated = await habitRepository.update(id, data);
    if (!updated) {
      throw new Error('Failed to update habit');
    }
    return updated;
  }

  async delete(id: string, userId: string): Promise<void> {
    await this.getById(id, userId);
    const deleted = await habitRepository.delete(id);
    if (!deleted) {
      throw new Error('Failed to delete habit');
    }
  }
}

export default new HabitService();
