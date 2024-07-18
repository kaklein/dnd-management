import { createDoc } from "./crud/create";
import { CollectionName } from "./enum/CollectionName";
import { UserRole } from "./enum/UserRole";

export const insertUser = async (uid: string, role: UserRole) => {
  try {
    await createDoc(CollectionName.USERS, { uid, role });
  } catch (e) {
    console.error(`Error adding user to users collection: ${e}`);
    alert('Error adding new user to database. Permissions to read and write in the app may not be correctly applied.');
  }
}