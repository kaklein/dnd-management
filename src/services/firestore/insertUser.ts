import { SentryLogger } from "@services/sentry/logger";
import { createDoc } from "./crud/create";
import { CollectionName } from "./enum/CollectionName";
import { UserRole } from "./enum/UserRole";

export const insertUser = async (uid: string, role: UserRole, logger: SentryLogger) => {
  try {
    await createDoc(CollectionName.USERS, { uid, role });
  } catch (e) {
    logger.logError(`Error adding user to users collection: ${e}`);
    alert('Error adding new user to database.');
  }
}