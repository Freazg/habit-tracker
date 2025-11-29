export interface HabitLog {
  id: string;
  habitId: string;
  date: string;
  completed: boolean;
  note?: string;
  createdAt: Date;
}

export interface CreateHabitLogDto {
  habitId: string;
  date: string;
  completed: boolean;
  note?: string;
}

export interface UpdateHabitLogDto {
  completed?: boolean;
  note?: string;
}
