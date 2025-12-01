export type HabitFrequency = 'daily' | 'weekly';

export interface Habit {
  id: string;
  userId: string;
  categoryId: string | null;
  title: string;
  description: string | null;
  frequency: string;
  targetDays: unknown;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateHabitDto {
  title: string;
  description?: string;
  frequency: HabitFrequency;
  categoryId?: string;
  targetDays?: number[];
}

export interface UpdateHabitDto {
  title?: string;
  description?: string;
  frequency?: HabitFrequency;
  categoryId?: string;
  targetDays?: number[];
  isActive?: boolean;
}
