import { Firestore, updateDoc, doc } from "firebase/firestore";
import { readSingleItem } from "@services/firestore/crud/read";

export const updateDataByPcId = async (db: Firestore, collectionName: string, pcId: string, update: {[key: string]: string | number | object}): boolean => {
  console.log('Preparing to update data');
  // Find correct doc
  const originalDoc = await readSingleItem(db, collectionName, {pcId: pcId});
  console.log('found doc with id: ' + originalDoc.id);

  // Update it
  try {
    await updateDoc(doc(db, collectionName, originalDoc.id), update);
    console.log('Update complete.');
    return true;
  } catch (e) {
    console.error(`Error updating doc with id ${originalDoc.id}: ${JSON.stringify(e)}`);
    return false;
  }
}