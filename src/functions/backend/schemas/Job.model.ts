export interface Job {
  id?: string;
  title: string;
  description?: string;
  checklist?: string[];
  createdAt: number;
  updatedAt?: number;
  done?: number | boolean;
  doAt?: number;
  dueAt?: number;
  time?: string;
  priority?: { importance?: boolean; urgency?: boolean };
  status?: string;
  projects?: string[];
  tags?: string[];
  user: string;
}
