export interface HabitLog {
  id: string;
  habitId: string;
  date: Date;
  completed: boolean;
  note: string | null;
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
