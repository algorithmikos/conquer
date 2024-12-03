import { toast } from "react-toastify";
import { RecurringTask } from "../schemas/RecurringTask.model";
import { CollectionOptions, dbm } from "../../../backend/database/dbm";
import { account } from "../../../appwrite.config";
import { RecurringTaskSchema } from "../../../backend/database/schemas/RecurringTask.model";
import {
  SubRecurringTask,
  SubRecurringTaskSchema,
} from "../../../backend/database/schemas/SubRecurringTask.model";
import { v4 as uuid } from "uuid";
import { useRecurringStore } from "../../../stores/recurring";
import { useSubRecurringStore } from "../../../stores/subRecurring";
import moment from "moment";
import { useUtilsStore } from "../../../store";

const RecurringTaskController = () => {
  const {
    addRecurringTask,
    updateRecurringTask: updateRTaskState,
    removeRecurringTask,

    dayOfRecord,
    dailies: recurrings,
    setDailies: setRecurrings,
    setFilteredDailies: setFilteredRecurrings,
  } = useRecurringStore((state) => state);

  const { addSubRT, updateSubRT } = useSubRecurringStore((state) => state);

  const searchTerm = useUtilsStore((state) => state.searchTerm);

  const createRecurringTask = async (task: RecurringTask) => {
    const mainTaskId = uuid();
    const appwriteUser = await account.get();
    // Timestamping creation date and adding User Doc Ref
    const cleanTaskData = {
      ...task,
      title: task.title.trimEnd(),
      user: appwriteUser.$id,
      status: task.status || "active",
      repeats: task.repeats || "daily",
      repeatOccurance: Number(task.repeatOccurance) || 1,
    };

    if (task.description) {
      cleanTaskData.description = task.description.trimEnd();
    }

    /* @ts-ignore */
    if (task.checklist && task.checklistChanges) {
      /* @ts-ignore */
      for (const item of task.checklistChanges) {
        const cleanItem = {
          ...item,
        };

        delete cleanItem.new;
        cleanItem.updated && delete cleanItem.updated;

        if (!cleanItem.deleted) {
          addSubRT({ ...cleanItem, recurringTask: mainTaskId });
          await dbm.createServerDoc(
            CollectionOptions.rT_Checklists,
            { ...cleanItem, recurringTask: mainTaskId },
            SubRecurringTaskSchema
          );
        }
      }

      /* @ts-ignore */
      delete cleanTaskData.checklistChanges;
    }

    /* @ts-ignore */
    addRecurringTask({ ...cleanTaskData, $id: mainTaskId });
    await dbm.createServerDoc(
      CollectionOptions.recurringTasks,
      { $id: mainTaskId, ...cleanTaskData },
      RecurringTaskSchema,
      "rTask"
    );

    // Get the existing order of recurring tasks array
    const userDocSnap = await dbm.getDocFromServer(
      CollectionOptions.users,
      appwriteUser.$id
    );
    const existingRecurringTaskOrder = userDocSnap?.rTaskOrder ?? [];

    // Update the dailiesOrder array with the new task ID
    const updatedRecurringTaskOrder = [
      mainTaskId,
      ...existingRecurringTaskOrder,
    ];

    // Update the user document with the updated dailiesOrder
    await dbm.updateServerDoc(CollectionOptions.users, appwriteUser.$id, {
      rTaskOrder: updatedRecurringTaskOrder,
    });
  };

  const updateRecurringTask = async (
    updatedTaskData: RecurringTask,
    updatedTaskId: string
  ) => {
    if (!Object.keys(updatedTaskData).length) {
      toast.error("Could not recieve changes. Refresh the app and try again.");
      return;
    }

    if (!updatedTaskId) {
      toast.error("Could not set the task. Refresh the app and try again.");
      return;
    }

    // Timestamping creation date and adding User Doc Ref
    const cleanTaskData = {
      ...updatedTaskData,
    };

    if (updatedTaskData.title) {
      cleanTaskData.title = updatedTaskData.title.trimEnd();
    }

    if (updatedTaskData.description) {
      cleanTaskData.description = updatedTaskData.description.trimEnd();
    }

    if (updatedTaskData.repeatOccurance) {
      cleanTaskData.repeatOccurance = Number(updatedTaskData.repeatOccurance);
    }

    /* @ts-ignore */
    if (updatedTaskData.checklistChanges) {
      /* @ts-ignore */
      for (const itemDoc of updatedTaskData.checklistChanges) {
        console.log(itemDoc);

        if (itemDoc.new) {
          addSubRT({ ...itemDoc, recurringTask: updatedTaskId });
          dbm
            .createServerDoc(
              CollectionOptions.rT_Checklists,
              {
                $id: itemDoc.$id,
                id: itemDoc.$id,
                item: itemDoc.item,
                recurringTask: updatedTaskId,
              },
              SubRecurringTaskSchema
            )
            .then(() => {
              console.log("Checklist item created");
            })
            .catch((error) => {
              console.warn(error);
            });
        }

        if (itemDoc.updated && !itemDoc.new) {
          updateSubRT({ ...itemDoc, recurringTask: updatedTaskId });
          await dbm.updateServerDoc(
            CollectionOptions.rT_Checklists,
            itemDoc.$id,
            { item: itemDoc.item }
          );
        }

        if (itemDoc.deleted) {
          updateRTaskState({ ...itemDoc, recurringTask: updatedTaskId });
          await dbm.deleteServerDoc(
            CollectionOptions.rT_Checklists,
            itemDoc.$id
          );
        }
      }
      /* @ts-ignore */
      delete cleanTaskData.checklistChanges;
    }

    const fullTaskDoc = await dbm.getDocFromCache(
      CollectionOptions.recurringTasks,
      updatedTaskId
    );

    /* @ts-ignore */
    updateRTaskState({ ...fullTaskDoc, ...cleanTaskData });
    // Appwrite update
    await dbm.updateServerDoc(
      CollectionOptions.recurringTasks,
      updatedTaskId,
      cleanTaskData
    );
  };

  const deleteRecurringTask = async (taskId: string) => {
    const appwriteUser = await account.get();

    if (!taskId) return;

    /* @ts-ignore */
    removeRecurringTask({ id: taskId, $id: taskId });

    dbm.deleteServerDoc(CollectionOptions.recurringTasks, taskId).then(() => {
      toast.success("Recurring Task Deleted");
    });

    dbm
      .getDocFromServer(CollectionOptions.users, appwriteUser.$id)
      .then((appwriteUserDoc) => {
        if (appwriteUserDoc) {
          dbm.updateServerDoc(CollectionOptions.users, appwriteUser.$id, {
            rTaskOrder: appwriteUserDoc.rTaskOrder.filter(
              /* @ts-ignore */
              (id) => id !== taskId
            ),
          });
        }
      })
      .catch((error) => {
        if (error.status === 404) {
          console.log("Recurring Task not found on server");
        } else {
          console.warn(error);
        }
      });
  };

  const handleRecurringTaskCheck = async (
    recurring: RecurringTask,
    dateOfRecord?: string
  ) => {
    const completionDate = moment
      .utc(dateOfRecord ?? dayOfRecord)
      .set("hour", 0)
      .valueOf();

    if (
      recurring.skippedDates &&
      recurring.skippedDates.length > 0 &&
      recurring.skippedDates.includes(completionDate)
    ) {
      /* @ts-ignore */
      dbm.updateServerDoc(CollectionOptions.recurringTasks, recurring.$id, {
        skippedDates: recurring.skippedDates.filter(
          (date: number) => date !== completionDate
        ),
      });
      return;
    }

    // Update the state in the frontend for fast checking/unchecking
    const updatedRecurring = { ...recurring };
    let updatedCompletedDates;

    if (updatedRecurring.completedDates) {
      // Create a copy of the completedDates array to avoid modifying the original
      const completedDates = [...updatedRecurring.completedDates];

      // Does it already exist?
      const dateExist = completedDates.includes(completionDate);

      if (dateExist) {
        updatedCompletedDates = completedDates.filter(
          (date) => date !== completionDate
        );
      } else {
        // Add the completionDate at the beginning (unshift)
        updatedCompletedDates = [...completedDates];
        updatedCompletedDates.sort((a, b) => b - a).unshift(completionDate);
      }
    } else {
      // If completedDates doesn't exist, create a new array with just the completionDate
      updatedCompletedDates = [completionDate];
    }

    // Update the completedDates property of updatedDaily with the modified array
    updatedRecurring.completedDates = updatedCompletedDates;

    const updatedDailies = recurrings.map((dailyDoc: RecurringTask) => {
      if (dailyDoc.$id === updatedRecurring.$id) {
        return { ...updatedRecurring };
      } else {
        return dailyDoc;
      }
    });
    setRecurrings(updatedDailies);
    setFilteredRecurrings(
      updatedDailies.filter((recurring: RecurringTask) =>
        recurring.title.includes(searchTerm)
      )
    );

    try {
      dbm.updateServerDoc(
        CollectionOptions.recurringTasks,
        // @ts-ignore
        recurring.$id,
        {
          completedDates: updatedCompletedDates.sort((a, b) => b - a),
        }
      );

      console.log("Document updated");
    } catch (e) {
      console.warn(e);
    }
  };

  const handleChecklistItemCheck = async (
    parent: RecurringTask,
    child: SubRecurringTask,
    dateOfRecord?: string
  ) => {
    const completionDate = moment
      .utc(dateOfRecord ?? dayOfRecord)
      .set("hour", 0)
      .valueOf();

    let updatedSubRT: SubRecurringTask;
    let updatedCompletedDates = [];
    // Update the state in the frontend for fast checking/unchecking

    // Does completedDates exist?
    if (child.completedDates) {
      // Does Date already exist?
      const dateExist = child.completedDates.includes(completionDate);

      if (dateExist) {
        updatedCompletedDates = [...child.completedDates].filter(
          (date) => date !== completionDate
        );
      } else {
        updatedCompletedDates = [...child.completedDates];
        updatedCompletedDates.unshift(completionDate);
      }
    } else {
      updatedCompletedDates = [completionDate];
    }

    updatedSubRT = { ...child, completedDates: updatedCompletedDates };

    updateSubRT(updatedSubRT);

    if (child.recurringTask) {
      /* @ts-ignore */
      dbm.updateServerDoc(CollectionOptions.rT_Checklists, child.$id, {
        completedDates: updatedCompletedDates,
      });
    } else {
      /* @ts-ignore */
      dbm.updateServerDoc(CollectionOptions.rT_Checklists, child.$id, {
        /* @ts-ignore */
        recurringTask: parent.$id,
        completedDates: updatedCompletedDates,
      });
    }
  };

  return {
    createRecurringTask,
    updateRecurringTask,
    deleteRecurringTask,

    handleRecurringTaskCheck,
    handleChecklistItemCheck,
  };
};

export default RecurringTaskController;
