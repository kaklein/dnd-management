import { collection, addDoc } from "firebase/firestore"; 
import { CollectionName } from "../enum/CollectionName";
import { db } from "../../../firebase";

export const createDoc = async (
  collectionName: CollectionName, 
  data: { [key: string]: string | number | object | any[] }
) => {
  const docRef = await addDoc(collection(db, collectionName), data);
  console.log(`Added doc to ${collectionName} collection with id ${docRef.id}`);
}