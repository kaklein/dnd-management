import { BaseDetails } from "@models/playerCharacter/PlayerCharacter";
import { readData } from "./crud/read";
import { CollectionName } from "./enum/CollectionName";
import { UserRole } from "./enum/UserRole";

export const getDisplayablePCs = async (uid: string, userRole: UserRole) => {
  const query = userRole === UserRole.USER ? { uid } : undefined;
  const pcs: {id: string, data: BaseDetails}[] = await readData(CollectionName.PC_BASE_DETAILS, query) as {id: string, data: BaseDetails}[];
  return pcs;
}