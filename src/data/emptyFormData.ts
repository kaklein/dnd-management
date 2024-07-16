import { UpdateType } from "@models/enum/service/UpdateType";

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