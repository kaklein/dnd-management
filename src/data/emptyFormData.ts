import { Ability } from "@models/enum/Ability";
import { DamageType } from "@models/enum/DamageType";
import { UpdateType } from "@models/enum/service/UpdateType";
import { WeaponModifierProperty } from "@models/enum/WeaponModifierProperty";
import { SpellLevel } from "@models/playerCharacter/Spell";

export const defaultWeaponFormData = {
  updateType: UpdateType.WEAPONS,
  name: '',
  type: '',
  damage: '',
  damageType: DamageType.ACID,
  modifierProperty: WeaponModifierProperty.FINESSE,
  magic: "false",
  description: ''
};

export const defaultSpellFormData = {
  updateType: UpdateType.SPELLS,
  name: '',
  description: '',
  level: SpellLevel.CANTRIP,
  spellCastingAbility: Ability.CHA,
  damageType: '',
  damage: DamageType.ACID
};

export const defaultSpellSlotFormData = {
  updateType: UpdateType.SPELL_SLOTS,
  level: SpellLevel.L1,
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