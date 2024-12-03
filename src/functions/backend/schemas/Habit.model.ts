export interface Habit {
  $id?: string;
  title: string;
  description?: string;
  createdAt: number;
  updatedAt?: number;
  status?: string;
  streak?: number;
  pillars?: string[];
  tags?: string[];
  completedDates?: { [key: number]: number };
  user: string;
}
