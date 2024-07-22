import { collection, addDoc } from "firebase/firestore"; 
import { CollectionName } from "../enum/CollectionName";
import { db } from "../../../firebase";

export const createDoc = async (
  collectionName: CollectionName, 
  data: any
) => {
  await addDoc(collection(db, collectionName), data);
}