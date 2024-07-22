import { WeaponModifierProperty } from "@models/enum/WeaponModifierProperty";
import { PlayerCharacter } from "@models/playerCharacter/PlayerCharacter";
import { Weapon } from "@models/playerCharacter/Weapon";

export const determineAttackBonus = (weapon: Weapon, pcData: PlayerCharacter) => {
  // weapon modifier + proficiency bonus
  let weaponModifier;
  switch (weapon.modifierProperty) {
    case WeaponModifierProperty.MELEE: {
      weaponModifier = pcData.abilityScores.strength.modifier
      break;
    }    
    case WeaponModifierProperty.RANGED: {
      weaponModifier = pcData.abilityScores.dexterity.modifier
      break;
    }
    case WeaponModifierProperty.FINESSE: {
      weaponModifier = Math.max(pcData.abilityScores.strength.modifier, pcData.abilityScores.dexterity.modifier)
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