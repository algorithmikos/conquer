export interface SeedDocument {
  id?: string;
  $id?: string;
  title: string;
  description?: string;
  user: string;
}

export const SeedSchema = {
  title: { value: "string", desc: "Seed Title" },
  description: { value: "string", desc: "Seed Description" },
  user: { value: "string", desc: "Seed User Id" },
};
