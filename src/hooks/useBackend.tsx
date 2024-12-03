// @ts-nocheck
import { useEffect, useRef, useState } from "react";
import { useRecurringStore } from "../stores/recurring";
import useNetworkStatus from "./useNetworkStatus";
import { CollectionOptions, dbm } from "../backend/database/dbm";
import {
  account,
  client,
  collections,
  originDatabase,
  storage,
} from "../appwrite.config";
import {
  usePillarStore,
  useProjectStore,
  useTodoStore,
  useUtilsStore,
} from "../store";
import { deleteRecurringTask } from "../functions/backend/functions/RecurringTask";
import { useSubRecurringStore } from "../stores/subRecurring";
import { useHabitStore } from "../stores/habit";
import { serverToClientHabit } from "../backend/database/schemas/Habit.model";
import { serverToClientJob } from "../backend/database/schemas/Job.model";
import { AppwriteException, ImageGravity } from "appwrite";
import {
  cacheProfilePicture,
  convertImageToBase64,
  getCachedProfilePicture,
} from "../functions/cacheImageService";
import { database } from "../backend/database/database";
import moment from "moment";
import { useSeedStore } from "../stores/seedStore";

const useBackend = () => {
  const isOnline = useNetworkStatus();

  const dailyState = useRecurringStore((state) => state);
  const {
    dailies,
    setDailies,
    setFilteredDailies,
    setAreDailiesFetched,
    addRecurringTask,
    updateRecurringTask,
    removeRecurringTask,
  } = dailyState;

  const subRTState = useSubRecurringStore((state) => state);
  const {
    subRTs,

    setSubRTs,
    setFilteredSubRTs,

    setAreSubRTsFetched,

    addSubRT,
    updateSubRT,
    removeSubRT,
  } = subRTState;

  const jobState = useTodoStore((state) => state);
  const {
    todos,
    setTodos,
    setFilteredJobs,
    setAreTodosFetched,

    addJob,
    updateJob,
    removeJob,
  } = jobState;

  const habitState = useHabitStore((state) => state);
  const {
    habits,
    setHabits,
    setFilteredHabits,
    setAreHabitsFetched,

    addHabit,
    updateHabit,
    removeHabit,
  } = habitState;

  const pillarState = usePillarStore((state) => state);
  const {
    pillars,
    setPillars,
    setFilteredPillars,
    setArePillarsFetched,

    addPillar,
    updatePillar,
    removePillar,
  } = pillarState;

  const projectState = useProjectStore((state) => state);
  const {
    projects,
    setProjects,
    setFilteredProjects,
    setAreProjectsFetched,

    addProject,
    updateProject,
    removeProject,
  } = projectState;

  const {
    seeds,
    setSeeds,
    setFilteredSeeds,
    setAreSeedsFetched,

    addSeed,
    updateSeed,
    removeSeed,
  } = useSeedStore();

  const utilsState = useUtilsStore((state) => state);
  const { searchTerm, setProfilePic } = utilsState;

  const [users, setUsers] = useState([]);
  const [areUsersFetched, setAreUsersFetched] = useState(false);

  const dailiesRef = useRef(dailies);
  const jobsRef = useRef(todos);
  const habitsRef = useRef(habits);
  const usersRef = useRef(users);

  useEffect(() => {
    dailiesRef.current = dailies;
  }, [dailies]);

  useEffect(() => {
    jobsRef.current = todos;
  }, [todos]);

  const collectionStateFactory = (collectionName) => {
    switch (collectionName) {
      case "recurringTasks":
        return {
          state: dailiesRef.current,
          add: addRecurringTask,
          update: updateRecurringTask,
          remove: removeRecurringTask,
        };
      case "rT_Checklists":
        return {
          state: subRTs,
          add: addSubRT,
          update: updateSubRT,
          remove: removeSubRT,
        };
      case "jobs":
        return {
          state: jobsRef.current,
          add: (job) => addJob(serverToClientJob(job)),
          update: (job) => updateJob(serverToClientJob(job)),
          remove: removeJob,
        };
      case "habits":
        return {
          state: habitsRef.current,
          add: (habit) => addHabit(serverToClientHabit(habit)),
          update: (habit) => updateHabit(serverToClientHabit(habit)),
          remove: removeHabit,
        };
      case "pillars":
        return {
          state: pillars,
          add: addPillar,
          update: updatePillar,
          remove: removePillar,
        };
      case "projects":
        return {
          state: projects,
          add: addProject,
          update: updateProject,
          remove: removeProject,
        };
      case "plants":
        return {
          state: seeds,
          add: addSeed,
          update: updateSeed,
          remove: removeSeed,
        };
      case "users":
        return {
          state: usersRef.current,
          add: () => {},
          update: () => {},
          remove: () => {},
        };
      default:
        return { state: [], add: () => {}, update: () => {}, remove: () => {} };
    }
  };

  const subscribeToDocuments = () => {
    const unsubscribe = client.subscribe(
      `documents`,
      // `databases.${originDatabase}.collections.${[
      //   collections.recurringTasks,
      // ]}.documents`
      async (response) => {
        console.log(response);

        const collectionName = Object.keys(collections).filter(
          (key) => collections[key] === response.payload.$collectionId
        )?.[0];

        const { state, add, update, remove } =
          collectionStateFactory(collectionName);

        // Check if the document exists in the memory state
        const isDocumentAlreadyPresent = state.find((doc) => {
          return doc.$id === response.payload.$id;
        });

        /***** Handle CRUD Events *****/

        // Handle "Create" Event
        if (response.events[0].includes("create")) {
          if (!isDocumentAlreadyPresent) {
            add(response.payload);
          }

          // Check if the document exists in the cache storage
          await dbm
            .getDocFromCache(collectionName, response.payload.$id)
            .catch((e) => {
              // If the document does not exist in the cache, create it
              if (e.status === 404) {
                dbm.createCacheDoc(
                  CollectionOptions[collectionName],
                  response.payload
                );
              } else {
                // Throw an error if there is any other error
                console.error(`From ${collectionName} listener`, e);
              }
            });
        }

        // Handle "Update" Event
        if (response.events[0].includes("update")) {
          const cachedDoc = await dbm
            .getDocFromCache(
              CollectionOptions[collectionName],
              response.payload.$id
            )
            .catch((e) => {
              // If the document does not exist in the cache, create it in cache and add it to memory state
              if (e.status === 404) {
                dbm.createCacheDoc(
                  CollectionOptions[collectionName],
                  response.payload
                );
                add(response.payload);
              } else {
                // Throw an error if there is any other error
                console.error(`From ${collectionName} listener`, e);
              }
            });

          if (isDocumentAlreadyPresent && cachedDoc) {
            // Update the memory state
            update({
              ...cachedDoc,
              ...response.payload,
            });

            // Update the cache
            await dbm.updateCacheDoc(
              CollectionOptions[collectionName],
              response.payload.$id,
              {
                ...cachedDoc,
                ...response.payload,
                pendingUpdate: false,
              }
            );
          }
        }

        // Handle "Delete" Event
        if (response.events[0].includes("delete")) {
          const cachedDoc = await dbm
            .getDocFromCache(
              CollectionOptions[collectionName],
              response.payload.$id
            )
            .catch((e) => {
              // If the document does not exist in the cache, do nothing
              if (e.status === 404) {
                console.log("Already deleted");
              } else {
                // Throw an error if there is any other error
                console.error("From rTasks listener", e);
              }
            });

          if (isDocumentAlreadyPresent && cachedDoc) {
            // Update the memory state
            remove(response.payload);
            // Update the cache
            dbm.deleteCacheDoc(
              CollectionOptions[collectionName],
              response.payload.$id
            );
          }
        }
      }
    );

    return unsubscribe; // Return the unsubscribe function for cleanup
  };

  const subscribeToAccount = () => {
    return client.subscribe(`account`, async (event) => {
      console.log(event);
    });
  };

  const fetchProfilePic = async (currentUser) => {
    const profilePic = await dbm.getDocFromCache("localStorage", "profilePic");

    if (profilePic === undefined) {
      console.log("no profile pic");
      console.log("fetching profile pic...");

      const userFiles = await storage.listFiles(
        "670cdab70027c6802321", // bucketId
        [],
        currentUser?.$id
      );

      if (userFiles && userFiles.files.length > 0) {
        const targetedFileId = userFiles.files.find(
          (file) => file.name === currentUser?.$id
        )?.$id;

        if (!targetedFileId) {
          console.log("No profile pic found");
          return;
        }

        // Creating a link to fetch
        const requestedFile = storage.getFilePreview(
          "670cdab70027c6802321", // bucketId
          targetedFileId, // fileId
          250,
          250,
          ImageGravity.Center
        );

        if (!requestedFile) {
          console.log("No profile pic found");
          return;
        }

        const base64String = await convertImageToBase64(requestedFile.href);

        await dbm.createCacheDoc("localStorage", {
          $id: "profilePic",
          base64: base64String,
          imgId: targetedFileId,
        });

        setProfilePic(base64String);
      }
    } else {
      const fileStillExists = storage.getFile(
        "670cdab70027c6802321", // bucketId
        profilePic.imgId
      );

      fileStillExists.then(
        // Found
        () => setProfilePic(profilePic.base64),
        // Not Found
        async (e: AppwriteException) => {
          if (e.code === 404) {
            await dbm.deleteCacheDoc("localStorage", "profilePic");
            setProfilePic("");

            // Search for a new file
            const foundedUserFiles = await storage.listFiles(
              "670cdab70027c6802321", // bucketId
              [],
              currentUser?.$id
            );

            if (foundedUserFiles && foundedUserFiles.files.length > 0) {
              fetchProfilePic(currentUser);
            }
          } else {
            setProfilePic(profilePic.base64);
          }
        }
      );
    }
  };

  const sortCollection = (a, b, reference) => {
    return reference.indexOf(a.$id) - reference.indexOf(b.$id);
  };

  useEffect(() => {
    const fetchData = async () => {
      const currentUser = JSON.parse(localStorage.getItem("currentUser"));

      const targetedCollections = [
        {
          collection: CollectionOptions.users,
          collectionSetter: setUsers,
          collectionFetchingFlagger: setAreUsersFetched,
        },
        {
          collection: CollectionOptions.recurringTasks,
          collectionSetter: setDailies,
          collectionFetchingFlagger: setAreDailiesFetched,
          collectionFilterationSetter: setFilteredDailies,
          sortingArray: "rTaskOrder",
        },
        {
          collection: CollectionOptions.rT_Checklists,
          collectionSetter: setSubRTs,
          collectionFetchingFlagger: setAreSubRTsFetched,
          collectionFilterationSetter: setFilteredSubRTs,
          sortingArray: "",
        },
        {
          collection: CollectionOptions.jobs,
          collectionSetter: setTodos,
          collectionFetchingFlagger: setAreTodosFetched,
          collectionFilterationSetter: setFilteredJobs,
          sortingArray: "jobOrder",
        },
        {
          collection: CollectionOptions.habits,
          collectionSetter: setHabits,
          collectionFetchingFlagger: setAreHabitsFetched,
          collectionFilterationSetter: setFilteredHabits,
          sortingArray: "habitOrder",
        },
        {
          collection: CollectionOptions.pillars,
          collectionSetter: setPillars,
          collectionFetchingFlagger: setArePillarsFetched,
          collectionFilterationSetter: setFilteredPillars,
          sortingArray: "pillarOrder",
        },
        {
          collection: CollectionOptions.projects,
          collectionSetter: setProjects,
          collectionFetchingFlagger: setAreProjectsFetched,
          collectionFilterationSetter: setFilteredProjects,
          sortingArray: "questOrder",
        },
        {
          collection: CollectionOptions.plants,
          collectionSetter: setSeeds,
          collectionFetchingFlagger: setAreSeedsFetched,
          collectionFilterationSetter: setFilteredSeeds,
          sortingArray: "plantOrder",
        },
      ];

      for (let [index, collection] of targetedCollections.entries()) {
        if (index > 0) {
          const userDocument = await dbm.getDocFromCache(
            CollectionOptions.users,
            currentUser.$id
          );
          await dbm.getDocs(
            collection.collection,
            isOnline,
            collection.collectionSetter,
            collection.collectionFetchingFlagger,
            collection.collectionFilterationSetter,
            userDocument[collection.sortingArray] ?? []
          );
        } else {
          await dbm.getDocs(
            collection.collection,
            isOnline,
            collection.collectionSetter,
            collection.collectionFetchingFlagger
          );
        }
      }

      await fetchProfilePic(currentUser);

      const prefs = account
        .getPrefs()
        .then((prefs) => {
          localStorage.setItem("prefs", JSON.stringify(prefs));
        })
        .catch((e) => console.error(e));
    };

    fetchData();

    const unsubscribeToRecurringTasks = subscribeToDocuments();
    const unsubscribeToAccount = subscribeToAccount();

    // Closes the subscription.
    return () => {
      unsubscribeToRecurringTasks();
      unsubscribeToAccount();
    };
  }, [isOnline]);
};

export default useBackend;
