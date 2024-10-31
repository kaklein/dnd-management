import { PlayerCharacter } from "@models/playerCharacter/PlayerCharacter";
import { createDoc } from "./crud/create";
import { updateById, updateDataByPcId } from "./crud/update";
import { transformFormDataForUpdate } from "./utils";

export const transformAndUpdate = async (pcData: PlayerCharacter, data: any) => {
  const transformedUpdates = transformFormDataForUpdate(pcData, data);
  if (transformedUpdates.create) {
    await createDoc(transformedUpdates.collectionName, transformedUpdates.create.dataObject);
  } else if (transformedUpdates.update) {
    await updateDataByPcId(
      transformedUpdates.collectionName, 
      transformedUpdates.update.pcId, 
      transformedUpdates.update.updateObject
    );
  } else if (transformedUpdates.updateByDocId) {
    await updateById(
      transformedUpdates.collectionName, 
      transformedUpdates.updateByDocId.docId, 
      transformedUpdates.updateByDocId.updateObject
    );
  } else {
    console.warn('No update or create');
  }
}