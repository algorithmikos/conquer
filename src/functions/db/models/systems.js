import {
  addDoc,
  collection,
  doc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { auth, db } from "../../../firebase.config";

export const createSystem = async (systemData, fields) => {
  const system = {
    systemData: systemData,
    fields: fields,
    author: auth.currentUser.uid,
  };

  const sysDoc = await addDoc(collection(db, "customSystems"), system);

  return sysDoc;
};

export const updateSystem = async (sysId, sysData, sysFields) => {
  const sysCollection = collection(db, "customSystems");
  const sysDocRef = doc(sysCollection, sysId);

  const sysDoc = {
    systemData: sysData,
    fields: sysFields,
  };

  const updatedSysDoc = await updateDoc(sysDocRef, sysDoc);

  return updatedSysDoc;
};

export const createSystemInstance = async (sysId, sysInstance) => {
  const sysDocsCollection = collection(db, "customDocs");

  const sysInstanceDoc = {
    ...sysInstance,
    system: sysId,
    user: auth.currentUser.uid,
    createdAt: serverTimestamp(),
  };

  const createdSysInstance = await addDoc(sysDocsCollection, sysInstanceDoc);

  return createdSysInstance;
};

export const updateSystemInstance = async (instance) => {
  const sysDocsCollection = collection(db, "customDocs");
  const sysInstanceDocRef = doc(sysDocsCollection, instance.$id);

  const sysInstanceDoc = {
    ...instance,
  };
  delete sysInstanceDoc.$id;
  delete sysInstanceDoc.createdAt;
  delete sysInstanceDoc.user;
  delete sysInstanceDoc.system;

  console.log(sysInstanceDoc);

  const updatedSysInstance = await updateDoc(sysInstanceDocRef, sysInstanceDoc);

  return updatedSysInstance;
};
