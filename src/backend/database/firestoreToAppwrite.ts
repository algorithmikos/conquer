// @ts-nocheck
/* Migration Tool */
import {
  collection,
  doc,
  getDocsFromServer,
  query,
  where,
} from "firebase/firestore";
import { database } from "./database";
import { db } from "../../firebase.config";
import { CollectionOptions, dbm } from "./dbm";
import moment from "moment";

export const migrateRecurringTasks = async () => {
  const querySnapshot = await getDocsFromServer(
    query(
      collection(db, "dailies"),
      where("user", "==", "1rdNuPvCuLU9rSoM2sQjnZeliL12")
    )
  );

  const recurringTasks: object[] = [];
  querySnapshot.forEach((doc) => {
    // Add the document ID and data to the array
    recurringTasks.push({ id: doc.$id, ...doc.data() });
  });

  for (let recurringTask of recurringTasks) {
    // Create a temporary object for further manipulation
    const tempDoc = {
      ...recurringTask,
    };

    // Delete properties that are not needed
    /* @ts-ignore */
    delete tempDoc.createdAt;
    /* @ts-ignore */
    delete tempDoc.updatedAt;

    // Array to hold ordered checklist IDs
    const orderedChecklistIds: string[] = [];

    // Handle Checklist Items if there are any
    /* @ts-ignore */
    if (tempDoc.checklist) {
      /* @ts-ignore */
      for (let i = 0; i < tempDoc.checklist.length; i++) {
        /* @ts-ignore */
        const item = tempDoc.checklist[i];
        // Create a temporary object for further manipulation
        const appwriteItem = { ...item };

        // Create relationship between item document and task document
        /* @ts-ignore */
        appwriteItem.recurringTask = tempDoc.$id;

        // Delete properties that are not needed
        delete appwriteItem.$id;

        // Create new item document in Appwrite database
        database.createDoc("rT_Checklists", appwriteItem, item.$id);

        // Push the new item ID to the ordered checklist IDs array
        /* @ts-ignore */
        orderedChecklistIds.push(item.$id);
      }

      // Set the ordered checklist IDs back to the tempDoc
      /* @ts-ignore */
      tempDoc.checklist = orderedChecklistIds;
    }

    // Delete properties that are not needed or problematic in main task document
    /* @ts-ignore */
    delete tempDoc.$id;

    // Create new task document in Appwrite database
    /* @ts-ignore */
    database.createDoc("recurringTasks", tempDoc, recurringTask.$id);

    /* @ts-ignore */
    console.log(`${recurringTask.title} migrated`);
  }
};

export const migrateRecurringTaskChecklistOrder = async () => {
  const querySnapshot = await getDocsFromServer(
    query(
      collection(db, "dailies"),
      where("user", "==", "1rdNuPvCuLU9rSoM2sQjnZeliL12")
    )
  );

  const recurringTasks: object[] = [];

  querySnapshot.forEach((doc) => {
    // Add the document ID and data to the array
    recurringTasks.push({ id: doc.$id, ...doc.data() });
  });

  for (let recurringTask of recurringTasks) {
    /* @ts-ignore */
    if (recurringTask.checklist) {
      // Array to hold ordered checklist IDs
      const orderedChecklistIds: string[] = [];

      /* @ts-ignore */
      for (let i = 0; i < recurringTask.checklist.length; i++) {
        /* @ts-ignore */
        const item = recurringTask.checklist[i];

        // Push the new item ID to the ordered checklist IDs array
        /* @ts-ignore */
        orderedChecklistIds.push(item.$id);
      }

      // Set the ordered checklist IDs back to the tempDoc
      /* @ts-ignore */
      dbm.updateServerDoc("recurringTasks", recurringTask.$id, {
        checklistOrder: orderedChecklistIds,
      });

      /* @ts-ignore */
      console.log(`${recurringTask.title}'s checklist order migrated`);
    }
  }
};

export const migrateJobs = async () => {
  const querySnapshot = await getDocsFromServer(
    query(
      collection(db, "todos"),
      where("user", "==", "1rdNuPvCuLU9rSoM2sQjnZeliL12")
    )
  );

  const jobs: object[] = [];
  querySnapshot.forEach((doc) => {
    // Add the document ID and data to the array
    jobs.push({ id: doc.$id, ...doc.data() });
  });

  const appwriteJobQuery = await database.getDocs("jobs");
  const appwriteJobIDs = appwriteJobQuery.documents.map((doc) => doc.$id);

  for (let job of jobs) {
    // Create a temporary object for further manipulation
    const tempDoc = {
      ...job,
    };

    // Delete properties that are not needed
    /* @ts-ignore */
    delete tempDoc.createdAt;
    /* @ts-ignore */
    delete tempDoc.updatedAt;

    // Array to hold stringified checklist objects
    const stringifiedChecklist: string[] = [];

    // Handle Checklist Items if there are any
    /* @ts-ignore */
    if (tempDoc.checklist) {
      /* @ts-ignore */
      for (let i = 0; i < tempDoc.checklist.length; i++) {
        /* @ts-ignore */
        const item = tempDoc.checklist[i];
        // Create a temporary object for further manipulation
        const appwriteItem = { ...item, $id: item.$id };
        delete appwriteItem.$id;

        stringifiedChecklist.push(JSON.stringify(appwriteItem));
      }

      // Set the ordered checklist IDs back to the tempDoc
      /* @ts-ignore */
      tempDoc.checklist = stringifiedChecklist;
    }

    /* @ts-ignore */
    if (job.priority) {
      /* @ts-ignore */
      tempDoc.priority = JSON.stringify(job.priority);
    }

    /* @ts-ignore */
    if (job.done && typeof job.done === "boolean") {
      /* @ts-ignore */
      tempDoc.done = moment.utc().valueOf();
    }

    /* @ts-ignore */
    if (!job.done) {
      /* @ts-ignore */
      tempDoc.done = null;
    }

    // Delete properties that are not needed or problematic in main task document
    /* @ts-ignore */
    delete tempDoc.$id;

    // Create new task document in Appwrite database
    /* @ts-ignore */
    if (!appwriteJobIDs.includes(job.$id)) {
      /* @ts-ignore */
      database.createDoc("jobs", tempDoc, job.$id);

      /* @ts-ignore */
      console.log(`${job.title} migrated`);
    } else {
      dbm.updateServerDoc(CollectionOptions.jobs, job.$id, {
        checklist: tempDoc.checklist,
      });
    }
  }
};

export const migrateHabits = async () => {
  const querySnapshot = await getDocsFromServer(
    query(
      collection(db, "habits"),
      where("user", "==", "1rdNuPvCuLU9rSoM2sQjnZeliL12")
    )
  );

  const habits: object[] = [];
  querySnapshot.forEach((doc) => {
    // Add the document ID and data to the array
    habits.push({ id: doc.$id, ...doc.data() });
  });

  const appwriteJobQuery = await database.getDocs("habits");
  const appwriteJobIDs = appwriteJobQuery.documents.map((doc) => doc.$id);

  for (let habit of habits) {
    // Create a temporary object for further manipulation
    const tempDoc = {
      ...habit,
    };

    // Delete properties that are not needed
    /* @ts-ignore */
    delete tempDoc.createdAt;
    /* @ts-ignore */
    delete tempDoc.updatedAt;

    // Array to hold stringified checklist objects
    const stringifiedCompletedDates: string[] = [];

    // Handle Checklist Items if there are any
    /* @ts-ignore */
    if (tempDoc.completedDates) {
      /* @ts-ignore */
      const stringRepresentation = Object.entries(tempDoc.completedDates)
        .map(([key, value]) => {
          const result = Number(`${key}.${value}`);
          console.log(result);
          stringifiedCompletedDates.push(result);
          return result;
        })
        .join("\n");

      console.log(stringRepresentation);

      const completedDates = stringifiedCompletedDates.reduce((acc, line) => {
        const [key, value] = String(line)
          .split(".")
          .map((item) => item.trim());
        acc[key] = value ? Number(value) : 0; // Convert the value to a number
        return acc;
      }, {});

      console.log(completedDates);

      console.log(stringifiedCompletedDates);

      // stringifiedCompletedDates.push(JSON.stringify(appwriteItem));

      // Set the ordered checklist IDs back to the tempDoc
      /* @ts-ignore */
      tempDoc.completedDates = stringifiedCompletedDates;
    }

    // Delete properties that are not needed or problematic in main task document
    /* @ts-ignore */
    delete tempDoc.$id;

    // Create new task document in Appwrite database
    /* @ts-ignore */
    if (!appwriteJobIDs.includes(habit.$id)) {
      /* @ts-ignore */
      database.createDoc("habits", tempDoc, habit.$id);

      /* @ts-ignore */
      console.log(`${habit.title} migrated`);
    }
  }
};

export const migratePillars = async () => {
  const userDocRef = doc(db, "users", "1rdNuPvCuLU9rSoM2sQjnZeliL12");

  const querySnapshot = await getDocsFromServer(
    query(collection(db, "pillars"), where("user", "==", userDocRef))
  );

  const pillars: object[] = [];
  querySnapshot.forEach((doc) => {
    // Add the document ID and data to the array
    pillars.push({ id: doc.$id, ...doc.data() });
  });

  for (let pillar of pillars) {
    // Create a temporary object for further manipulation
    const tempDoc = {
      ...pillar,
      user: "1rdNuPvCuLU9rSoM2sQjnZeliL12",
    };

    // Delete properties that are not needed
    /* @ts-ignore */
    delete tempDoc.creationDate;
    /* @ts-ignore */
    delete tempDoc.updateDate;

    // Delete properties that are not needed or problematic in main task document
    /* @ts-ignore */
    delete tempDoc.$id;

    // Create new task document in Appwrite database
    /* @ts-ignore */
    database.createDoc("pillars", tempDoc, pillar.$id);

    /* @ts-ignore */
    console.log(`${pillar.title} migrated`);
  }
};

export const migrateProjects = async () => {
  const userDocRef = doc(db, "users", "1rdNuPvCuLU9rSoM2sQjnZeliL12");

  const querySnapshot = await getDocsFromServer(
    query(collection(db, "projects"), where("user", "==", userDocRef))
  );

  const projects: object[] = [];
  querySnapshot.forEach((doc) => {
    // Add the document ID and data to the array
    projects.push({ id: doc.$id, ...doc.data() });
  });

  for (let project of projects) {
    // Create a temporary object for further manipulation
    const tempDoc = {
      ...project,
      user: "1rdNuPvCuLU9rSoM2sQjnZeliL12",
      beginning: moment.unix(project?.beginning?.seconds).toISOString(),
      end: null,
    };

    // Delete properties that are not needed
    /* @ts-ignore */
    delete tempDoc.creationDate;
    /* @ts-ignore */
    delete tempDoc.updateDate;

    // Delete properties that are not needed or problematic in main task document
    /* @ts-ignore */
    delete tempDoc.$id;

    // Create new task document in Appwrite database
    /* @ts-ignore */
    database.createDoc("projects", tempDoc, project.$id);

    /* @ts-ignore */
    console.log(`${project.title} migrated`);
  }
};

export const migrateSystems = async () => {
  const userDocRef = doc(db, "users", "1rdNuPvCuLU9rSoM2sQjnZeliL12");

  const querySnapshot = (
    await getDocsFromServer(
      query(
        collection(db, "customDocs"),
        where("user", "==", "1rdNuPvCuLU9rSoM2sQjnZeliL12")
      )
    )
  ).docs.map((doc) => {
    return { id: doc.$id, ...doc.data() };
  });

  console.log("customDocs", querySnapshot);

  for (let doc of querySnapshot) {
    // Create a temporary object for further manipulation
    const mainDoc = {
      ...doc,
    };

    delete mainDoc.$id;
    delete mainDoc.createdAt;
    delete mainDoc.user;
    delete mainDoc.system;

    const tempDoc = {
      $id: doc.$id,
      body: JSON.stringify(mainDoc),
      system: doc.system,
      owner: "1rdNuPvCuLU9rSoM2sQjnZeliL12",
    };

    //    Create new task document in Appwrite database
    /* @ts-ignore */
    dbm.createServerDoc(CollectionOptions.customDocs, tempDoc, {
      body: "",
      system: "",
      owner: "",
    });
  }

  // for (let system of querySnapshot) {
  //   // Create a temporary object for further manipulation
  //   const tempDoc = {
  //     ...system,
  //     author: "1rdNuPvCuLU9rSoM2sQjnZeliL12",
  //     users: ["1rdNuPvCuLU9rSoM2sQjnZeliL12"],
  //     $id: system.$id,
  //   };

  //   // Delete properties that are not needed or problematic in main task document
  //   /* @ts-ignore */
  //   delete tempDoc.$id;

  //   /* @ts-ignore */
  //   if (tempDoc.systemData) {
  //     /* @ts-ignore */
  //     tempDoc.systemData = JSON.stringify(tempDoc.systemData);
  //   }

  //   /* @ts-ignore */
  //   if (tempDoc.fields) {
  //     /* @ts-ignore */
  //     tempDoc.fields = tempDoc.fields.map((field) => {
  //       return JSON.stringify(field);
  //     });
  //   }

  //   // Create new task document in Appwrite database
  //   /* @ts-ignore */
  //   dbm.createServerDoc(CollectionOptions.customSystems, tempDoc, {
  //     author: "",
  //     users: "[]{}",
  //     fields: "[]{}",
  //     systemData: "{}",
  //   });

  //   /* @ts-ignore */
  //   console.log(`${system.title} migrated`);
  // }
};
