import { getDownloadURL } from "firebase/storage";
import { getImagesRef } from "./client"
import { FileNameUtil } from "./util";

export const readFromBucket = async (fileName: string, fileNameUtil: FileNameUtil) => {
  const uniqueFileName = fileNameUtil.generateUniqueFileName(fileName);
  const imageRef = getImagesRef(uniqueFileName);
  const url = await getDownloadURL(imageRef);
  return url;
}