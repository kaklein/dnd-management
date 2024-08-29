import { replaceBooleans } from "@components/utils";
import { CreateCharacterFormData } from "@models/CreateCharacterFormData";
import { UpdateType } from "@models/enum/service/UpdateType";
import { AbilityScores } from "@models/playerCharacter/AbilityScores";
import { PlayerCharacter } from "@models/playerCharacter/PlayerCharacter";
import { ShowConfirmDeleteData } from "@models/ShowConfirmDeleteData";

export const defaultWeaponFormData = {
  updateType: UpdateType.WEAPONS,
  name: '',
  type: '',
  damage: '',
  damageType: '',
  modifierProperty: '',
  magic: "false",
  description: ''
};

export const defaultSpellFormData = {
  updateType: UpdateType.SPELLS,
  name: '',
  description: '',
  level: '',
  spellCastingAbility: '',
  damageType: '',
  damage: '',
  sourceUrl: ''
};

export const defaultSpellSlotFormData = {
  updateType: UpdateType.SPELL_SLOTS,
  level: '',
  max: ''
}

export const defaultFeatureFormData = {
  updateType: UpdateType.FEATURES,
  name: '',
  description: '',
  source: '',
  maxUses: '',
  refresh: '',
  damage: '',
  damageType: '',
  saveDC: '',
  sourceUrl: ''
};

export const defaultEquipmentFormData = {
  updateType: UpdateType.EQUIPMENT,
  type: '',
  description: ''
};

export const defaultProficiencyFormData = {
  updateType: UpdateType.PROFICIENCIES,
  proficiency: ''
}

export const defaultLanguageFormData = { 
  updateType: UpdateType.LANGUAGES,
  language: ''
}

export const defaultNoteFormData = {
  updateType: UpdateType.NOTES,
  note: ''
}

export const buildDefaultPCFormData = (pcData: PlayerCharacter) => {
  return {
    updateType: UpdateType.BASE_DETAILS,
    level: pcData.baseDetails.level,
    hitPointMaximum: pcData.baseDetails.usableResources.hitPoints.max,
    armorClass: pcData.baseDetails.armorClass,
  }
}

export const buildDefaultAbilityScoreFormData = (s: AbilityScores) => {
  const { id, data } = s;
  const transformed = {
    abilityScoresId: id,
    updateType: UpdateType.ABILITY_SCORES,
    strengthScore: data.strength.score,
    strengthST: data.strength.savingThrows.proficient,
    athletics: data.strength.athletics.proficient,
    dexterityScore: data.dexterity.score,
    dexterityST: data.dexterity.savingThrows.proficient,
    acrobatics: data.dexterity.acrobatics.proficient,
    sleightOfHand: data.dexterity.sleightOfHand.proficient,
    stealth: data.dexterity.stealth.proficient,
    constitutionScore: data.constitution.score,
    constitutionST: data.constitution.savingThrows.proficient,
    intelligenceScore: data.intelligence.score,
    intelligenceST: data.intelligence.savingThrows.proficient,
    arcana: data.intelligence.arcana.proficient,
    history: data.intelligence.history.proficient,
    investigation: data.intelligence.investigation.proficient,
    nature: data.intelligence.nature.proficient,
    religion: data.intelligence.religion.proficient,
    wisdomScore: data.wisdom.score,
    wisdomST: data.wisdom.savingThrows.proficient,
    animalHandling: data.wisdom.animalHandling.proficient,
    insight: data.wisdom.insight.proficient,
    medicine: data.wisdom.medicine.proficient,
    perception: data.wisdom.perception.proficient,
    survival: data.wisdom.survival.proficient,
    charismaScore: data.charisma.score,
    charismaST: data.charisma.savingThrows.proficient,
    deception: data.charisma.deception.proficient,
    intimidation: data.charisma.intimidation.proficient,
    performance: data.charisma.performance.proficient,
    persuasion: data.charisma.performance.proficient,
  }
  return replaceBooleans(transformed);
}

export const defaultCreateCharacterFormData: CreateCharacterFormData = {
  firstName: '',
  lastName: '',
  playerName: '',
  class: '',
  race: '',
  alignment: '',
  background: '',
  level: 1,
  armorClass: 10,
  speed: 30,
  hitPointMaximum: 1,
  hitDiceType: '',
  gold: 0,
  strengthScore: 10,
  strengthST: "false",
  athletics: "false",
  dexterityScore: 10,
  dexterityST: "false",
  acrobatics: "false",
  sleightOfHand: "false",
  stealth: "false",
  constitutionScore: 10,
  constitutionST: "false",
  intelligenceScore: 10,
  intelligenceST: "false",
  arcana: "false",
  history: "false",
  investigation: "false",
  nature: "false",
  religion: "false",
  wisdomScore: 10,
  wisdomST: "false",
  animalHandling: "false",
  insight: "false",
  medicine: "false",
  perception: "false",
  survival: "false",
  charismaScore: 10,
  charismaST: "false",
  deception: "false",
  intimidation: "false",
  performance: "false",
  persuasion: "false",
}

export const emptyShowConfirmDeleteData: ShowConfirmDeleteData = {
  displayName: '',
  featureId: '',
  objectArrayFieldName: '',
  objectArrayExistingItems: [],
  objectArrayFullItem: {},
  stringArrayItemName: '',
  stringArrayFieldName: ''
}

export const emptyEditModalData = {
  formType: '',
  displayName: '',
  name: '', // weapons, spells, features
  description: '', // weapons, spells, features, equipment
  damage: '', // weapons, spells, features
  damageType: '', // weapons, spells, features
  sourceUrl: '', // spells, features
  type: '', // weapons, equipment

  // equipment
  equipmentId: '',

  // spells
  spellId: '',
  level: '',
  spellCastingAbility: '',

  // features
  featureId: '',
  source: '',
  maxUses: '',
  refresh: '',
  saveDC: '',

  // weapons
  weaponId: '',
  modifierProperty: '',
  magic: 'false',

  // arrayItems: languages/notes/proficiencies
  stringArrayFieldName: '',
  language: '',
  note: '',
  proficiency: '',
  originalItem: '', 
  useTextArea: false
}