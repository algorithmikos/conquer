import { create, StateCreator } from "zustand";
import { Habit } from "../functions/backend/schemas/Habit.model";

export enum DialogOptions {
  New = "new",
  Modify = "modify",
  Info = "info",
  Delete = "delete",
}

export enum InstanceOptions {
  New = "new",
  Modified = "modified",
}

export enum TabValues {
  Active = "active",
  All = "all",
}

interface HabitStore {
  habits: Habit[];
  setHabits: (habits: Habit[]) => void;

  filteredHabits: Habit[];
  setFilteredHabits: (filteredHabits: Habit[]) => void;

  addHabit: (habit: Habit) => void;
  updateHabit: (habit: Habit) => void;
  removeHabit: (habit: Habit) => void;

  habitsOrder: string[];
  setHabitsOrder: (order: string[]) => void;

  areHabitsFetched: boolean;
  setAreHabitsFetched: (areHabitsFetched: boolean) => void;

  hasHabits: boolean;
  setHasHabits: (hasHabits: boolean) => void;

  habitsCount: number;
  setHabitsCount: (number: number) => void;

  tabValue: TabValues;
  setTabValue: (value: TabValues) => void;

  instance: {
    old: Habit;
    new: Habit;
    modified: Habit;
  };
  setInstance: (
    type: InstanceOptions | string,
    instanceObject: Habit | object
  ) => void;

  dialogs: { new: boolean; modify: boolean; info: boolean; delete: boolean };
  setDialog: (dialogName: DialogOptions | string, value: boolean) => void;
}

const habitStore: StateCreator<HabitStore> = (set, get) => ({
  habits: [],
  setHabits: (habits: Habit[]) => {
    set(() => ({ habits: habits }));
  },

  filteredHabits: [],
  setFilteredHabits: (filteredHabits: Habit[]) => {
    set(() => ({ filteredHabits: filteredHabits }));
  },

  addHabit: (habit: Habit) => {
    set((state) => ({
      habits: [habit, ...state.habits.filter((item) => item.$id !== habit.$id)],
      filteredHabits: [
        habit,
        ...state.filteredHabits.filter((item) => item.$id !== habit.$id),
      ],
    }));
  },

  updateHabit: (habit: Habit) => {
    set((state) => ({
      habits: state.habits.map((item) =>
        item.$id === habit.$id ? habit : item
      ),
      filteredHabits: state.filteredHabits.map((item) =>
        item.$id === habit.$id ? habit : item
      ),
    }));
  },

  removeHabit: (habit: Habit) => {
    set((state) => ({
      habits: state.habits.filter((item) => item.$id !== habit.$id),
      filteredHabits: state.filteredHabits.filter(
        (item) => item.$id !== habit.$id
      ),
    }));
  },

  habitsOrder: [],
  setHabitsOrder: (order: string[]) => {
    set(() => ({ habitsOrder: order }));
  },

  areHabitsFetched: false,
  setAreHabitsFetched: (areHabitsFetched: boolean) => {
    set(() => ({
      areHabitsFetched: areHabitsFetched,
    }));
  },

  hasHabits: false,
  setHasHabits: (hasHabits: boolean) => {
    set(() => ({ hasHabits: hasHabits }));
  },

  habitsCount: 0,
  setHabitsCount: (number: number) => {
    set(() => ({ habitsCount: number }));
  },

  tabValue: TabValues.Active,
  setTabValue: (value: TabValues) => {
    set(() => ({ tabValue: value }));
  },

  instance: {
    old: {} as Habit,
    new: {} as Habit,
    modified: {} as Habit,
  },
  /**
   * @param {type} type accepts either "new" or "modified"
   * @param {instanceObject} instanceObject
   **/
  setInstance: (
    type: InstanceOptions | string,
    instanceObject: Habit | object
  ) => {
    const instance = get().instance;
    if (type === "modified" && !Object.keys(instance.old).length) {
      // Create a deep copy of instanceObject
      const deepCopy = JSON.parse(JSON.stringify(instanceObject));
      set((state: any) => ({
        instance: { ...state.instance, old: deepCopy },
      }));
    }

    set((state: any) => ({
      instance: { ...state.instance, [type]: instanceObject },
    }));
  },

  dialogs: { new: false, modify: false, info: false, delete: false },
  /**
   * @param {dialogName} dialogName accepts either "new", "modify", "info" or "delete"
   * @param {value} value accepts a boolean value
   **/
  setDialog: (dialogName: DialogOptions | string, value: boolean) => {
    set((state: any) => ({
      dialogs: { ...state.dialogs, [dialogName]: value },
    }));
  },
});

export const useHabitStore = create(habitStore);
