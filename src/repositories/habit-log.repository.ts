import { HabitLog, CreateHabitLogDto, UpdateHabitLogDto } from '../models/habit-log.model';
import { v4 as uuidv4 } from 'uuid';

class HabitLogRepository {
  private logs: HabitLog[] = [];

  async findAll(): Promise<HabitLog[]> {
    return this.logs;
  }

  async findById(id: string): Promise<HabitLog | undefined> {
    return this.logs.find((log) => log.id === id);
  }

  async findByHabitId(habitId: string): Promise<HabitLog[]> {
    return this.logs.filter((log) => log.habitId === habitId);
  }

  async findByHabitAndDate(habitId: string, date: string): Promise<HabitLog | undefined> {
    return this.logs.find((log) => log.habitId === habitId && log.date === date);
  }

  async create(data: CreateHabitLogDto): Promise<HabitLog> {
    const log: HabitLog = {
      id: uuidv4(),
      habitId: data.habitId,
      date: data.date,
      completed: data.completed,
      note: data.note,
      createdAt: new Date(),
    };
    this.logs.push(log);
    return log;
  }

  async update(id: string, data: UpdateHabitLogDto): Promise<HabitLog | undefined> {
    const index = this.logs.findIndex((log) => log.id === id);
    if (index === -1) return undefined;

    this.logs[index] = {
      ...this.logs[index],
      ...data,
    };
    return this.logs[index];
  }

  async delete(id: string): Promise<boolean> {
    const index = this.logs.findIndex((log) => log.id === id);
    if (index === -1) return false;
    this.logs.splice(index, 1);
    return true;
  }
}

export default new HabitLogRepository();
