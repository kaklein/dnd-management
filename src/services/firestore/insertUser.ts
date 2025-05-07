import { logError } from "@services/sentry/logger";
import { createDoc } from "./crud/create";
import { CollectionName } from "./enum/CollectionName";
import { UserRole } from "./enum/UserRole";

export const insertUser = async (uid: string, role: UserRole) => {
  try {
    await createDoc(CollectionName.USERS, { uid, role });
  } catch (e) {
    logError(`Error adding user to users collection: ${e}`);
    alert('Error adding new user to database.');
  }
}