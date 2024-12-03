export interface Habit {
  id?: string;
  $id?: string;
  title: string;
  description?: string;
  status?: string;
  completedDates?: { [key: number]: number };
  pillars?: string[];
  tags?: string[];
  streak?: number;
  user: string;
}

export const HabitSchema = {
  title: { value: "string", desc: "Habit Title" },
  description: { value: "string", desc: "Habit Description" },
  status: { value: "string", desc: "Habit Status" },
  completedDates: {
    value: "string[]",
    desc: "Habit Completed Dates Array",
  },
  pillars: { value: "string[]", desc: "Habit Pillars Array of Ids" },
  tags: { value: "string[]", desc: "Habit Tags Array of Ids" },
  streak: { value: "integer", desc: "Habit Streak" },
  user: { value: "string", desc: "Habit User Id" },
};

export const serverToClientHabit = (serverHabit: { [key: string]: any }) => {
  const clientHabit = { ...serverHabit };

  if (clientHabit.completedDates) {
    let completedDates: { [key: number | string]: number } = {};

    serverHabit.completedDates.forEach((keyvaluepair: number) => {
      const [key, value] = String(keyvaluepair)
        .split(".")
        .map((item) => item.trim());

      completedDates[key] = value ? Number(value) : 0; // Convert the value to a number
    });

    clientHabit.completedDates = completedDates;
  }

  return clientHabit;
};
