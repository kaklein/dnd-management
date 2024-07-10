import { db } from '../../firebase';
import * as config from '@data/config.json';
import { readSingleItem } from '@services/firestore/crud/read';
import { BaseDetails, PlayerCharacter } from '@models/playerCharacter/PlayerCharacter';
import { AbilityScores } from '@models/playerCharacter/AbilityScores';

export const loadData = async (): Promise<PlayerCharacter> => {
  // Get base character details
  const baseDetails = (await readSingleItem(db, 'pcBaseDetails', { name: {firstName: config.pcFirstName, lastName: config.pcLastName} })).data as BaseDetails;    

  // // Get ability scores
  const abilityScores = (await readSingleItem(db, 'abilityScores', { pcId: baseDetails.pcId })).data as AbilityScores;
  
  // Format
  return { baseDetails, abilityScores };
}