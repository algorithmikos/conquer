export interface PillarDocument {
  id?: string;
  $id?: string;
  title: string;
  details?: string;
  status?: string;
  user: string;
  recurringTasks?: string[];
  habits?: string[];
}

export const PillarSchema = {
  title: { value: "string", desc: "Pillar Title" },
  details: { value: "string", desc: "Pillar Description" },
  status: { value: "string", desc: "Pillar Status" },
  user: { value: "string", desc: "Pillar User Id" },
  recurringTasks: {
    value: "string[]",
    desc: "Pillar Recurring Tasks Array of Ids",
  },
  habits: {
    value: "string[]",
    desc: "Pillar Habits Array of Ids",
  },
};
