import { readData, readSingleItem } from '@services/firestore/crud/read';
import { BaseDetails, PlayerCharacter } from '@models/playerCharacter/PlayerCharacter';
import { AbilityScores } from '@models/playerCharacter/AbilityScores';
import { Feature } from '@models/playerCharacter/Feature';
import { SpellSlot } from '@models/playerCharacter/usableResources/SpellSlot';
import { CollectionName } from './enum/CollectionName';
import { getDisplayablePCs } from './getDisplayablePCs';
import { UserRole } from './enum/UserRole';
import { getAuth } from '@firebase/auth';
import { getUserRole } from './getUserRole';
import { Summonable } from '@models/playerCharacter/Summonable';
import { readFromBucket } from '@services/firebaseStorage/read';
import { FileNameUtil } from '@services/firebaseStorage/util';

const loadPcData = async (pcId: string): Promise<PlayerCharacter> => {
  // Get base character details
  const baseDetails = (await readSingleItem(CollectionName.PC_BASE_DETAILS, { pcId })).data as BaseDetails; 
  
  // Get ability scores
  const abilityScores = (await readSingleItem(CollectionName.ABILITY_SCORES, { pcId })) as AbilityScores;

  // Get features - sort by displayIndex if available, then alphabetically
  const features = (await readData(CollectionName.FEATURES, { pcId })) as Feature[];
  features.sort((a, b) => {
    if (a.data.displayIndex !== undefined && b.data.displayIndex !== undefined) {
      return a.data.displayIndex - b.data.displayIndex;
    } else if (a.data.displayIndex !== undefined) {
      return -1; // a comes before b
    } else if (b.data.displayIndex !== undefined) {
      return 1; // b comes before a
    } else {
      // If neither has displayIndex, sort by name
      if (a.data.name < b.data.name) return -1;
      if (a.data.name > b.data.name) return 1;
      return 0;
    }
  });
  if (features.some(f => f.data.displayIndex === undefined)) {
    for (let f of features) {
      // reassign all indices so they have sequential displayIndex
      f.data.displayIndex = features.indexOf(f);
    }
  }  

  // Get summonables - sort by displayIndex if available, then alphabetically
  const summonables = (await readData(CollectionName.SUMMONABLES, { pcId })) as Summonable[];
  summonables.sort((a, b) => {
    if (a.data.displayIndex !== undefined && b.data.displayIndex !== undefined) {
      return a.data.displayIndex - b.data.displayIndex;
    } else if (a.data.displayIndex !== undefined) {
      return -1; // a comes before b
    } else if (b.data.displayIndex !== undefined) {
      return 1; // b comes before a
    } else {
      // If neither has displayIndex, sort by name, then type
      const aComp = a.data.name ?? a.data.type;
      const bComp = b.data.name ?? b.data.type;
      if (aComp < bComp) return -1;
      if (aComp > bComp) return 1;
      return 0;
    }
  });
  if (summonables.some(f => f.data.displayIndex === undefined)) {
    for (let s of summonables) {
      // reassign all indices so they have sequential displayIndex
      s.data.displayIndex = summonables.indexOf(s);
    }
  } 

  // Get spell slots
  const spellSlots = (await readData(CollectionName.SPELL_SLOTS, { pcId })) as SpellSlot[];
  spellSlots.sort((a, b) => {
    if (a.data.level < b.data.level) return -1;
    return 1;
  });
  
  // Format
  return { baseDetails, abilityScores, features, spellSlots, summonables };
}

const loadPCList = async (): Promise<BaseDetails[]> => {
  const currentUser = getAuth().currentUser;
  if(!currentUser) {
    throw Error('No current user found; cannot load data.');
  }
  const userRole = await getUserRole(currentUser.uid);

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

export const getImageUrl = async (imagePath: string, pcId: string): Promise<string> => {
  if (imagePath) {
    if(!pcId) throw Error('No pcId');
    const fileNameUtil = new FileNameUtil(pcId);
    const url = await readFromBucket(imagePath, fileNameUtil);
    return url;
  } else {
    return '';
  }
};