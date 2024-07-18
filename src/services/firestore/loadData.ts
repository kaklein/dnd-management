import * as config from '@data/config.json';
import { readData, readSingleItem } from '@services/firestore/crud/read';
import { BaseDetails, PlayerCharacter } from '@models/playerCharacter/PlayerCharacter';
import { AbilityScores } from '@models/playerCharacter/AbilityScores';
import { Feature } from '@models/playerCharacter/Feature';
import { SpellSlot } from '@models/playerCharacter/usableResources/SpellSlot';
import { CollectionName } from './enum/CollectionName';
import { getDisplayablePCs } from './getDisplayablePCs';
import { UserRole } from './enum/UserRole';
import { getAuth } from '@firebase/auth';

const loadPcData = async (pcId: string): Promise<PlayerCharacter> => {
  // Get base character details
  const baseDetails = (await readSingleItem(CollectionName.PC_BASE_DETAILS, { pcId })).data as BaseDetails; 
  
  // Get ability scores
  const abilityScores = (await readSingleItem(CollectionName.ABILITY_SCORES, { pcId })).data as AbilityScores;

  // Get features
  const features = (await readData(CollectionName.FEATURES, { pcId })) as Feature[];
  features.sort((a, b) =>  { 
    if (a.id < b.id) return -1;
    return 1;
   });

  // Get spell slots
  const spellSlots = (await readData(CollectionName.SPELL_SLOTS, { pcId })) as SpellSlot[];
  spellSlots.sort((a, b) => {
    if (a.data.level < b.data.level) return -1;
    return 1;
  });
  
  // Format
  return { baseDetails, abilityScores, features, spellSlots };
}

const loadPCList = async (): Promise<BaseDetails[]> => {
  const userRole = localStorage.getItem('userRole');
  if(!userRole) {
    throw Error('No user role found; cannot load data.');
  }

  const currentUser = getAuth().currentUser;
  if(!currentUser) {
    throw Error('No current user found; cannot load data.');
  }

  const displayablePCs = await getDisplayablePCs(currentUser.uid, userRole as UserRole);
  
  let pcBaseDetails: BaseDetails[] = [];
  for (const pc of displayablePCs) {
    pcBaseDetails.push(pc.data);
  }
  return pcBaseDetails;
}

export const loadData = async (selectedPcId: string | null): Promise<{
  pcList: BaseDetails[];
  selectedPcData: PlayerCharacter | undefined;
}> => {
  const baseDetails = await loadPCList();
  if (selectedPcId) {
    const pcData = await loadPcData(selectedPcId);
    return {
      pcList: baseDetails,
      selectedPcData: pcData
    }
  } else {
    return {
      pcList: baseDetails,
      selectedPcData: undefined
    }
  }
};