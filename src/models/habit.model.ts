export type HabitFrequency = 'daily' | 'weekly';

export interface Habit {
  id: string;
  userId: string;
  categoryId?: string;
  title: string;
  description?: string;
  frequency: HabitFrequency;
  targetDays?: number[];
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
