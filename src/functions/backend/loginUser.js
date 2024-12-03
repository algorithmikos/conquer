import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../../firebase.config";
import { toast } from "react-toastify";
import { collection, getDocs, query, where } from "firebase/firestore";

const emailRegex =
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

const handleSignIn = (identifier, password) => {
  signInWithEmailAndPassword(auth, identifier, password)
    .then((userCredential) => {
      // Signed in
      const user = userCredential.user;
      // ...
      console.log(auth.currentUser);
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.warn(
        "errorCode: " + errorCode + "\nerrorMessage: " + errorMessage
      );

      if (errorCode === "auth/network-request-failed") {
        toast.error("Singing In Request failed, check thy internet connection");
      } else {
        toast.error("Something went wrong while trying to sign thee in");
      }
    });
};

export const signInUser = async (identifier, password) => {
  if (emailRegex.test(identifier)) {
    handleSignIn(identifier, password);
  } else {
    const usersRef = collection(db, "users");

    const q = query(usersRef, where("username", "==", identifier));

    try {
      const querySnapshot = await getDocs(q);
      if (querySnapshot.size > 0) {
        const userDoc = querySnapshot.docs[0]; // Assuming there's only one user with that username
        const email = userDoc.data().email;

        handleSignIn(email, password);
      } else {
        // Handle case where user with that username doesn't exist
        console.log("User not found");
      }
    } catch (error) {
      // Handle errors
      console.error("Error getting user:", error);
    }
  }
};
