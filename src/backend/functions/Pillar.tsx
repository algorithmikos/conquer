import { usePillarStore } from "../../store";
import { CollectionOptions, dbm } from "../database/dbm";
import { PillarDocument, PillarSchema } from "../database/schemas/Pillar.model";
import { v4 as uuid } from "uuid";

const PillarController = () => {
  const pillarState = usePillarStore((state) => state);
  const {
    addPillar,
    updatePillar: updatePillarState,
    removePillar,
  } = pillarState;

  /* @ts-ignore */
  const userId = JSON.parse(localStorage.getItem("currentUser"))?.$id;

  const createPillar = async (pillar: PillarDocument) => {
    const mainTaskId = uuid();
    const userDocument = await dbm.getDocFromCache(
      CollectionOptions.users,
      userId
    );

    const cleanDocData = {
      ...pillar,
      title: pillar.title.trimEnd(),
      status: pillar.status || "active",
      user: userId,
      $id: mainTaskId,
    };

    if (pillar.details) {
      cleanDocData.details = pillar.details.trimEnd();
    }

    addPillar({ $id: mainTaskId, ...pillar });

    await dbm.createServerDoc(
      CollectionOptions.pillars,
      cleanDocData,
      PillarSchema
    );

    await dbm.updateServerDoc(CollectionOptions.users, userId, {
      pillarOrder: [mainTaskId, ...userDocument.pillarOrder],
    });
  };

  const updatePillar = async (pillar: PillarDocument, pillarId: string) => {
    const fullDocument = await dbm.getDocFromCache(
      CollectionOptions.pillars,
      pillarId
    );

    updatePillarState({ ...fullDocument, ...pillar });

    const cleanDocData = {
      ...pillar,
    };

    if (pillar.title) {
      cleanDocData.title = pillar.title.trimEnd();
    }

    if (pillar.details) {
      cleanDocData.details = pillar.details.trimEnd();
    }

    if (pillar.recurringTasks) {
      cleanDocData.recurringTasks = pillar.recurringTasks.map(
        /* @ts-ignore */
        (rTask) => rTask.$id
      );
    }

    if (pillar.habits) {
      cleanDocData.habits = pillar.habits.map(
        /* @ts-ignore */
        (habit) => habit.$id
      );
    }

    await dbm.updateServerDoc(
      CollectionOptions.pillars,
      pillarId,
      cleanDocData
    );
  };

  const deletePillar = async (pillar: PillarDocument) => {
    const userDocument = await dbm.getDocFromCache(
      CollectionOptions.users,
      userId
    );

    removePillar(pillar);
    /* @ts-ignore */
    await dbm.deleteServerDoc(CollectionOptions.pillars, pillar.$id);
    await dbm.updateServerDoc(CollectionOptions.users, userId, {
      /* @ts-ignore */
      pillarOrder: userDocument.pillarOrder.filter((id) => id !== pillar.$id),
    });
  };

  return {
    createPillar,
    updatePillar,
    deletePillar,
  };
};

export default PillarController;
