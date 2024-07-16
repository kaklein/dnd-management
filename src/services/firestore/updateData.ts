import { createDoc } from "./crud/create";
import { updateDataByPcId } from "./crud/update";
import { transformFormDataForUpdate } from "./utils";

export const transformAndUpdate = async (pcId: string, data: any) => {
  const transformedUpdates = transformFormDataForUpdate(pcId, data);
  console.log(transformedUpdates);
  if (transformedUpdates.create) {
    console.log('Going to create doc...');
    await createDoc(transformedUpdates.collectionName, transformedUpdates.create.dataObject);
  } else if (transformedUpdates.update) {
    console.log('Going to update doc...');
    await updateDataByPcId(
      transformedUpdates.collectionName, 
      transformedUpdates.update.pcId, 
      transformedUpdates.update.updateObject
    );
  } else {
    console.log('No update or create');
  }
}