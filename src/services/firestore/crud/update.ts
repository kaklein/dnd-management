import { updateDoc, doc } from "firebase/firestore";
import { readSingleItem } from "@services/firestore/crud/read";
import { db } from "../../../firebase";
import { CollectionName } from "../enum/CollectionName";

const UPDATE_ERROR_MESSAGE = 'Error occurred updating item. Please refresh the page and try again.';

export const updateDataByPcId = async (collectionName: CollectionName, pcId: string, update: {[key: string]: string | number | object}) => {
  // Find correct doc
  const originalDoc = await readSingleItem(collectionName, {pcId: pcId});

  // Update it
  try {
    await updateDoc(doc(db, collectionName, originalDoc.id), update);
  } catch (e) {
    throw Error(`Error updating doc with id ${originalDoc.id}: ${JSON.stringify(e)}`);
  }
}

export const updateById = async (collectionName: CollectionName, docId: string, update: {[key: string]: string |  number | object | boolean}) => {
  try {
    await updateDoc(doc(db, collectionName, docId), update);
  } catch (e) {
    throw Error(`Error updating doc id ${docId} in ${collectionName} collection: ${JSON.stringify(e)}`);
  }
}

export const updateArrayObjectItem = async (collectionName: CollectionName, pcId: string, fieldName: string, existingArray: any[], updatedItem: any) => {
  const updatedArray = existingArray.filter(item => item.id !== updatedItem.id);
  updatedArray.push(updatedItem);
  const update = {
    [fieldName]: updatedArray
  };
  try {
    await updateDataByPcId(collectionName, pcId, update);
  } catch (e: any) {
    console.error(`Error updating array: ${JSON.stringify(e)}`);
    alert(UPDATE_ERROR_MESSAGE);
  }
}

export const updateStringArrayItem = async (
  collectionName: CollectionName,
  pcId: string,
  fieldName: string,
  existingArray: any[],
  updatedItem: string,
  originalItem: string
) => {
  const updatedArray = existingArray.filter(item => item !== originalItem);
  updatedArray.push(updatedItem);
  await updateDataByPcId(collectionName, pcId, { [fieldName]: updatedArray });
}