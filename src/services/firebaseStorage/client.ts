import { getStorage, ref, StorageReference } from "firebase/storage";

// Get a reference to the storage service, which is used to create references in your storage bucket
const storage = getStorage();

export const getImagesRef = (fileName: string): StorageReference => {
  return ref(storage, `images/${fileName}`);
}