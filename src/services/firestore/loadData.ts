import { db } from '../../firebase';
import * as config from '@data/config.json';
import { readSingleItem } from '@services/firestore/read';
import { BaseDetails, PlayerCharacter } from '@models/playerCharacter/PlayerCharacter';
import { AbilityScores } from '@models/playerCharacter/AbilityScores';

export const loadData = async (): Promise<PlayerCharacter> => {
  console.log('Loading data');
        
  console.log('Getting base character details.');
  // Get base character details
  const baseDetails = await readSingleItem(db, 'pcBaseDetails', { name: {firstName: config.pcFirstName, lastName: config.pcLastName} }) as BaseDetails;    

  // // Get ability scores
  console.log('Getting ability scores.');
  const abilityScores = await readSingleItem(db, 'abilityScores', { pcId: baseDetails.pcId }) as AbilityScores;
  
  // Format
  return { baseDetails, abilityScores };
}