import * as config from '@data/config.json';
import { readData, readSingleItem } from '@services/firestore/crud/read';
import { BaseDetails, PlayerCharacter } from '@models/playerCharacter/PlayerCharacter';
import { AbilityScores } from '@models/playerCharacter/AbilityScores';
import { Feature } from '@models/playerCharacter/Feature';
import { SpellSlot } from '@models/playerCharacter/usableResources/SpellSlot';
import { CollectionName } from './enum/CollectionName';

export const loadData = async (): Promise<PlayerCharacter> => {
  // Get base character details
  const baseDetails = (await readSingleItem(CollectionName.PC_BASE_DETAILS, { name: {firstName: config.pcFirstName, lastName: config.pcLastName} })).data as BaseDetails;    

  // Get ability scores
  const abilityScores = (await readSingleItem(CollectionName.ABILITY_SCORES, { pcId: baseDetails.pcId })).data as AbilityScores;

  // Get features
  const features = (await readData(CollectionName.FEATURES, {pcId: baseDetails.pcId})) as Feature[];

  // Get spell slots
  const spellSlots = (await readData(CollectionName.SPELL_SLOTS, {pcId: baseDetails.pcId})) as SpellSlot[];
  
  // Format
  return { baseDetails, abilityScores, features, spellSlots };
}