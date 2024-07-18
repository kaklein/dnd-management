import { readSingleItem } from "./crud/read"
import { CollectionName } from "./enum/CollectionName"
import { UserRole } from "./enum/UserRole";

interface User {
  uid: string;
  role: UserRole;
}

export const getUserRole = async (uid: string): Promise<UserRole> => {
  const user: User = (await readSingleItem(CollectionName.USERS, {uid})).data as User;
  return user.role;
}