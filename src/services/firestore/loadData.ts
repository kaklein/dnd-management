import { db } from '../../firebase';
import * as config from '@data/config.json';
import { readData, readSingleItem } from '@services/firestore/crud/read';
import { BaseDetails, PlayerCharacter } from '@models/playerCharacter/PlayerCharacter';
import { AbilityScores } from '@models/playerCharacter/AbilityScores';
import { Feature } from '@models/playerCharacter/Feature';
import { SpellSlot } from '@models/playerCharacter/usableResources/SpellSlot';

export const loadData = async (): Promise<PlayerCharacter> => {
  // Get base character details
  const baseDetails = (await readSingleItem(db, 'pcBaseDetails', { name: {firstName: config.pcFirstName, lastName: config.pcLastName} })).data as BaseDetails;    

  // Get ability scores
  const abilityScores = (await readSingleItem(db, 'abilityScores', { pcId: baseDetails.pcId })).data as AbilityScores;

  // Get features
  const features = (await readData(db, 'features', {pcId: baseDetails.pcId})) as Feature[];

  // Get spell slots
  const spellSlots = (await readData(db, 'spellSlots', {pcId: baseDetails.pcId})) as SpellSlot[];
  
  // Format
  return { baseDetails, abilityScores, features, spellSlots };
}