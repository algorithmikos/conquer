import { openDB } from "idb";

export const openIDB = async (databaseName, collectionName, version = 10) => {
  try {
    const db = await openDB(databaseName, version, {
      upgrade(db) {
        const existingStores = db.objectStoreNames;

        const storeNames = [
          "todos",
          "dailies",
          "recordOfDailies",
          "habits",
          "recordOfHabits",
        ];

        storeNames.forEach(async (storeName) => {
          if (!existingStores.contains(storeName)) {
            const store = db.createObjectStore(storeName, { keyPath: "id" });
            if (storeName === "dailies") {
              store.createIndex("titleIndex", "title", { unique: false });
            }
          } else {
            console.log(`Object store already exists: ${storeName}`);
          }
        });

        if (!existingStores.contains("conquerUtils")) {
          db.createObjectStore("conquerUtils", { keyPath: "key" });
        } else {
          console.log(`Object store already exists: "conquerUtils"`);
        }
      },
    });

    return db;
  } catch (error) {
    console.error("Error opening database:", error);
  }
};
