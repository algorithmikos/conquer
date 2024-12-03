import { useSeedStore } from "../../stores/seedStore";
import { CollectionOptions, dbm } from "../database/dbm";
import { v4 as uuid } from "uuid";
import { SeedDocument, SeedSchema } from "../database/schemas/Seed.model";

const PlantController = () => {
  const { addSeed, updateSeed: updateSeedState, removeSeed } = useSeedStore();

  /* @ts-ignore */
  const userId = JSON.parse(localStorage.getItem("currentUser"))?.$id;

  const createPlant = async (plant: SeedDocument) => {
    const mainTaskId = uuid();
    const userDocument = await dbm.getDocFromCache(
      CollectionOptions.users,
      userId
    );

    const cleanDocData = {
      ...plant,
      title: plant.title.trimEnd(),
      user: userId,
      $id: mainTaskId,
    };

    if (plant.description) {
      cleanDocData.description = plant.description.trimEnd();
    }

    addSeed({ $id: mainTaskId, ...plant });

    await dbm.createServerDoc(
      CollectionOptions.plants,
      cleanDocData,
      SeedSchema
    );

    await dbm.updateServerDoc(CollectionOptions.users, userId, {
      plantOrder: [mainTaskId, ...userDocument.plantOrder],
    });
  };

  const updatePlant = async (plant: SeedDocument, plantId: string) => {
    const fullDocument = await dbm.getDocFromCache(
      CollectionOptions.plants,
      plantId
    );

    updateSeedState({ ...fullDocument, ...plant });

    const cleanDocData: any = {};

    if (plant.title) {
      cleanDocData.title = plant.title.trimEnd();
    }

    if (plant.description) {
      cleanDocData.description = plant.description.trimEnd();
    }

    await dbm.updateServerDoc(CollectionOptions.plants, plantId, cleanDocData);
  };

  const deletePlant = async (plant: SeedDocument) => {
    const userDocument = await dbm.getDocFromCache(
      CollectionOptions.users,
      userId
    );

    removeSeed(plant);
    /* @ts-ignore */
    await dbm.deleteServerDoc(CollectionOptions.plants, plant.$id);
    await dbm.updateServerDoc(CollectionOptions.users, userId, {
      /* @ts-ignore */
      plantOrder: userDocument.plantOrder.filter((id) => id !== plant.$id),
    });
  };

  return {
    createPlant,
    updatePlant,
    deletePlant,
  };
};

export default PlantController;
