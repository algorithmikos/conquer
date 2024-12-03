import { toast } from "react-toastify";
import { collection, doc, updateDoc } from "firebase/firestore";

import { db, auth } from "../../../firebase.config";
import { Tag } from "../schemas/Tag.model";

const userCollection = collection(db, "users");
// @ts-ignore
const userDocRef = doc(userCollection, auth.currentUser?.uid);

export const createTag = async (tag: Tag) => {
  if (!tag.$id) return;
  const { $id, title } = tag;
  // @ts-ignore
  updateDoc(doc(userDocRef, auth.currentUser?.uid), {
    tags: {
      [$id]: title.trimEnd(),
    },
  });
};

export const updateTag = async (updatedTag: Tag, updatedTagId: string) => {
  if (!Object.keys(updatedTag).length) {
    toast.error("Could not recieve changes. Refresh the app and try again.");
    return;
  }

  if (!updatedTagId) {
    toast.error("Could not set the task. Refresh the app and try again.");
    return;
  }

  const cleanTaskData = {
    ...updatedTag,
  };

  if (updatedTag.title) {
    cleanTaskData.title = updatedTag.title.trimEnd();
  }

  await updateDoc(userDocRef, {
    tags: { [updatedTagId]: cleanTaskData },
  });
};

export const deleteTag = (tags: object, tagId: string) => {
  if (!tagId) {
    toast.error("Could not set the task. Refresh the app and try again.");
    return;
  }

  const updatedTags = { ...tags };
  // @ts-ignore
  delete updatedTags[tagId];

  updateDoc(userDocRef, {
    tags: updatedTags,
  }).then(() => {
    toast.success("Habit deleted successfully");
  });
};
