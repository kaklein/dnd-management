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
  damage: ''
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
  saveDC: ''
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