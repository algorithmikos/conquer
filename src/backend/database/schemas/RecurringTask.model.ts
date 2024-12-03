export const RecurringTaskSchema = {
  title: { value: "string", desc: "Recurring Task Title" },
  description: { value: "string", desc: "Recurring Task Description" },
  status: { value: "string", desc: "Recurring Task Status" },

  completedDates: {
    value: "number[]",
    desc: "Recurring Task Completed Dates Array",
  },
  skippedDates: {
    value: "number[]",
    desc: "Recurring Task Skipped Dates Array",
  },
  checklist: {
    value: "relationshipID[]",
    desc: "Recurring Task Sub Tasks Array of Ids",
  },

  startedAt: { value: "number", desc: "Recurring Task Started At Timestamp" },
  repeats: { value: "string", desc: "Recurring Task Recurrance Pattern" },
  repeatOccurance: { value: "number", desc: "Recurring Task Recurrance Count" },
  repeatanceDays: {
    value: "number[]",
    desc: "Recurring Task Recurrance Week Days",
  },

  time: { value: "string", desc: "Recurring Task Time" },
  compensable: { value: "boolean", desc: "Recurring Task Compensablity Flag" },

  pillars: { value: "string[]", desc: "Recurring Task Pillars Array of Ids" },
  user: { value: "string", desc: "Recurring Task User Id" },
};
