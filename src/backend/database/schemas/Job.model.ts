export interface Job {
  id?: string;
  $id?: string;
  title: string;
  description?: string;
  done?: number;
  priority?: { importance?: boolean; urgency?: boolean };
  status?: string;
  projects?: string[];
  tags?: string[];
  user: string;
  checklist?: string[];
  doAt?: number;
  dueAt?: number;
  time?: string;
}

export const JobSchema = {
  title: { value: "string", desc: "Job Title" },
  description: { value: "string", desc: "Job Description" },
  done: { value: "integer", desc: "Job Completion Status" },
  priority: { value: "string", desc: "Job Priority" },
  status: { value: "string", desc: "Job Status" },
  checklist: {
    value: "string[]",
    desc: "Stringified Job array of Sub Tasks",
  },
  projects: { value: "string[]", desc: "Job Projects Array of Ids" },
  tags: { value: "string[]", desc: "Job Tags Array of Ids" },
  user: { value: "string", desc: "Job User Id" },
  doAt: { value: "number", desc: "Job Do At Timestamp" },
  dueAt: { value: "number", desc: "Job Due At Timestamp" },
  time: { value: "string", desc: "Job Time" },
};

export const serverToClientJob = (serverJob: { [key: string]: any }) => {
  const clientJob = { ...serverJob, id: serverJob.$id };

  if (serverJob.checklist) {
    const parsedChecklist = serverJob.checklist.map((item: string) => {
      return JSON.parse(item);
    });
    /* @ts-ignore */
    clientJob.checklist = parsedChecklist;
  }

  if (serverJob.priority) {
    /* @ts-ignore */
    clientJob.priority = JSON.parse(serverJob.priority);
  }

  return clientJob;
};
