import { UpdateType } from "@models/enum/service/UpdateType";
import { PlayerCharacter } from "@models/playerCharacter/PlayerCharacter";

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
    armorClass: pcData.baseDetails.armorClass,
    hitPointMaximum: pcData.baseDetails.usableResources.hitPoints.max,
    hitDice: pcData.baseDetails.usableResources.hitDice.max,
    proficiencyBonus: pcData.baseDetails.proficiencyBonus
  }
}

export const defaultCreateCharacterFormData = {
  firstName: '',
  lastName: '',
  playerName: '',
  class: '',
  subclass: '',
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
  xp: 0
}