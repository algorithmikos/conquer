import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
} from "firebase/auth";
import { auth, db } from "../../firebase.config";
import { toast } from "react-toastify";
import { doc, setDoc } from "firebase/firestore";

const errorCatcher = (error) => {
  const errorCode = error.code;
  const errorMessage = error.message;
  console.warn("errorCode: " + errorCode + "\nerrorMessage: " + errorMessage);
};

export const signUpNewUser = (email, password, username) => {
  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // Signed up
      const user = userCredential.user;
      const userDocRef = doc(db, "users", user.uid);
      setDoc(userDocRef, { username: username, email: email });

      console.log(user);

      sendEmailVerification(auth.currentUser)
        .then(() => {
          // Email verification sent!
          toast.success(
            `Welcome on board, Master ${username}! Please visit thy post house to activate thy membership`
          );
        })
        .catch((error) => errorCatcher(error));
    })
    .catch((error) => errorCatcher(error));
};
