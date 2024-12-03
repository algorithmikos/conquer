import { create, StateCreator } from "zustand";
import moment from "moment";
import { RecurringTask } from "../functions/backend/schemas/RecurringTask.model";

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
  Due = "due",
  NotDue = "not-due",
  All = "all",
}

interface RecurringTaskStore {
  dailies: RecurringTask[];
  setDailies: (dailies: RecurringTask[]) => void;

  addRecurringTask: (recurringTask: RecurringTask) => void;
  updateRecurringTask: (recurringTask: RecurringTask) => void;
  removeRecurringTask: (recurringTask: RecurringTask) => void;

  filteredDailies: RecurringTask[];
  setFilteredDailies: (filteredDailies: RecurringTask[]) => void;

  dailiesOrder: string[];
  setDailiesOrder: (order: string[]) => void;

  areDailiesFetched: boolean;
  setAreDailiesFetched: (areDailiesFetched: boolean) => void;
  hasRecurrings: boolean;
  setHasRecurrings: (hasRecurrings: boolean) => void;

  dailiesCount: number;
  setDailiesCount: (number: number) => void;

  tabValue: TabValues;
  setTabValue: (value: TabValues) => void;

  instance: {
    old: RecurringTask;
    new: RecurringTask;
    modified: RecurringTask;
  };
  setInstance: (type: InstanceOptions, instanceObject: RecurringTask) => void;

  dayOfRecord: string;
  setTimemachineDate: (date: string) => void;

  dialogs: { new: boolean; modify: boolean; info: boolean; delete: boolean };
  setDialog: (dialogName: DialogOptions, value: boolean) => void;

  recurringChecklistStatus: { [key: string]: boolean };
  setRecurringChecklistStatus: (newState: { [key: string]: boolean }) => void;
}

const recurringTaskStore: StateCreator<RecurringTaskStore> = (set, get) => ({
  dailies: [],
  setDailies: (dailies: RecurringTask[]) => {
    set(() => ({ dailies: dailies }));
  },

  filteredDailies: [],
  setFilteredDailies: (filteredDailies: RecurringTask[]) => {
    set(() => ({ filteredDailies: filteredDailies }));
  },

  addRecurringTask: (recurringTask: RecurringTask) => {
    set((state) => ({
      dailies: [
        recurringTask,
        ...state.dailies.filter((daily) => daily.$id !== recurringTask.$id),
      ],
      filteredDailies: [
        recurringTask,
        ...state.filteredDailies.filter(
          (daily) => daily.$id !== recurringTask.$id
        ),
      ],
    }));
  },

  updateRecurringTask: (recurringTask: RecurringTask) => {
    set((state) => {
      const updatedDailies = state.dailies.map((daily) =>
        /* @ts-ignore */
        daily.$id === recurringTask.$id ? recurringTask : daily
      );

      const updatedFilteredDailies = state.filteredDailies.map((daily) =>
        /* @ts-ignore */
        daily.$id === recurringTask.$id ? recurringTask : daily
      );

      return {
        dailies: updatedDailies,
        filteredDailies: updatedFilteredDailies,
      };
    });
  },

  removeRecurringTask: (recurringTask: RecurringTask) => {
    set((state) => ({
      dailies: state.dailies.filter((daily) => daily.$id !== recurringTask.$id),
      filteredDailies: state.filteredDailies.filter(
        (daily) => daily.$id !== recurringTask.$id
      ),
    }));
  },

  dailiesOrder: [],
  setDailiesOrder: (order: string[]) => {
    set(() => ({ dailiesOrder: order }));
  },

  areDailiesFetched: false,
  setAreDailiesFetched: (areDailiesFetched: boolean) => {
    set(() => ({
      areDailiesFetched: areDailiesFetched,
    }));
  },

  hasRecurrings: false,
  setHasRecurrings: (hasRecurrings: boolean) => {
    set(() => ({ hasRecurrings: hasRecurrings }));
  },

  dailiesCount: 0,
  setDailiesCount: (number: number) => {
    set(() => ({ dailiesCount: number }));
  },

  tabValue: TabValues.Due,
  setTabValue: (value: TabValues) => {
    set(() => ({ tabValue: value }));
  },

  instance: {
    old: {} as RecurringTask,
    new: {} as RecurringTask,
    modified: {} as RecurringTask,
  },
  /**
   * @param {type} type accepts either "new" or "modified"
   * @param {instanceObject} instanceObject
   **/
  setInstance: (type: InstanceOptions, instanceObject: RecurringTask) => {
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

  dayOfRecord: moment().format("YYYY-MM-DD"),
  setTimemachineDate: (date: string) => {
    set(() => ({
      dayOfRecord: date,
    }));
  },

  dialogs: { new: false, modify: false, info: false, delete: false },
  /**
   * @param {dialogName} dialogName accepts either "new", "modify", "info" or "delete"
   * @param {value} value accepts a boolean value
   **/
  setDialog: (dialogName: DialogOptions, value: boolean) => {
    set((state: any) => ({
      dialogs: { ...state.dialogs, [dialogName]: value },
    }));
  },

  recurringChecklistStatus: {},
  setRecurringChecklistStatus: (newState: { [key: string]: boolean }) => {
    set(() => ({
      recurringChecklistStatus: newState,
    }));
  },
});

export const useRecurringStore = create(recurringTaskStore);
