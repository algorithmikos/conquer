// @ts-nocheck
import {
  databases,
  originDatabase,
  collections as awdb,
} from "../../appwrite.config";
import { openDB, deleteDB, wrap, unwrap } from "idb";

import { v4 as uuid } from "uuid";
import moment from "moment";

import { RecurringTaskSchema } from "./schemas/RecurringTask.model";
import { SubRecurringTaskSchema } from "./schemas/SubRecurringTask.model";
import { database } from "./database";
import { AppwriteException, Permission } from "appwrite";
import { JobSchema } from "./schemas/Job.model";
import { HabitSchema } from "./schemas/Habit.model";
import { deleteDoc } from "firebase/firestore";

export interface PouchDocument {
  _rev?: string;
  $updatedAt?: string;
  pendingUpdate?: boolean;
  pendingCreate?: boolean;
  pendingDelete?: boolean;
  [key: string]: any;
}

export interface AppwriteDocument {
  [key: string]: any;
}

export enum CollectionOptions {
  recurringTasks = "recurringTasks",
  rT_Checklists = "rT_Checklists",
  jobs = "jobs",
  habits = "habits",
  pillars = "pillars",
  projects = "projects",
  plants = "plants",
  customSystems = "customSystems",
  customDocs = "customDocs",
  users = "users",
  archive = "archive",
}

export class dbm {
  static async openIdb() {
    const collections = [
      "recurringTasks",
      "rT_Checklists",
      "jobs",
      "habits",
      "pillars",
      "projects",
      "plants",
      "customSystems",
      "customDocs",
      "users",
      "archive",
      "localStorage",
    ];

    const db = await openDB("offline-storage", 4, {
      upgrade(db, oldVersion, newVersion, transaction, event) {
        for (let collection of collections) {
          if (!db.objectStoreNames.contains(collection)) {
            db.createObjectStore(collection, { keyPath: "$id" });
          }
        }
      },
      blocked(currentVersion, blockedVersion, event) {
        // …
      },
      blocking(currentVersion, blockedVersion, event) {
        // …
      },
      terminated() {
        // …
      },
    });
    return db;
  }

  static async createCacheDoc(collection: CollectionOptions, doc: object) {
    const db = await this.openIdb();
    const tx = db.transaction(collection, "readwrite");
    const store = tx.objectStore(collection);
    await store.add(doc);
    await tx.done;
  }

  static async updateCacheDoc(
    collection: CollectionOptions,
    docId: string,
    changes: object
  ) {
    const db = await this.openIdb();
    const tx = db.transaction(collection, "readwrite");
    const store = tx.objectStore(collection);
    const oldDoc = await store.get(docId);
    await store.put({ $id: docId, ...oldDoc, ...changes });
    await tx.done;
  }

  static async deleteCacheDoc(collection: CollectionOptions, docId: string) {
    const db = await this.openIdb();
    const tx = db.transaction(collection, "readwrite");
    const store = tx.objectStore(collection);
    await store.delete(docId);
    await tx.done;
  }

  static async getDocs(
    collection: CollectionOptions,
    isOnline: boolean,
    stateSetter: Function,
    fetchedFlagger: Function,
    filteredStateSetter?: Function,
    sortArr?: string[]
  ) {
    const idb = await this.openIdb();
    const idbRecords = await idb.getAll(collection);
    const idbDocs = idbRecords
      ?.map((doc) => ({ ...doc, id: doc.$id }))
      .sort((a, b) => {
        if (sortArr) {
          return sortArr.indexOf(a.$id) - sortArr.indexOf(b.$id);
        } else {
          return a?.$id - b?.$id;
        }
      });
    idbDocs && stateSetter(idbDocs);
    if (filteredStateSetter) {
      idbDocs && filteredStateSetter(idbDocs);
    }
    fetchedFlagger(true);

    if (isOnline) {
      // Handle pending changes in PouchDB
      idbDocs?.forEach(async (idbDoc) => {
        if (idbDoc.pendingCreate) {
          this.createServerDoc(
            collection,
            idbDoc,
            this.getSchema(collection),
            collection === "recurringTasks" ? "rTask" : ""
          );
        }

        if (idbDoc.pendingDelete) {
          this.deleteServerDoc(collection, idbDoc);
        }

        if (idbDoc.pendingUpdate) {
          database.getDoc(collection, idbDoc.$id).then((appwriteDoc) => {
            if (idbDoc.$updatedAt) {
              // Appwrite document is older than Pouch document
              // => Update Appwrite document
              if (
                moment(appwriteDoc.$updatedAt).isBefore(
                  moment(idbDoc.$updatedAt)
                )
              ) {
                this.updateServerDoc(
                  collection,
                  appwriteDoc.$id,
                  idbDoc.pendingChanges
                ).then(() => {
                  this.updateCacheDoc(collection, appwriteDoc.$id, {
                    pendingUpdate: false,
                    pendingChanges: {},
                  });
                });
              }
            }
          });
        }
      });

      const appwriteRecords = await database.getDocs(collection);
      const appwriteDocs = appwriteRecords.documents
        .map((document) => ({
          ...document,
          id: document.$id,
        }))
        .map((doc) => {
          const docCopy = { ...doc };
          switch (collection) {
            case "jobs":
              if (doc.checklist) {
                docCopy.checklist = doc.checklist?.map((item) =>
                  JSON.parse(item)
                );
              }

              if (doc.priority) {
                docCopy.priority = JSON.parse(doc.priority);
              }

              return docCopy;

            case "habits":
              if (doc.completedDates) {
                let completedDates = {};

                const mappedCompletedDates = doc.completedDates.forEach(
                  (keyvaluepair) => {
                    const [key, value] = String(keyvaluepair)
                      .split(".")
                      .map((item) => item.trim());

                    completedDates[key] = value ? Number(value) : 0; // Convert the value to a number
                  }
                );

                docCopy.completedDates = completedDates;
              }

              return docCopy;
            case "customSystems":
              if (doc.fields) {
                docCopy.fields = doc.fields.map((item) => JSON.parse(item));
              }

              if (doc.systemData) {
                docCopy.systemData = JSON.parse(doc.systemData);
              }

              return docCopy;
            default:
              return doc;
          }
        })
        .sort((a, b) => {
          if (sortArr) {
            return sortArr.indexOf(a.$id) - sortArr.indexOf(b.$id);
          } else {
            return a?.$id - b?.$id;
          }
        });

      if (collection === "users" && appwriteDocs[0]) {
        localStorage.setItem("currentUser", JSON.stringify(appwriteDocs[0]));
      }

      stateSetter(appwriteDocs);
      if (filteredStateSetter) {
        filteredStateSetter(appwriteDocs);
      }
      fetchedFlagger(true);

      await idb.clear(collection);
      await idb.close();

      appwriteDocs.forEach((appwriteDoc) => {
        this.createCacheDoc(collection, appwriteDoc);
      });
    }
  }

  // Setters
  static async createServerDoc(
    collection: CollectionOptions,
    doc: { [key: string]: any },
    schema: { [key: string]: any },
    type?: string,
    permissions?: Permission[]
  ) {
    // Delete PouchDB properties for the document to meet Appwrite requirements
    const appwriteDocument: AppwriteDocument = this.convertToAwObject(
      doc,
      schema,
      type
    );

    // Pushing changes from PouchDB to Appwrite
    const promise = databases.createDocument(
      originDatabase,
      awdb[collection],
      doc.$id ?? uuid(),
      appwriteDocument,
      permissions
    );

    promise.then(
      (response) => {
        console.log("Server created doc:", response);
        this.getDocFromCache(collection, response.$id)
          .then(() => {
            this.updateCacheDoc(collection, response.$id, {
              pendingCreate: false,
            });
            return response;
          })
          .catch((error) => {
            if (error.status === 404) {
              this.createCacheDoc(collection, response);
            } else {
              console.error(error);
            }
          });
      },
      (error: AppwriteException) => {
        // Internet connection error
        if (error.code === 0) {
          this.createCacheDoc(collection, { ...doc, pendingCreate: true });
        }
        console.table(
          error.code,
          error.message,
          error.name,
          error.response,
          error.type
        );

        console.warn("Error creating document:", error);
      }
    );
  }

  static async updateServerDoc(
    collection: CollectionOptions,
    docId: string,
    changes: { [key: string]: any }
  ) {
    // Pushing changes from PouchDB to Appwrite
    const promise = databases.updateDocument(
      originDatabase,
      awdb[collection],
      docId,
      changes
    );

    promise.then(
      (response) => {
        console.log("Updated server document:", response);
        this.updateCacheDoc(collection, docId, changes);
      },
      (error) => {
        // Internet connection error
        if (error.code === 0) {
          this.updateCacheDoc(collection, docId, {
            ...changes,
            $updatedAt: moment.utc().format("YYYY-MM-DDTHH:mm:ss.SSSZ"),
            pendingUpdate: true,
            pendingChanges: changes,
          });
        } else {
          console.warn("Error creating document:", error);
        }
      }
    );
  }

  static async deleteServerDoc(collection: CollectionOptions, docId: string) {
    // Deleting Document Remotely
    const promise = databases.deleteDocument(
      originDatabase,
      awdb[collection],
      docId
    );

    promise.then(
      (response) => {
        console.log("Deleted server document:", response);
        this.deleteCacheDoc(collection, docId);
        return response;
      },
      (error) => {
        console.warn("Error deleting document:", error);
        if (error.code === 0) {
          if (docId.pendingCreate) {
            this.updateCacheDoc(collection, docId, {
              pendingCreate: false,
            });
          } else if (docId.pendingUpdate) {
            this.updateCacheDoc(collection, docId, {
              pendingUpdate: false,
              pendingDelete: true,
            });
          } else {
            this.updateCacheDoc(collection, docId, {
              pendingDelete: true,
            });
          }
        }
        return error;
      }
    );
  }

  static async deleteCacheCollection(collection: CollectionOptions) {
    const idb = await this.openIdb();
    await idb.clear(collection);
    await idb.close();
  }

  static async createCacheCollection(
    collection: CollectionOptions,
    docs: any[]
  ) {
    for (let doc of docs) {
      await this.createCacheDoc(collection, doc);
    }
  }

  // Getters
  static async getDocFromCache(collection: CollectionOptions, docId: string) {
    const idb = await this.openIdb();
    const doc = await idb.get(collection, docId);
    return doc;
  }

  static async getDocsFromCache(collection: CollectionOptions) {
    const idb = await this.openIdb();
    const collectionDocs = await idb.getAll(collection);
    return collectionDocs;
  }

  static async getDocFromServer(collection: CollectionOptions, docId: string) {
    return database.getDoc(collection, docId);
  }

  static getSchema(collection: CollectionOptions) {
    switch (collection) {
      case "recurringTasks":
        return RecurringTaskSchema;
      case "rT_Checklists":
        return SubRecurringTaskSchema;
      case "jobs":
        return JobSchema;
      case "habits":
        return HabitSchema;
      case "pillars":
        return;
      case "projects":
        return;
      case "users":
        return;
    }
  }

  static convertToAwObject(
    object: PouchDocument,
    schema: object,
    type?: string
  ) {
    const convertedObject = {};

    const convertedObjectKeys = Object.keys(object);
    const schemaKeys = Object.keys(schema);

    for (const objectKey of convertedObjectKeys) {
      if (schemaKeys.includes(objectKey)) {
        switch (objectKey) {
          case "user":
            convertedObject.user =
              typeof object.user !== "string" ? object.user.$id : object.user;
            break;
          // case "checklist":
          //   if (type === "rTask") {
          //     const updatedChecklist = [...object.checklist];
          //     for (let i = 0; i < updatedChecklist.length; i++) {
          //       updatedChecklist[i] = updatedChecklist[i].$id;
          //     }
          //     convertedObject.checklist = updatedChecklist;
          //   } else {
          //     convertedObject.checklist = object.checklist;
          //   }
          //   break;
          case "pillars":
            const updatedPillars = [...object.pillars];
            for (let i = 0; i < updatedPillars.length; i++) {
              updatedPillars[i] = updatedPillars[i].$id;
            }
            convertedObject.pillars = updatedPillars;
            break;
          default:
            convertedObject[objectKey] = object[objectKey];
        }
      }
    }

    console.log("convertedObject:", convertedObject);

    return convertedObject;
  }

  static async destroyAll() {
    await deleteDB("offline-storage");
  }

  /**
   * Used for testing purposes only. This function is not intended for use in production.
   * @ignore
   */
  static test(docId) {
    this.getDocFromCache(CollectionOptions.recurringTasks, docId).then(
      (doc) => {
        console.log(doc);

        this.convertToAwObject(doc, RecurringTaskSchema);
      }
    );

    console.log();
  }
}
