import { UpdateType } from "@models/enum/service/UpdateType"
import { CollectionName } from "./enum/CollectionName"
import { arrayRemove, arrayUnion } from "firebase/firestore"
import { Weapon } from "@models/playerCharacter/Weapon";
import { DamageType } from "@models/enum/DamageType";
import { WeaponModifierProperty } from "@models/enum/WeaponModifierProperty";
import { Spell, SpellLevel } from "@models/playerCharacter/Spell";
import { Ability } from "@models/enum/Ability";
import { SpellSlot } from "@models/playerCharacter/usableResources/SpellSlot";
import { Feature } from "@models/playerCharacter/Feature";
import { RestType } from "@models/enum/RestType";

export const transformFormDataForUpdate = (pcId: string, data: {updateType: UpdateType, [key: string]: string | number | object}) => { 
  const { updateType, ...updates } = data;
  
  switch (updateType) {
    case UpdateType.BASE_DETAILS: {
      return {
        collectionName: CollectionName.PC_BASE_DETAILS,
        update: {
          pcId: pcId,
          updateObject: {
            level: Number(updates.level),
            armorClass: Number(updates.armorClass),
            'usableResources.hitPoints.max': Number(updates.hitPointMaximum),
            'usableResources.hitDice.max': Number(updates.hitDice),
            proficiencyBonus: Number(updates.proficiencyBonus)
          }
        }
      }
    }
    case UpdateType.WEAPONS: {
      const isMagic = updates.magic === "true" ? true: false;
      const newWeapon: Weapon = {
        name: String(updates.name),
        type: String(updates.type),
        damage: String(updates.damage),
        damageType: String(updates.damageType) as DamageType,
        magic: isMagic,
        modifierProperty: String(updates.modifierProperty) as WeaponModifierProperty,
        ...(updates.description && {description: String(updates.description)})
      };
      return {
        collectionName: CollectionName.PC_BASE_DETAILS,
        update: {
          pcId: pcId,
          updateObject: buildAddToArrayUpdate('weapons', newWeapon)
        }
      }
    }
    case UpdateType.SPELLS: {
      const newSpell: Spell = {
        name: String(updates.name),
        description: String(updates.description),
        level: String(updates.level) as SpellLevel,
        spellCastingAbility: String(updates.spellCastingAbility) as Ability,
        ...(updates.damageType && {damageType: String(updates.damageType) as DamageType}),
        ...(updates.damage && {damage: String(updates.damage)}),
        ...(updates.saveDC && {saveDC: Number(updates.saveDC)}),
        ...(updates.attackBonus && {attackBonus: Number(updates.attackBonus)}),
      }
      return {
        collectionName: CollectionName.PC_BASE_DETAILS,
        update: {
          pcId: pcId,
          updateObject: buildAddToArrayUpdate('spells', newSpell)
        }
      }
    }
    case UpdateType.PROFICIENCIES: {
      return {
        collectionName: CollectionName.PC_BASE_DETAILS,
        update: {
          pcId: pcId,
          updateObject: buildAddToArrayUpdate('proficiencies', updates.proficiency)
        }
      }
    }
    case UpdateType.LANGUAGES: {
      return {
        collectionName: CollectionName.PC_BASE_DETAILS,
        update: {
          pcId: pcId,
          updateObject: buildAddToArrayUpdate('languages', updates.language)
        }
      }
    }
    case UpdateType.EQUIPMENT: {
      return {
        collectionName: CollectionName.PC_BASE_DETAILS,
        update: {
          pcId: pcId,
          updateObject: buildAddToArrayUpdate('equipment', updates)
        }
      }
    }
    case UpdateType.SPELL_SLOTS: {
      const newSpellSlot: SpellSlot = {
        id: '',
        data: {
          pcId: pcId,
          level: String(updates.level) as SpellLevel,
          max: Number(updates.max),
          current: Number(updates.max)
        }
      }
      return {
        collectionName: CollectionName.SPELL_SLOTS,
        create: {
          dataObject: newSpellSlot.data
        }
      }
    }
    case UpdateType.FEATURES: {
      const newFeature: Feature = {
        id: '',
        data: {
          pcId: pcId,
          name: String(updates.name),
          description: String(updates.description),
          source: String(updates.source),
          ...(updates.maxUses && {maxUses: Number(updates.maxUses)}),
          ...(updates.maxUses && {currentUses: Number(updates.maxUses)}),
          ...(updates.refresh && {refresh: String(updates.refresh) as RestType}),
          ...(updates.damage && {damage: String(updates.damage)}),
          ...(updates.damageType && {damageType: String(updates.damageType) as DamageType}),
          ...(updates.saveDC && {saveDC: Number(updates.saveDC)}),
        }
      }
      return {
        collectionName: CollectionName.FEATURES,
        create: {
          dataObject: newFeature.data
        }
      }
    }
  }
};

export const buildAddToArrayUpdate = (arrayFieldName: string, objectToAdd: any) => {
  return {
    [arrayFieldName]: arrayUnion(objectToAdd)
  };
};

export const buildRemoveFromArrayUpdate = (arrayFieldName: string, idToRemove: string) => {
  return {
    [arrayFieldName]: arrayRemove(idToRemove)
  };
};