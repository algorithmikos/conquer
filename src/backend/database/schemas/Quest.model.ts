export interface QuestDocument {
  id?: string;
  $id?: string;
  title: string;
  details?: string;
  status?: string;
  beginning?: Date;
  end?: Date;
  user: string;
  jobs?: string[];
}

export const QuestSchema = {
  title: { value: "string", desc: "Quest Title" },
  details: { value: "string", desc: "Quest Description" },
  status: { value: "string", desc: "Quest Status" },
  beginning: { value: "date", desc: "Quest Beginning Date" },
  end: { value: "date", desc: "Quest End Date" },
  user: { value: "string", desc: "Quest User Id" },
  jobs: {
    value: "string[]",
    desc: "Quest Jobs Array of Ids",
  },
};
