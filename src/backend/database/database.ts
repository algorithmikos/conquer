import { ID, Query } from "appwrite";
import { databases, collections, originDatabase } from "../../appwrite.config";

export class database {
  static createDoc(collection: string, doc: object, docID?: string) {
    const promise = databases.createDocument(
      originDatabase,
      collections[collection],
      docID ?? ID.unique(),
      doc
    );

    promise.then(
      function (response) {
        console.log(response);
      },
      function (error) {
        console.warn(error);
      }
    );
  }

  static updateDoc(collection: string, docId: string, doc: object) {
    const promise = databases.updateDocument(
      originDatabase,
      collections[collection],
      docId,
      doc
    );

    promise.then(
      function (response) {
        console.log(response);
      },
      function (error) {
        console.log(error);
      }
    );
  }

  static deleteDoc(collection: string, docId: string) {
    const promise = databases.deleteDocument(
      originDatabase,
      collections[collection],
      docId
    );

    promise.then(
      function (response) {
        console.log(response);
      },
      function (error) {
        console.log(error);
      }
    );
  }

  static getDoc(collection: string, docId: string) {
    const promise = databases.getDocument(
      originDatabase,
      collections[collection],
      docId
    );

    return promise;
  }

  static async getDocs(collection: string) {
    const promise = await databases.listDocuments(
      originDatabase,
      collections[collection],
      [Query.limit(1000)]
    );

    return promise;
  }
}
