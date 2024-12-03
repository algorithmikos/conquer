export interface RecurringTask {
  $id?: string;
  title: string;
  description?: string;
  createdAt: number;
  updatedAt?: number;
  startedAt?: number;
  time?: string;
  status?: string;
  repeats?: string;
  repeatsOn?: string;
  checklist: { [key: string]: any }[];
  completedDates?: number[];
  skippedDates?: number[];
  repeatOccurance?: number;
  repeatanceDays?: number[];
  compensable?: boolean;
  pillars?: string[];
  tags?: string[];
  user: string;
}
