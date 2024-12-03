import { useProjectStore } from "../../store";
import { CollectionOptions, dbm } from "../database/dbm";
import { QuestDocument, QuestSchema } from "../database/schemas/Quest.model";
import { v4 as uuid } from "uuid";

const QuestController = () => {
  const questState = useProjectStore((state) => state);
  const { addQuest, updateQuest: updateQuestState, removeQuest } = questState;

  /* @ts-ignore */
  const userId = JSON.parse(localStorage.getItem("currentUser"))?.$id;

  const createQuest = async (quest: QuestDocument) => {
    const mainTaskId = uuid();
    const userDocument = await dbm.getDocFromCache(
      CollectionOptions.users,
      userId
    );

    const cleanDocData = {
      ...quest,
      title: quest.title.trimEnd(),
      status: quest.status || "active",
      user: userId,
      $id: mainTaskId,
    };

    if (quest.details) {
      cleanDocData.details = quest.details.trimEnd();
    }

    addQuest({ $id: mainTaskId, ...quest });

    await dbm.createServerDoc(
      CollectionOptions.projects,
      cleanDocData,
      QuestSchema
    );

    await dbm.updateServerDoc(CollectionOptions.users, userId, {
      questOrder: [mainTaskId, ...userDocument.questOrder],
    });
  };

  const updateQuest = async (quest: QuestDocument, questId: string) => {
    const fullDocument = await dbm.getDocFromCache(
      CollectionOptions.projects,
      questId
    );

    updateQuestState({ ...fullDocument, ...quest });

    const cleanDocData = {
      ...quest,
    };

    if (quest.title) {
      cleanDocData.title = quest.title.trimEnd();
    }

    if (quest.details) {
      cleanDocData.details = quest.details.trimEnd();
    }

    if (quest.jobs) {
      cleanDocData.jobs = quest.jobs.map(
        /* @ts-ignore */
        (job) => job.$id
      );
    }

    await dbm.updateServerDoc(
      CollectionOptions.projects,
      questId,
      cleanDocData
    );
  };

  const deleteQuest = async (quest: QuestDocument) => {
    const userDocument = await dbm.getDocFromCache(
      CollectionOptions.users,
      userId
    );

    removeQuest(quest);
    /* @ts-ignore */
    await dbm.deleteServerDoc(CollectionOptions.projects, quest.$id);
    await dbm.updateServerDoc(CollectionOptions.users, userId, {
      /* @ts-ignore */
      questOrder: userDocument.questOrder.filter((id) => id !== quest.$id),
    });
  };

  return {
    createQuest,
    updateQuest,
    deleteQuest,
  };
};

export default QuestController;
