import { WeaponModifierProperty } from "@models/enum/WeaponModifierProperty";
import { Feature } from "@models/playerCharacter/Feature";
import { PlayerCharacter } from "@models/playerCharacter/PlayerCharacter";
import { Weapon } from "@models/playerCharacter/Weapon";
import { updateArrayObjectItem, updateById, updateStringArrayItem } from "@services/firestore/crud/update";
import { CollectionName } from "@services/firestore/enum/CollectionName";
import { getBool } from "@services/firestore/utils";

export const determineAttackBonus = (weapon: Weapon, pcData: PlayerCharacter) => {
  // weapon modifier + proficiency bonus
  let weaponModifier;
  switch (weapon.modifierProperty) {
    case WeaponModifierProperty.MELEE: {
      weaponModifier = pcData.abilityScores.data.strength.modifier
      break;
    }    
    case WeaponModifierProperty.RANGED: {
      weaponModifier = pcData.abilityScores.data.dexterity.modifier
      break;
    }
    case WeaponModifierProperty.FINESSE: {
      weaponModifier = Math.max(pcData.abilityScores.data.strength.modifier, pcData.abilityScores.data.dexterity.modifier)
      break;
    }
  }
  return weaponModifier;
}

export const formatBonus = (num: number, displayZero=true): string => {
  if (num > 0) return `+${num}`;
  if (num == 0 && !displayZero) return '';
  return `${num}`;
}

export const triggerSuccessAlert = (setFunction: (value: boolean) => void) => {
  setFunction(true);
  setTimeout(() => {
      setFunction(false);
  }, 2000);
};

// For use on Details page
export const handleSubmitEdit = async (
  event: React.ChangeEvent<HTMLInputElement>,
  formData: any,
  pcData: PlayerCharacter
) => {
  event.preventDefault();
  if (formData.formType === 'feature') {
    let currentUses = 0;

    if (formData.maxUses) {
      const existingFeature = pcData.features.filter(x => x.id === formData.featureId)[0];
      if (existingFeature.data.currentUses !== undefined && existingFeature.data.maxUses !== undefined) {
        const currentUsed = existingFeature.data.maxUses - existingFeature.data.currentUses;
        currentUses = Math.max(Number(formData.maxUses) - currentUsed, 0);
      } else {
        currentUses = Number(formData.maxUses);
      }
    }
    
    const updatedFeature: Feature = {
        id: '',
        data: {
            pcId: pcData.baseDetails.pcId,
            name: formData.name,
            description: formData.description,
            source: formData.source,
            maxUses: formData.maxUses ? Number(formData.maxUses) : 0,
            currentUses: currentUses,
            refresh: formData.refresh,
            damage: formData.damage,
            damageType: formData.damageType,
            saveDC: formData.saveDC,
            sourceUrl: formData.sourceUrl,
        }
    }
    await updateById(CollectionName.FEATURES, formData.featureId, updatedFeature.data);
  } else if (['spell', 'weapon', 'equipment'].includes(formData.formType)) {     
    let updatedItem;
    let fieldName;
    let existingArray;

    switch(formData.formType) {
        case 'spell': {
            fieldName = 'spells';
            if(!pcData.baseDetails.spells || pcData.baseDetails.spells.length < 1) throw Error ('Spells array is empty');
            existingArray = pcData.baseDetails.spells;
            updatedItem = {
                id: formData.spellId,
                name: formData.name,
                description: formData.description,
                level: formData.level,
                spellCastingAbility: formData.spellCastingAbility,
                damage: formData.damage,
                damageType: formData.damageType,
                saveDC: formData.saveDC,
                sourceUrl: formData.sourceUrl
            }
            break;
        }
        case 'weapon': {
            fieldName = 'weapons';
            existingArray = pcData.baseDetails.weapons;
            updatedItem = {
                id: formData.weaponId,
                name: formData.name,
                type: formData.type,
                damage: formData.damage,
                damageType: formData.damageType,
                modifierProperty: formData.modifierProperty,
                magic: getBool(formData.magic),
                description: formData.description
            }
            break;
        }
        case 'equipment': {
            fieldName = 'equipment';
            existingArray = pcData.baseDetails.equipment;
            updatedItem = {
                id: formData.equipmentId,
                type: formData.type,
                description: formData.description
            }
            break;
        }
        default: {
            throw Error(`Unknown formType: ${formData.formType}`);
        }
    }
    
    await updateArrayObjectItem(
        CollectionName.PC_BASE_DETAILS,
        pcData.baseDetails.pcId,
        fieldName,
        existingArray,
        updatedItem
    );
  } else if (['language', 'note', 'proficiency'].includes(formData.formType)) {     
    let fieldName;
    let existingArray;
    let updatedItem: string;

    switch (formData.formType) {
        case 'language': {
            fieldName = 'languages';
            existingArray = pcData.baseDetails.languages;
            updatedItem = formData.language;
            break;
        }
        case 'note': {
            fieldName = 'notes';
            if(!pcData.baseDetails.notes || pcData.baseDetails.notes.length < 1) throw Error('Notes array is empty');
            existingArray = pcData.baseDetails.notes;
            updatedItem = formData.note;
            break;
        }
        case 'proficiency': {
            fieldName = 'proficiencies';
            existingArray = pcData.baseDetails.proficiencies;
            updatedItem = formData.proficiency;
            break;
        }
        default: {
            throw Error(`Unknown formType: ${formData.formType}`);
        }
    }

    await updateStringArrayItem(
        CollectionName.PC_BASE_DETAILS,
        pcData.baseDetails.pcId,
        fieldName,
        existingArray,
        updatedItem,
        formData.originalItem
    );            
  } else {
    throw Error(`Invalid update type: ${formData.formType}`);
  }
}

export const getHPRange = (currentHP: number, maxHP: number): 'full' | 'high' | 'medium' | 'low' | 'min' | 'dying' => {
  const percentage = (currentHP / maxHP) * 100;
  if (percentage >= 100) return 'full';
  if (percentage > 80) return 'high';
  if (percentage > 30) return 'medium';
  if (currentHP > 1) return 'low';
  if (currentHP > 0) return 'min';
  return 'dying';
}