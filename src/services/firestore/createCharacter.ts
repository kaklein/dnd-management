import { transformAbilityScoresForCharacterCreation, transformBaseDetailsForCharacterCreation } from "./utils";
import { createDoc } from "./crud/create";
import { CollectionName } from "./enum/CollectionName";

export const createCharacter = async (uid: string, pcId: string, formData: any) => {
  const baseDetailsTransformed = transformBaseDetailsForCharacterCreation(uid, pcId, formData);
  const abilityScoresTransformed = transformAbilityScoresForCharacterCreation(pcId, formData);
  
  try {
    await createDoc(CollectionName.PC_BASE_DETAILS, baseDetailsTransformed);
    await createDoc(CollectionName.ABILITY_SCORES, abilityScoresTransformed);
  } catch (e) {
    console.error(`Failed to create PC: ${JSON.stringify(e)}`);
    alert('Error creating character. Please refresh the page and try again.');
  }
}