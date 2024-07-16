import { createDoc } from "./crud/create";
import { updateDataByPcId } from "./crud/update";
import { transformFormDataForUpdate } from "./utils";

export const transformAndUpdate = async (pcId: string, data: any) => {
  const transformedUpdates = transformFormDataForUpdate(pcId, data);
  console.log(transformedUpdates);
  if (transformedUpdates.create) {
    await createDoc(transformedUpdates.collectionName, transformedUpdates.create.dataObject);
  } else if (transformedUpdates.update) {
    await updateDataByPcId(
      transformedUpdates.collectionName, 
      transformedUpdates.update.pcId, 
      transformedUpdates.update.updateObject
    );
  } else {
    console.log('No update or create');
  }
}