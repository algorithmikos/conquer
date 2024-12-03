import { ID } from "appwrite";
import { account } from "../../appwrite.config";
import { database } from "../database/database";

export class auth {
  static signUp(
    uid: string = ID.unique(),
    email: string,
    password: string,
    realName: string,
    userName: string
  ) {
    const promise = account.create(uid, email, password, realName);

    promise.then(
      (response) => {
        console.log(response); // Success
        this.createUser(uid, userName);
      },
      function (error) {
        console.log(error); // Failure
      }
    );
  }

  static createUser(uid: string, username: string) {
    database.createDoc(
      "users",
      {
        username: username,
      },
      uid
    );
  }

  static signIn(email: string, password: string) {
    const promise = account.createEmailPasswordSession(email, password);

    promise.then(
      function (response) {
        console.log(response); // Success
      },
      function (error) {
        console.log(error); // Failure
      }
    );
  }

  static signOut() {
    const promise = account.deleteSession("current");

    promise.then(
      function (response) {
        console.log(response); // Success
      },
      function (error) {
        console.warn(error); // Failure
      }
    );
  }

  static globalSignOut() {
    const promise = account.deleteSessions();

    promise.then(
      function (response) {
        console.log(response); // Success
      },
      function (error) {
        console.warn(error); // Failure
      }
    );
  }
}
