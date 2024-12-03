export interface SubRecurringTask {
  id?: string;
  $id?: string;
  item: string;
  completedDates?: number[];
  recurringTask: string;
}

export const SubRecurringTaskSchema = {
  item: { value: "string", desc: "Sub Task Title" },
  completedDates: { value: "number[]", desc: "Sub Task Completed Dates Array" },
  recurringTask: { value: "string", desc: "Parent Recurring Task Id" },
};
