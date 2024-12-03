import { create, StateCreator } from "zustand";
import { SubRecurringTask } from "../backend/database/schemas/SubRecurringTask.model";

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

interface SubRecurringTaskStore {
  subRTs: SubRecurringTask[];
  setSubRTs: (rT_Checklists: SubRecurringTask[]) => void;

  addSubRT: (subRecurringTask: SubRecurringTask) => void;
  updateSubRT: (subRecurringTask: SubRecurringTask) => void;
  removeSubRT: (subRecurringTask: SubRecurringTask) => void;

  filteredSubRTs: SubRecurringTask[];
  setFilteredSubRTs: (filteredDailies: SubRecurringTask[]) => void;

  subRTsOrder: string[];
  setSubRTsOrder: (order: string[]) => void;

  areSubRTsFetched: boolean;
  setAreSubRTsFetched: (areDailiesFetched: boolean) => void;
}

const SubRecurringTaskStore: StateCreator<SubRecurringTaskStore> = (
  set,
  /* @ts-ignore */
  get
) => ({
  subRTs: [],
  setSubRTs: (rT_Checklists: SubRecurringTask[]) => {
    set(() => ({ subRTs: rT_Checklists }));
  },

  filteredSubRTs: [],
  setFilteredSubRTs: (filteredDailies: SubRecurringTask[]) => {
    set(() => ({ filteredSubRTs: filteredDailies }));
  },

  addSubRT: (subRecurringTask: SubRecurringTask) => {
    set((state) => ({
      subRTs: [
        subRecurringTask,
        ...state.subRTs.filter((subRT) => subRT.$id !== subRecurringTask.$id),
      ],
      filteredSubRTs: [
        subRecurringTask,
        ...state.filteredSubRTs.filter(
          (subRT) => subRT.$id !== subRecurringTask.$id
        ),
      ],
    }));
  },

  updateSubRT: (subRecurringTask: SubRecurringTask) => {
    set((state) => ({
      subRTs: [
        ...state.subRTs.map((subRT) =>
          /* @ts-ignore */
          subRT.$id === subRecurringTask.$id ? subRecurringTask : subRT
        ),
      ],

      filteredSubRTs: [
        ...state.filteredSubRTs.map((subRT) =>
          /* @ts-ignore */
          subRT.$id === subRecurringTask.$id ? subRecurringTask : subRT
        ),
      ],
    }));
  },

  removeSubRT: (subRecurringTask: SubRecurringTask) => {
    set((state) => ({
      subRTs: state.subRTs.filter((subRT) => subRT.$id !== subRecurringTask.$id),
      filteredSubRTs: state.filteredSubRTs.filter(
        (subRT) => subRT.$id !== subRecurringTask.$id
      ),
    }));
  },

  subRTsOrder: [],
  setSubRTsOrder: (order: string[]) => {
    set(() => ({ subRTsOrder: order }));
  },

  areSubRTsFetched: false,
  setAreSubRTsFetched: (areSubRTsFetched: boolean) => {
    set(() => ({
      areSubRTsFetched: areSubRTsFetched,
    }));
  },
});

export const useSubRecurringStore = create(SubRecurringTaskStore);
