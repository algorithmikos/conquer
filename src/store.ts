// @ts-nocheck
import { create } from "zustand";
import { DialogOptions, InstanceOptions } from "./stores/recurring";

// BaseStore.ts

const baseStore = (set, get) => ({
  items: [],
  setItems: (items) => {
    set(() => ({ items: items }));
  },

  areItemsFetched: false,
  setAreItemsFetched: (areItemsFetched) => {
    set(() => ({
      areItemsFetched: areItemsFetched,
    }));
  },

  addItem: (item) => {
    set((state: any) => ({
      items: [item, ...state.items],
    }));
  },

  updateItem: (item) => {
    set((state: any) => ({
      items: state.items.map((i) => (i.$id === item.$id ? item : i)),
    }));
  },

  removeItem: (itemId) => {
    set((state: any) => ({
      items: state.items.filter((i) => i.$id !== itemId),
    }));
  },

  // instance: { old: {}, new: {}, modified: {} },
  // setInstance: (type, instanceObject) => {
  //   const instance = get().instance;
  //   if (type === "modified" && !Object.keys(instance.old).length) {
  //     // Create a deep copy of instanceObject
  //     const deepCopy = JSON.parse(JSON.stringify(instanceObject));
  //     set((state: any) => ({
  //       instance: { ...state.instance, old: deepCopy },
  //     }));
  //   }

  //   set((state) => ({
  //     instance: { ...state.instance, [type]: instanceObject },
  //   }));
  // },

  // dialogs: { new: false, modify: false, delete: false },
  // setDialog: (dialogName, value) => {
  //   set((state) => ({
  //     dialogs: { ...state.dialogs, [dialogName]: value },
  //   }));
  // },
});

const todoStore = (set, get) => ({
  todos: [],
  setTodos: (todos) => {
    set(() => ({ todos: todos }));
  },

  filteredJobs: [],
  setFilteredJobs: (filteredJobs) => {
    set(() => ({ filteredJobs: filteredJobs }));
  },

  areTodosFetched: false,
  setAreTodosFetched: (areTodosFetched) => {
    set(() => ({
      areTodosFetched: areTodosFetched,
    }));
  },
  hasJobs: false,
  setHasJobs: (hasJobs) => {
    set(() => ({ hasJobs: hasJobs }));
  },

  todosCount: 0,
  setTodosCount: (number) => {
    set(() => ({ todosCount: number }));
  },

  tabValue: "all",
  setTabValue: (value) => {
    set(() => ({ tabValue: value }));
  },

  modifiedTodo: {},
  setModifiedTodo: (todo) => {
    set(() => ({
      modifiedTodo: { ...todo },
    }));
  },

  instance: { old: {}, new: {}, modified: {} },
  /**
   * @param {type} type accepts either "new" or "modified"
   * @param {instanceObject} instanceObject
   **/
  setInstance: (type, instanceObject) => {
    const instance = get().instance;
    if (type === "modified" && !Object.keys(instance.old).length) {
      // Create a deep copy of instanceObject
      const deepCopy = JSON.parse(JSON.stringify(instanceObject));
      set((state: any) => ({
        instance: { ...state.instance, old: deepCopy },
      }));
    }

    set((state) => ({
      instance: { ...state.instance, [type]: instanceObject },
    }));
  },

  dialogs: { new: false, modify: false, delete: false },
  /**
   * @param {dialogName} dialogName accepts either "new", "modify" or "delete"
   * @param {value} Value accepts a boolean value
   **/

  setDialog: (dialogName, value) => {
    set((state) => ({
      dialogs: { ...state.dialogs, [dialogName]: value },
    }));
  },

  addJob: (job) => {
    set((state) => ({
      todos: [job, ...state.todos],
      filteredJobs: [job, ...state.filteredJobs],
    }));
  },

  updateJob: (job) => {
    set((state) => ({
      todos: state.todos.map((t) => (t.$id === job.$id ? job : t)),
      filteredJobs: state.filteredJobs.map((t) =>
        t.$id === job.$id ? job : t
      ),
    }));
  },

  removeJob: (job) => {
    set((state) => ({
      todos: state.todos.filter((t) => t.$id !== job.$id),
      filteredJobs: state.filteredJobs.filter((t) => t.$id !== job.$id),
    }));
  },

  jobChecklistStatus: {},
  setJobChecklistStatus: (newState) => {
    set(() => ({
      jobChecklistStatus: newState,
    }));
  },

  getTodoById: (id) => {
    const todos = get().todos;

    return todos.find((todo) => todo.$id === id);
  },
});

const projectStore = (set, get) => ({
  projects: [],
  setProjects: (projects) => {
    set(() => ({ projects: projects }));
  },

  filteredProjects: [],
  setFilteredProjects: (filteredProjects) => {
    set(() => ({ filteredProjects: filteredProjects }));
  },

  modifiedProject: {},
  setModifiedProject: (project) => {
    set(() => ({
      modifiedProject: { ...project },
    }));
  },

  areProjectsFetched: false,
  setAreProjectsFetched: (areProjectsFetched) => {
    set(() => ({
      areProjectsFetched: areProjectsFetched,
    }));
  },

  instance: {
    old: {} as { [key: string]: any },
    new: {} as { [key: string]: any },
    modified: {} as { [key: string]: any },
  },

  /**
   * Sets the instance of the project store based on the provided type and instance object.
   *
   * @param {InstanceOptions} type - The type of instance to set (e.g. "new", "modified").
   * @param {instanceObject} instanceObject - The instance object to set.
   * @return {void}
   */
  setInstance: (
    type: InstanceOptions,
    instanceObject: { [key: string]: any }
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
   * Sets the state of a dialog based on the provided dialog name and value.
   *
   * @param {DialogOptions} dialogName - The name of the dialog to set the state for.
   * @param {boolean} value - The state to set for the dialog.
   * @return {void}
   */
  setDialog: (dialogName: DialogOptions, value: boolean) => {
    set((state: any) => ({
      dialogs: { ...state.dialogs, [dialogName]: value },
    }));
  },

  addQuest: (quest) => {
    set((state) => ({
      projects: [quest, ...state.projects],
      filteredProjects: [quest, ...state.filteredProjects],
    }));
  },

  updateQuest: (quest) => {
    set((state) => ({
      projects: state.projects.map((p) => (p.$id === quest.$id ? quest : p)),
      filteredProjects: state.filteredProjects.map((p) =>
        p.$id === quest.$id ? quest : p
      ),
    }));
  },

  removeQuest: (quest) => {
    set((state) => ({
      projects: state.projects.filter((p) => p.$id !== quest.$id),
      filteredProjects: state.filteredProjects.filter(
        (p) => p.$id !== quest.$id
      ),
    }));
  },

  getProjectById: (id) => {
    const projects = get().projects;
    return projects.find((project) => project.$id === id);
  },
});

const pillarStore = (set, get) => ({
  pillars: [],
  setPillars: (pillars) => {
    set(() => ({ pillars: pillars }));
  },

  filteredPillars: [],
  setFilteredPillars: (filteredPillars) => {
    set(() => ({ filteredPillars: filteredPillars }));
  },

  arePillarsFetched: false,
  setArePillarsFetched: (arePillarsFetched) => {
    set(() => ({
      arePillarsFetched: arePillarsFetched,
    }));
  },

  instance: { old: {}, new: {}, modified: {} },
  /**
   * @param {type} type accepts either "new" or "modified"
   * @param {instanceObject} instanceObject
   **/
  setInstance: (type, instanceObject) => {
    const instance = get().instance;
    if (type === "modified" && !Object.keys(instance.old).length) {
      // Create a deep copy of instanceObject
      const deepCopy = JSON.parse(JSON.stringify(instanceObject));
      set((state: any) => ({
        instance: { ...state.instance, old: deepCopy },
      }));
    }

    set((state) => ({
      instance: { ...state.instance, [type]: instanceObject },
    }));
  },

  dialogs: { new: false, modify: false, delete: false },
  /**
   * @param {dialogName} dialogName accepts either "new", "modify" or "delete"
   * @param {value} Value accepts a boolean value
   **/

  setDialog: (dialogName, value) => {
    set((state) => ({
      dialogs: { ...state.dialogs, [dialogName]: value },
    }));
  },

  setModifiedPillar: (pillar) => {
    set(() => ({
      modifiedPillar: { ...pillar },
    }));
  },

  addPillar: (pillar) => {
    set((state) => ({
      pillars: [pillar, ...state.pillars],
      filteredPillars: [pillar, ...state.filteredPillars],
    }));
  },

  updatePillar: (pillar) => {
    set((state) => ({
      pillars: state.pillars.map((p) => (p.$id === pillar.$id ? pillar : p)),
      filteredPillars: state.filteredPillars.map((p) =>
        p.$id === pillar.$id ? pillar : p
      ),
    }));
  },

  removePillar: (pillar) => {
    set((state) => ({
      pillars: state.pillars.filter((p) => p.$id !== pillar.$id),
      filteredPillars: state.filteredPillars.filter(
        (p) => p.$id !== pillar.$id
      ),
    }));
  },

  getPillarById: (id) => {
    const pillars = get().pillars;
    return pillars.find((pillar) => pillar.$id === id);
  },
});

const utilsStore = (set, get) => ({
  searchTerm: "",
  setSearchTerm: (searchTerm) => {
    set(() => ({
      searchTerm: searchTerm,
    }));
  },

  isDraggable: false,
  setIsDraggable: (isDraggable) => {
    set(() => ({
      isDraggable: isDraggable,
    }));
  },

  showMobileSidebar: false,
  setShowMobileSidebar: (value) => {
    set(() => ({
      showMobileSidebar: value,
    }));
  },

  expandSidebar: false,
  setExpandSidebar: (value) => {
    set(() => ({
      expandSidebar: value,
    }));
  },

  expandRightSidebar: false,
  setExpandRightSidebar: (value) => {
    set(() => ({
      expandRightSidebar: value,
    }));
  },

  lang: localStorage.getItem("lang") || "en",
  setLang: (value) => {
    set(() => ({
      lang: value,
    }));
  },

  colors: localStorage.getItem("colors")
    ? JSON.parse(localStorage.getItem("colors"))
    : {
        main_bg_gradient: "var(--main-bg-gradient)",
        column_bg_color: "var(--bg-blue)",

        main_color: "var(--main-color)",
        main_bg_color: "var(--main-bg-color)",
      },
  setColors: (colorsObject) => {
    set(() => ({
      colors: colorsObject,
    }));

    localStorage.setItem("colors", JSON.stringify(colorsObject));
  },

  hideContent: false,
  setHideContent: (value) => {
    set(() => ({
      hideContent: value,
    }));
  },

  userDBDoc: JSON.parse(localStorage.getItem("userDBDoc")) || {},
  setUserDBDoc: (userDBDoc) => {
    set(() => ({
      userDBDoc: userDBDoc,
    }));

    localStorage.setItem("userDBDoc", JSON.stringify(userDBDoc));
  },

  profilePic: "",
  setProfilePic: (newPic) => {
    set(() => ({
      profilePic: newPic,
    }));
  },

  isAppLoading: true,
  setIsAppLoading: (isAppLoading) => {
    set(() => ({
      isAppLoading: isAppLoading,
    }));
  },

  modifiedTask: {},
  setModifiedTask: (task) => {
    set(() => ({
      modifiedTask: { ...task },
    }));
  },

  checklist: [],
  setChecklist: (updatedChecklist) => {
    set(() => ({ checklist: updatedChecklist }));
  },

  listItems: [],
  setListItems: (updatedItems) => {
    set(() => ({ listItems: updatedItems }));
  },
});

const authStore = (set, get) => ({
  authenticated: localStorage.getItem("authState") ? true : false,

  setAuthenticated: (state) => {
    set(() => ({
      authenticated: state,
    }));
  },

  userAuthDoc: JSON.parse(localStorage.getItem("userAuthDoc")) || {},
  setUserAuthDoc: (userAuthObj) => {
    set(() => ({
      userAuthDoc: userAuthObj,
    }));

    if (Object.keys(userAuthObj).length) {
      localStorage.setItem("userAuthDoc", JSON.stringify(userAuthObj));
    } else {
      localStorage.removeItem("userAuthDoc");
    }
  },
});

const userStore = (set, get) => ({
  systems: [],
  setSystems: (systems) => {
    set(() => ({
      systems: systems,
    }));
  },
  areSystemsFetched: false,
  setAreSystemsFetched: (state) => {
    set(() => ({
      areSystemsFetched: state,
    }));
  },

  fields: [{ modifier: false }],
  fieldsNumber: 1,
  systemData: {},
  systemHolder: "",

  setFieldsNumber: (fieldsNumber) => {
    set(() => ({
      fieldsNumber: fieldsNumber,
    }));
  },
  setFields: (fields) => {
    set(() => ({
      fields: fields,
      fieldsNumber: fields.length,
    }));
  },
  setSystemData: (systemData) => {
    set(() => ({
      systemData: systemData,
    }));
  },
  setSystemHolder: (systemHolder) => {
    set(() => ({
      systemHolder: systemHolder,
    }));
  },

  newSystemDialog: false,
  setNewSystemDialog: (state) => {
    set(() => ({
      newSystemDialog: state,
    }));
  },

  editSystemDialog: false,
  setEditSystemDialog: (state) => {
    set(() => ({
      editSystemDialog: state,
    }));
  },

  newInstanceDialog: false,
  setNewInstanceDialog: (state) => {
    set(() => ({
      newInstanceDialog: state,
    }));
  },
  editInstanceDialog: false,
  setEditInstanceDialog: (state) => {
    set(() => ({
      editInstanceDialog: state,
    }));
  },

  systemInstance: {},
  setSystemInstance: (instance) => {
    set(() => ({
      systemInstance: instance,
    }));
  },

  systemInstances: [],
  setSystemInstances: (instances) => {
    set(() => ({
      systemInstances: instances,
    }));
  },
  areInstancesFetched: false,
  setAreInstancesFetched: (state) => {
    set(() => ({
      areInstancesFetched: state,
    }));
  },

  selectedSystem: "",
  setSelectedSystem: (systemId) => {
    set(() => ({
      selectedSystem: systemId,
    }));
  },
});

export const useTodoStore = create(todoStore);
export const useProjectStore = create(projectStore);
export const usePillarStore = create(pillarStore);
export const useUtilsStore = create(utilsStore);
export const useAuthStore = create(authStore);
export const useUserStore = create(userStore);

export const useTestStore = create((set, get) => ({
  ...baseStore(set, get),
}));
