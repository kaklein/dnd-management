import { uploadBytes } from "firebase/storage";
import { getImagesRef } from "./client"
import { FileNameUtil } from "./util";

const writeToBucket = async (file: any, fileName: string): Promise<void> => {
  const fileRef = getImagesRef(fileName);
  try {
    await uploadBytes(fileRef, file);
  } catch (e: any) {
    let errorMessage: string;
    switch (e.code) {
      case 'storage/unauthorized':
      case 'storage/unauthenticated': {
        errorMessage = 'Access denied';
        break;
      }
      case 'storage/bucket-not-found': {
        errorMessage = 'Storage bucket not found';
        break;
      }
      default: {
        errorMessage = 'Unknown error occurred';
        break;
      }
    }
    throw Error(`Failed to upload image: ${errorMessage}`);
  }
}

export const uploadImage = async (imageUploadElement: HTMLInputElement, fileNameUtil: FileNameUtil, existingFileName?: string): Promise<string> => {
  const file = imageUploadElement?.files?.[0];
  if (file) {
    const uniqueFileName = fileNameUtil.generateFileNameCheckDuplicates(file.name, true, existingFileName);
    await writeToBucket(file, uniqueFileName);
    return uniqueFileName;
  } else {
    console.warn('No image found for upload.');
    return '';
  }
}