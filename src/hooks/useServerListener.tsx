import { useEffect } from "react";
import { collection, doc, onSnapshot, query, where } from "firebase/firestore";
import { useUserStore } from "../store";
import { db } from "../firebase.config";

const useServerListener = () => {
  const userStore = useUserStore((state) => state);
  const {
    setAreSystemsFetched,
    setSystems,
    setAreInstancesFetched,
    setSystemInstances,
  } = userStore;

  const listener = (
    collectionName: string,
    fetchedSetter: Function,
    sorting: string[],
    stateSetters: any,
    linker: string = "user",
    ref: any = doc(db, "users", "1rdNuPvCuLU9rSoM2sQjnZeliL12")
  ) => {
    const userRef = ref;
    const userResults = query(
      collection(db, collectionName),
      where(linker, "==", userRef)
    );

    const unsubscribeCollection = onSnapshot(userResults, async (snapshot) => {
      if (snapshot.docs.length === 0) {
        fetchedSetter(true);
      }

      const order = sorting || [];

      snapshot.docChanges().forEach((change) => {
        if (stateSetters.universal) {
          const newDocs = snapshot.docs.map((doc) => {
            const comingDoc = {
              /* @ts-ignore */
              id: doc.$id,
              ...doc.data(),
            };

            return comingDoc;
          });

          stateSetters.universal(newDocs);
          if (stateSetters.filtered) {
            stateSetters.filtered(newDocs);
          }
        } else {
          const doc = {
            /* @ts-ignore */
            id: change.doc.$id,
            ...change.doc.data(),
          };

          switch (change.type) {
            case "added":
              stateSetters.added(doc, order);
              break;
            case "modified":
              stateSetters.modified(doc);
              break;
            case "removed":
              stateSetters.removed(doc);
              break;
          }
        }

        fetchedSetter(true);
      });
    });

    return unsubscribeCollection;
  };

  useEffect(() => {
    const unsubscribeSystems = listener(
      "customSystems",
      setAreSystemsFetched,
      [],
      { universal: setSystems },
      "author",
      "1rdNuPvCuLU9rSoM2sQjnZeliL12"
    );

    const unsubscribeUserDocs = listener(
      "customDocs",
      setAreInstancesFetched,
      [],
      { universal: setSystemInstances },
      "user",
      "1rdNuPvCuLU9rSoM2sQjnZeliL12"
    );

    return () => {
      unsubscribeSystems();
      unsubscribeUserDocs();
    }; // Cleanup function to unsubscribe on unmount
  }, []);
};

export default useServerListener;
