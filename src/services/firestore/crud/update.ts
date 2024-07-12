import { updateDoc, doc } from "firebase/firestore";
import { readSingleItem } from "@services/firestore/crud/read";
import { db } from "../../../firebase";
import { CollectionName } from "../enum/CollectionName";

export const updateDataByPcId = async (collectionName: CollectionName, pcId: string, update: {[key: string]: string | number | object}): Promise<boolean> => {
  // Find correct doc
  const originalDoc = await readSingleItem(collectionName, {pcId: pcId});

  // Update it
  try {
    await updateDoc(doc(db, collectionName, originalDoc.id), update);
    return true;
  } catch (e) {
    console.error(`Error updating doc with id ${originalDoc.id}: ${JSON.stringify(e)}`);
    return false;
  }
}

export const updateById = async (collectionName: CollectionName, docId: string, update: {[key: string]: string |  number | object}) => {
  try {
    await updateDoc(doc(db, collectionName, docId), update);
    return true;
  } catch (e) {
    console.error(`Error updating doc id ${docId} in ${collectionName} collection: ${JSON.stringify(e)}`);
    return false;
  }
}