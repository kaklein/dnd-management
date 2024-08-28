import { getAuth } from "@firebase/auth";
import { readSingleItem } from "./crud/read"
import { CollectionName } from "./enum/CollectionName"
import { UserRole } from "./enum/UserRole";

interface User {
  uid: string;
  role: UserRole;
}

export const getUserRole = async (uid?: string): Promise<UserRole> => {
  let query;
  if (!uid) {
    const currentUser = getAuth().currentUser;
    if (!currentUser) {
      throw Error ('No current user found.');
    }
    query = { uid: currentUser.uid }
  } else {
    query = { uid: uid }
  }
  const user: User = (await readSingleItem(CollectionName.USERS, query)).data as User;
  return user.role;
}