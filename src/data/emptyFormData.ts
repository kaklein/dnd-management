import { buildSpellSlotsCurrentKey, replaceBooleans } from "@components/utils";
import { CreateCharacterFormData } from "@models/CreateCharacterFormData";
import { EditModalFormData } from "@models/EditModalFormData";
import { UpdateType } from "@models/enum/service/UpdateType";
import { AbilityScores } from "@models/playerCharacter/AbilityScores";
import { AllowedFeatureTags, FeatureTag } from "@models/playerCharacter/Feature";
import { PlayerCharacter } from "@models/playerCharacter/PlayerCharacter";
import { AllowedSpellTags, Spell } from "@models/playerCharacter/Spell";
import { SpellSlot } from "@models/playerCharacter/usableResources/SpellSlot";
import { ShowConfirmDeleteData } from "@models/ShowConfirmDeleteData";

export const defaultWeaponFormData = {
  updateType: UpdateType.WEAPONS,
  name: '',
  type: '',
  damage: '',
  damageType: '',
  bonus: '',
  modifierProperty: '',
  magic: "false",
  description: '',
  equipped: "false"
};

export const getDefaultSpellFormData = (pcData: PlayerCharacter) => {
  return {
    updateType: UpdateType.SPELLS,
    name: '',
    description: '',
    level: '',
    spellCastingAbility: pcData.baseDetails.defaultSpellCastingAbility ?? '',
    hasAttack: false,
    hasSaveDC: false,
    damageType: '',
    damage: '',
    sourceUrl: '',
    prepared: "true",
    tags: buildDefaultSpellTags()
  }
};

export const buildDefaultSpellTags = (): FeatureTag[] => {
  return AllowedSpellTags.map(tag => ({
    fieldName: tag.fieldName,
    displayName: tag.displayName,
    value: false
  }));
}

export const defaultSpellSlotFormData = {
  updateType: UpdateType.SPELL_SLOTS,
  level: '',
  max: ''
};

export const buildDefaultFeatureTags = () => {
  return AllowedFeatureTags.map(tag => ({
    fieldName: tag.fieldName,
    displayName: tag.displayName,
    value: false
  }));
}

export const getDefaultFeatureFormData = () => { 
  return {
    updateType: UpdateType.FEATURES,
    name: '',
    description: '',
    source: '',
    maxUses: '',
    displayAsPool: false,
    refresh: '',
    damage: '',
    damageType: '',
    saveDC: '',
    sourceUrl: '',
    tags: buildDefaultFeatureTags()
  }
};

export const defaultSummonableFormData = {
  updateType: UpdateType.SUMMONABLES,
  type: '',
  name: '',
  description: '',
  sourceType: '',
  sourceName: '',
  hitPointMaximum: '',
  hitPointsCurrent: '',
  maxUses: '',
  currentUses: '',
  refresh: '',
  armorClass: '',
  summoned: '',
  attacks: [],
  useAbilityScores: 'false'
}

export const defaultEquipmentFormData = {
  updateType: UpdateType.EQUIPMENT,
  type: '',
  description: ''
};

export const defaultProficiencyFormData = {
  updateType: UpdateType.PROFICIENCIES,
  proficiency: ''
};

export const defaultLanguageFormData = { 
  updateType: UpdateType.LANGUAGES,
  language: ''
};

export const defaultNoteFormData = {
  updateType: UpdateType.NOTES,
  note: ''
};

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
};

export const defaultCreateCharacterFormData: CreateCharacterFormData = {
  firstName: '',
  lastName: '',
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
};

export const emptyShowConfirmDeleteData: ShowConfirmDeleteData = {
  displayName: '',
  featureId: '',
  summonableId: '',
  objectArrayFieldName: '',
  objectArrayExistingItems: [],
  objectArrayFullItem: {},
  stringArrayItemName: '',
  stringArrayFieldName: ''
};

export const emptyEditModalData: EditModalFormData = {
  formType: '',
  displayName: '',
  name: '', // weapons, spells, features, summonables
  description: '', // weapons, spells, features, equipment, base details, summonables
  damage: '', // weapons, spells, features
  damageType: '', // weapons, spells, features
  sourceUrl: '', // spells, features
  type: '', // weapons, equipment, summonables
  level: '', // spells, character
  maxUses: '', // features, summonables
  refresh: '', // features, summonables
  armorClass: '', // character, summonables
  tags: [], // spells, features

  // equipment
  equipmentId: '',

  // spells
  spellId: '',
  spellCastingAbility: '',

  // features
  featureId: '',
  source: '',
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
  useTextArea: false,

  // character
  class: '',
  subclass: '',
  race: '',
  background: '',
  alignment: '',
  maxHP: '',
  speed: '',
  xp: '',
  hitDiceType: '',
  imagePath: '',
  firstName: '',
  lastName: '',
  defaultSpellCastingAbility: '',

  // summonable
  summonableId: '',
  sourceType: '',
  sourceName: '',
  hitPointMaximum: '',
  hitPointsCurrent: '',
  summoned: '',
  attacks: [],
  strengthScore: '',
  dexterityScore: '',
  constitutionScore: '',
  intelligenceScore: '',
  wisdomScore: '',
  charismaScore: '',
  proficiencyBonus: ''
};

export const emptyShowSectionData = {
  spells: false,
  weapons: false,
  features: false,
  equipment: false,
  languages: false,
  proficiencies: false,
  notes: false,
  spellSlots: false,
  summonables: false
};

export const buildEmptyShowSectionData = (searchParams: URLSearchParams) => {
  return {
    spells: searchParams.get("spells") == "true" ? true : false,
    weapons: searchParams.get("weapons") == "true" ? true : false,
    features: searchParams.get("features") == "true" ? true : false,
    equipment: searchParams.get("equipment") == "true" ? true : false,
    languages: searchParams.get("languages") == "true" ? true : false,
    proficiencies: searchParams.get("proficiencies") == "true" ? true : false,
    notes: searchParams.get("notes") == "true" ? true : false,
    spellSlots: searchParams.get("spellSlots") == "true" ? true : false,
    summonables: searchParams.get("summonables") == "true" ? true : false
  }
}

export const getMatchingSpellSlots = (spell: Spell, spellSlots: SpellSlot[]) => {
  const matchingSlots = spellSlots.sort((a,b) => {
    if (a.data.level < b.data.level) return -1;
    return 1;
  }).filter(s => s.data.level >= spell.level && s.data.current > 0);
  return matchingSlots;
};

export const buildDefaultSpellSlotFormData = (spellToCast: Spell, spellSlots: SpellSlot[]) => {
  const matchingSlot = getMatchingSpellSlots(spellToCast, spellSlots)[0];

  if (!matchingSlot) return {};

  return {
    [buildSpellSlotsCurrentKey(matchingSlot)]: matchingSlot.data.current - 1
  };
}