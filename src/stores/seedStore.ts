import { create, StateCreator } from "zustand";
import { SeedDocument } from "../backend/database/schemas/Seed.model";

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

interface SeedDocumentStore {
  seeds: SeedDocument[];
  setSeeds: (seeds: SeedDocument[]) => void;

  addSeed: (seed: SeedDocument) => void;
  updateSeed: (seed: SeedDocument) => void;
  removeSeed: (seed: SeedDocument) => void;

  filteredSeeds: SeedDocument[];
  setFilteredSeeds: (filteredSeeds: SeedDocument[]) => void;

  seedsOrder: string[];
  setSeedsOrder: (order: string[]) => void;

  areSeedsFetched: boolean;
  setAreSeedsFetched: (areDailiesFetched: boolean) => void;

  seedsCount: number;
  setDailiesCount: (number: number) => void;

  tabValue: TabValues;
  setTabValue: (value: TabValues) => void;

  instance: {
    old: SeedDocument;
    new: SeedDocument;
    modified: SeedDocument;
  };
  setInstance: (type: InstanceOptions, instanceObject: SeedDocument) => void;

  dialogs: { new: boolean; modify: boolean; info: boolean; delete: boolean };
  setDialog: (dialogName: DialogOptions, value: boolean) => void;
}

const seedStore: StateCreator<SeedDocumentStore> = (set, get) => ({
  seeds: [],
  setSeeds: (seeds: SeedDocument[]) => {
    set(() => ({ seeds: seeds }));
  },

  filteredSeeds: [],
  setFilteredSeeds: (filteredSeeds: SeedDocument[]) => {
    set(() => ({ filteredSeeds: filteredSeeds }));
  },

  addSeed: (seedObject: SeedDocument) => {
    set((state) => ({
      seeds: [
        seedObject,
        ...state.seeds.filter((seed) => seed.$id !== seedObject.$id),
      ],
      filteredSeeds: [
        seedObject,
        ...state.filteredSeeds.filter((seed) => seed.$id !== seedObject.$id),
      ],
    }));
  },

  updateSeed: (seedObject: SeedDocument) => {
    set((state) => {
      const updatedSeeds = state.seeds.map((seed) =>
        /* @ts-ignore */
        seed.$id === seedObject.$id ? seedObject : seed
      );

      const updatedFilteredSeeds = state.filteredSeeds.map((seed) =>
        /* @ts-ignore */
        seed.$id === seedObject.$id ? seedObject : seed
      );

      return {
        seeds: updatedSeeds,
        filteredSeeds: updatedFilteredSeeds,
      };
    });
  },

  removeSeed: (seedObject: SeedDocument) => {
    set((state) => ({
      seeds: state.seeds.filter((seed) => seed.$id !== seedObject.$id),
      filteredSeeds: state.filteredSeeds.filter(
        (seed) => seed.$id !== seedObject.$id
      ),
    }));
  },

  seedsOrder: [],
  setSeedsOrder: (order: string[]) => {
    set(() => ({ seedsOrder: order }));
  },

  areSeedsFetched: false,
  setAreSeedsFetched: (areSeedsFetched: boolean) => {
    set(() => ({
      areSeedsFetched: areSeedsFetched,
    }));
  },

  seedsCount: 0,
  setDailiesCount: (number: number) => {
    set(() => ({ seedsCount: number }));
  },

  tabValue: TabValues.Due,
  setTabValue: (value: TabValues) => {
    set(() => ({ tabValue: value }));
  },

  instance: {
    old: {} as SeedDocument,
    new: {} as SeedDocument,
    modified: {} as SeedDocument,
  },
  /**
   * @param {type} type accepts either "new" or "modified"
   * @param {instanceObject} instanceObject
   **/
  setInstance: (type: InstanceOptions, instanceObject: SeedDocument) => {
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
  setDialog: (dialogName: DialogOptions, value: boolean) => {
    set((state: any) => ({
      dialogs: { ...state.dialogs, [dialogName]: value },
    }));
  },
});

export const useSeedStore = create(seedStore);
