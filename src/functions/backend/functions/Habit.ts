import { toast } from "react-toastify";
import { Habit as HabitDoc } from "../schemas/Habit.model";
import { account } from "../../../appwrite.config";
import { CollectionOptions, dbm } from "../../../backend/database/dbm";
import { HabitSchema } from "../../../backend/database/schemas/Habit.model";
import { useHabitStore } from "../../../stores/habit";
import { v4 as uuid } from "uuid";

const HabitController = () => {
  const habitState = useHabitStore((state) => state);
  const { addHabit, updateHabit: updateStateHabit, removeHabit } = habitState;

  const createHabit = async (task: HabitDoc) => {
    const mainTaskId = uuid();
    const appwriteUser = await account.get();

    // Timestamping creation date and adding User Doc Ref
    const cleanTaskData = {
      ...task,
      $id: mainTaskId,
      title: task.title.trimEnd(),
      status: task.status ?? "active",
      user: appwriteUser.$id,
    };

    if (task.description) {
      cleanTaskData.description = task.description.trimEnd();
    }

    if (task.streak) {
      cleanTaskData.streak = !isNaN(task.streak) ? Number(task.streak) : 0;
    }

    if (task.completedDates) {
      const stringifiedCompletedDates = Object.entries(task.completedDates).map(
        ([key, value]) => {
          const result = Number(`${key}.${value}`);
          console.log(result);
          stringifiedCompletedDates.push(result);
          return result;
        }
      );

      cleanTaskData.completedDates = stringifiedCompletedDates;
    }

    addHabit(cleanTaskData);
    await dbm.createServerDoc(
      CollectionOptions.habits,
      cleanTaskData,
      HabitSchema
    );

    // Get the existing habitsOrder array
    const currentUser = await dbm.getDocFromServer(
      CollectionOptions.users,
      appwriteUser.$id
    );

    // Update the habitOrder array with the new task ID
    /* @ts-ignore */
    const updatedHabitOrder = [cleanTaskData.$id, ...currentUser.habitOrder];

    // Update the user document with the updated habitOrder
    dbm.updateServerDoc(CollectionOptions.users, appwriteUser.$id, {
      habitOrder: updatedHabitOrder,
    });
  };

  const updateHabit = async (
    updatedTaskData: HabitDoc,
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

    if (updatedTaskData.streak) {
      cleanTaskData.streak = Number(updatedTaskData.streak) || 0;
    }

    if (updatedTaskData.completedDates) {
      let stringifiedCompletedDates: number[] = [];

      Object.entries(updatedTaskData.completedDates).map(([key, value]) => {
        const result = Number(`${key}.${value}`);
        console.log(result);
        stringifiedCompletedDates.push(result);
        return result;
      });

      cleanTaskData.completedDates = stringifiedCompletedDates;
    }

    const existentHabit = await dbm.getDocFromCache(
      CollectionOptions.habits,
      updatedTaskId
    );

    updateStateHabit({ ...existentHabit, ...cleanTaskData });

    await dbm.updateServerDoc(
      CollectionOptions.habits,
      updatedTaskId,
      cleanTaskData
    );
  };

  const deleteHabit = async (taskId: string) => {
    if (!taskId) {
      toast.error("Could not set the task. Refresh the app and try again.");
      return;
    }

    const removedHabit = await dbm.getDocFromCache(
      CollectionOptions.habits,
      taskId
    );
    removeHabit(removedHabit);

    dbm
      /* @ts-ignore */
      .deleteServerDoc(CollectionOptions.habits, taskId)
      .then(() => {
        toast.success("Habit deleted successfully");
      })
      .catch((error) => {
        console.error(error);
        toast.error("Could not delete habit. Refresh the app and try again.");
      });
  };

  return {
    createHabit,
    updateHabit,
    deleteHabit,
  };
};

export default HabitController;
