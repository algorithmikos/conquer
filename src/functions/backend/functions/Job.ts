import { toast } from "react-toastify";
import { t } from "i18next";
import { account } from "../../../appwrite.config";
import {
  Job as JobDoc,
  JobSchema,
  serverToClientJob,
} from "../../../backend/database/schemas/Job.model";
import { CollectionOptions, dbm } from "../../../backend/database/dbm";
import { useTodoStore, useUtilsStore } from "../../../store";
import { v4 as uuid } from "uuid";
import { Job } from "../schemas/Job.model";
import moment from "moment";

const JobController = () => {
  const {
    addJob,
    updateJob: updateJobState,
    removeJob,

    todos,
    setTodos,
    setFilteredJobs,
  } = useTodoStore((state) => state);

  const searchTerm = useUtilsStore((state) => state.searchTerm);

  const createJob = async (task: JobDoc) => {
    const mainTaskId = uuid();
    const currentUser = await account.get();

    const cleanTaskData = {
      ...task,
      $id: mainTaskId,
      title: task.title.trimEnd(),
      priority: JSON.stringify({
        urgency: task.priority?.urgency ?? false,
        importance: task.priority?.importance ?? false,
      }),
      user: currentUser.$id,
      status: task.status || "active",
      projects: [],
    };

    if (task.description) {
      cleanTaskData.description = task.description.trimEnd();
    }

    if (task.checklist) {
      cleanTaskData.checklist = task.checklist.map((item) =>
        JSON.stringify(item)
      );
    }

    /* @ts-ignore */
    if (task.checklistChanges) {
      /* @ts-ignore */
      delete cleanTaskData.checklistChanges;
    }

    addJob(serverToClientJob(cleanTaskData));
    await dbm.createServerDoc(CollectionOptions.jobs, cleanTaskData, JobSchema);

    // Get the existing todosOrder array
    const currentUserDoc = await dbm.getDocFromServer(
      CollectionOptions.users,
      currentUser.$id
    );

    // Update the todosOrder array with the new task ID
    const updatedJobOrder = [task.$id, ...currentUserDoc.jobOrder];

    // Update the user document with the updated todosOrder
    await dbm.updateServerDoc(CollectionOptions.users, currentUser.$id, {
      jobOrder: updatedJobOrder,
    });
  };

  const updateJob = async (updatedTaskData: JobDoc, updatedTaskId: string) => {
    if (!Object.keys(updatedTaskData).length) {
      toast.error("Could not recieve changes. Refresh the app and try again.");
      return;
    }

    if (!updatedTaskId) {
      toast.error("Could not set the task. Refresh the app and try again.");
      return;
    }

    const fullTaskDoc = await dbm.getDocFromCache(
      CollectionOptions.jobs,
      updatedTaskId
    );

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

    if (updatedTaskData.priority) {
      /* @ts-ignore */
      cleanTaskData.priority = JSON.stringify({
        urgency: updatedTaskData.priority?.urgency ?? false,
        importance: updatedTaskData.priority?.importance ?? false,
      });
    }

    if (updatedTaskData.checklist) {
      cleanTaskData.checklist = updatedTaskData.checklist.map((item) =>
        JSON.stringify(item)
      );
    }

    /* @ts-ignore */
    if (updatedTaskData.checklistChanges) {
      /* @ts-ignore */
      delete cleanTaskData.checklistChanges;
    }

    console.log("From update Job: ", fullTaskDoc);

    updateJobState({ ...fullTaskDoc, ...serverToClientJob(cleanTaskData) });
    await dbm.updateServerDoc(
      CollectionOptions.jobs,
      updatedTaskId,
      cleanTaskData
    );
  };

  const deleteJob = async (taskId: string) => {
    if (!taskId) {
      toast.error("Could not set the task. Refresh the app and try again.");
      return;
    }

    dbm
      .getDocFromCache(CollectionOptions.jobs, taskId)
      .then((removedDoc) => {
        if (removedDoc) {
          dbm.deleteServerDoc(CollectionOptions.jobs, taskId).then(() => {
            removeJob(removedDoc);
            toast.success(t("Job_deleted_successfully"));
          });
        }
      })
      .catch((error) => {
        if (error.status === 404) {
          console.log("Job already deleted");
        } else {
          console.warn(error);
        }
      });
  };

  const handleJobCheck = async (job: Job) => {
    const now = moment.utc().valueOf();
    // Update the state in the frontend for fast checking/unchecking
    const updatedTodos = todos.map((todoDoc) => {
      // @ts-ignore
      if (todoDoc.$id === job.$id) {
        if (job.done) {
          return { ...job, done: "" };
        } else {
          return { ...job, done: now };
        }
      } else {
        return todoDoc;
      }
    });
    setTodos(updatedTodos);
    setFilteredJobs(
      updatedTodos.filter((job) => job.title.includes(searchTerm))
    );

    /* @ts-ignore */
    dbm.updateServerDoc(CollectionOptions.jobs, job.$id, {
      done: job.done ? null : now,
    });
  };

  const handleChecklistItemCheck = async (parent: Job, child: any) => {
    const now = moment.utc().valueOf();
    // Update the state in the frontend for fast checking/unchecking
    const updatedTodos = todos.map((todoDoc) => {
      // Find the corresponding day record, i.e. today's record
      /* @ts-ignore */
      if (todoDoc.$id === parent.$id) {
        /* @ts-ignore */
        const updatedTodoChecklist = todoDoc.checklist.map((item) =>
          item.$id === child.$id
            ? { ...item, done: child.done ? null : now }
            : item
        );
        /* @ts-ignore */
        const updatedTodo = { ...todoDoc, checklist: updatedTodoChecklist };
        return updatedTodo;
      } else {
        return todoDoc;
      }
    });
    // Update Todos Machine State
    setTodos(updatedTodos);
    setFilteredJobs(
      updatedTodos.filter((job) => job.title.includes(searchTerm))
    );

    updateJob(
      /* @ts-ignore */
      {
        checklist: parent.checklist?.map((item) =>
          /* @ts-ignore */
          item.$id === child.$id
            ? /* @ts-ignore */
              { ...item, done: item.done ? null : now }
            : item
        ),
      },
      /* @ts-ignore */
      parent.$id
    );
  };

  return {
    createJob,
    updateJob,
    deleteJob,

    handleJobCheck,
    handleChecklistItemCheck,
  };
};

export default JobController;
