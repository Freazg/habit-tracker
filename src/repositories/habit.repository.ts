import { Habit, CreateHabitDto, UpdateHabitDto } from '../models/habit.model';
import { v4 as uuidv4 } from 'uuid';

class HabitRepository {
  private habits: Habit[] = [];

  async findAll(): Promise<Habit[]> {
    return this.habits;
  }

  async findById(id: string): Promise<Habit | undefined> {
    return this.habits.find((habit) => habit.id === id);
  }

  async findByUserId(userId: string): Promise<Habit[]> {
    return this.habits.filter((habit) => habit.userId === userId);
  }

  async create(userId: string, data: CreateHabitDto): Promise<Habit> {
    const habit: Habit = {
      id: uuidv4(),
      userId,
      categoryId: data.categoryId,
      title: data.title,
      description: data.description,
      frequency: data.frequency,
      targetDays: data.targetDays,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.habits.push(habit);
    return habit;
  }

  async update(id: string, data: UpdateHabitDto): Promise<Habit | undefined> {
    const index = this.habits.findIndex((habit) => habit.id === id);
    if (index === -1) return undefined;

    this.habits[index] = {
      ...this.habits[index],
      ...data,
      updatedAt: new Date(),
    };
    return this.habits[index];
  }

  async delete(id: string): Promise<boolean> {
    const index = this.habits.findIndex((habit) => habit.id === id);
    if (index === -1) return false;
    this.habits.splice(index, 1);
    return true;
  }
}

export default new HabitRepository();
