import { openIDB } from "./openIDB";

// C
export const createInIDB = async (collection, taskData) => {
  try {
    const IndexedDBdb = await openIDB("tasks", collection);

    // Start a new transaction in "readwrite" mode to add the new item
    const addTx = IndexedDBdb.transaction(collection, "readwrite");
    const addStore = addTx.objectStore(collection);

    await addStore.add(taskData);

    // Complete the transaction
    await addTx.done;
  } catch (error) {
    console.error("Error adding data to IndexedDB:", error);
  }
};

// R
export const readFromIDB = async (collection) => {
  const IndexedDBdb = await openIDB("tasks", collection);

  // Start a transaction in "readonly" mode to get all items
  const getAllTx = IndexedDBdb.transaction(collection, "readonly");
  const getAllStore = getAllTx.objectStore(collection);

  // Get all objects where freeUserDefined exists and is true
  const allTodos = await getAllStore.getAll();

  return allTodos;
};

export const readDocFromIDB = async (collection, id) => {
  const IndexedDBdb = await openIDB("tasks", collection);

  // Start a transaction in "readonly" mode to get all items
  const transaction = IndexedDBdb.transaction(collection, "readonly");
  const objectStore = transaction.objectStore(collection);

  const foundObject = await objectStore.get(id);

  if (foundObject) {
    return foundObject;
  } else {
    console.log("No object found with that ID");
    return null;
  }
};

// U
export const updateInIDB = async (
  collection,
  taskId,
  updatedTaskData,
  dataToSerialise = true
) => {
  const IndexedDB = await openIDB("tasks", collection);

  // Get the item from IndexedDB
  const tx = IndexedDB.transaction(collection, "readwrite");
  const store = tx.objectStore(collection);
  const existingItem = await store.get(taskId);

  let updatedItem;
  if (dataToSerialise) {
    const serialisedCreationDate = {
      seconds: updatedTaskData.creationDate.seconds,
      nanoseconds: updatedTaskData.creationDate.nanoseconds,
    };

    // const serialisedModificationDate = {
    //   seconds: updatedTaskData.creationDate.seconds,
    //   nanoseconds: updatedTaskData.creationDate.nanoseconds,
    // };

    if (existingItem) {
      // Update the existing item with the new data
      updatedItem = {
        ...existingItem,
        ...updatedTaskData,
        creationDate: serialisedCreationDate,
        // modificationDate: serialisedModificationDate,
      };
    } else {
      // Handle the case when the item is not found
      console.error(`Task with ID ${taskId} not found`);
    }
  } else {
    if (existingItem) {
      // Update the existing item with the new data
      updatedItem = {
        ...existingItem,
        ...updatedTaskData,
      };
    } else {
      // Handle the case when the item is not found
      console.error(`Task with ID ${taskId} not found`);
    }
  }

  await store.put(updatedItem);
  await tx.done;
};

// D
export const deleteFromIDB = async (collection, taskId) => {
  const IndexedDB = await openIDB("tasks", collection);

  const tx = IndexedDB.transaction(collection, "readwrite");
  const store = tx.objectStore(collection);

  await store.delete(taskId);

  await tx.done;
};
