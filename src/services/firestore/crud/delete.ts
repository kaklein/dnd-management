import { doc, deleteDoc, query, collection, getDocs, writeBatch } from "firebase/firestore";
import { CollectionName } from "@services/firestore/enum/CollectionName";
import { buildRemoveFromArrayUpdate } from "../utils";
import { updateDataByPcId } from "./update";
import { db } from "../../../firebase";
import { ArrayField } from "@models/util/ArrayField";
import { buildWhereClauses } from "./read";

const DELETE_ERROR_MESSAGE = 'Error occurred deleting item. Please refresh the page and try again.';

export const deleteItemById = async (collectionName: CollectionName, docId: string) => {
  try {
    await deleteDoc(doc(db, collectionName, docId));
  } catch (e: any) {
    console.error(`Error deleting document with id ${docId} from ${collectionName} collection: ${JSON.stringify(e)}`);
    alert(DELETE_ERROR_MESSAGE);
  }
};

export const deleteItemFromArrayById = async<T extends ArrayField> (collectionName: CollectionName, pcId: string, fieldName: string, existingArray: T[], itemToDelete: T) => {
  const updatedArray = existingArray.filter(item => item.id !== itemToDelete.id);
  const update = {
    [fieldName]: updatedArray
  }
  try {
    await updateDataByPcId(collectionName, pcId, update);
  } catch (e: any) {
    console.error(`Error updating array: ${JSON.stringify(e)}`);
    alert(DELETE_ERROR_MESSAGE);
  }
}

export const deleteItemFromStringArray = async (collectionName: CollectionName, pcId: string, fieldName: string, item: string) => {
  const update = buildRemoveFromArrayUpdate(fieldName, item);
  try {
    await updateDataByPcId(collectionName, pcId, update);
  } catch (e: any) {
    console.error(`Error removing array item: ${JSON.stringify(e)}`);
    alert(DELETE_ERROR_MESSAGE);
  }
}

/** Function to delete all data associated with a single PC. Use with caution! */
export const deletePC = async (pcId: string) => {
  try {
    const batch = writeBatch(db);
  
    const baseDetailsQ = query(collection(db, CollectionName.PC_BASE_DETAILS), ...buildWhereClauses({pcId: pcId}));
    const abilityScoresQ = query(collection(db, CollectionName.ABILITY_SCORES), ...buildWhereClauses({pcId: pcId}));
    const spellSlotsQ = query(collection(db, CollectionName.SPELL_SLOTS), ...buildWhereClauses({pcId: pcId}));
    const featuresQ = query(collection(db, CollectionName.FEATURES), ...buildWhereClauses({pcId: pcId}));

    const queries = [baseDetailsQ, abilityScoresQ, spellSlotsQ, featuresQ];

    let snapshot;
    for (const q of queries) {
      snapshot = await getDocs(q);
      snapshot.docs.forEach(doc => {
        batch.delete(doc.ref);
      });
    };

    await batch.commit();
  } catch (e) {
    console.error(e);
    alert ('Error deleting character :(');
  }
}