import { AbilityAbbreviation } from "@models/enum/Ability";
import { WeaponModifierProperty } from "@models/enum/WeaponModifierProperty";
import { PlayerCharacter } from "@models/playerCharacter/PlayerCharacter";
import { Weapon } from "@models/playerCharacter/Weapon";
import { determineAttackBonus } from "@pages/utils";

interface Props {
  pcData: PlayerCharacter;
  weapon: Weapon;
  attribute: 'attack bonus' | 'damage'
}

const determineAttackModifierAbility = (pcData: PlayerCharacter, weapon: Weapon): string => {
  if (weapon.modifierProperty === WeaponModifierProperty.MELEE) return AbilityAbbreviation.strength;
  if (weapon.modifierProperty === WeaponModifierProperty.RANGED) return AbilityAbbreviation.dexterity;
  if (weapon.modifierProperty === WeaponModifierProperty.FINESSE) {
    const str = pcData.abilityScores.data.strength;
    const dex = pcData.abilityScores.data.dexterity;
    let ability;
    if (str.modifier > dex.modifier) {
      ability = AbilityAbbreviation.strength;
    } else if (str.modifier < dex.modifier) {
      ability = AbilityAbbreviation.dexterity;
    } else {
      ability = `${AbilityAbbreviation.strength}/${AbilityAbbreviation.dexterity}`
    }
    return ability;
  }
  throw Error(`Unknown weapon modifier property: ${weapon.modifierProperty}`);
}

function WeaponContentPopover({pcData, weapon, attribute}: Props) {
  const attackBonus = determineAttackBonus(weapon, pcData);
  const modAbility = determineAttackModifierAbility(pcData, weapon);

  return (
    <div>
      <div>
        <b>{`${attackBonus > 0 ? '+' : ''}${attackBonus}`}</b> from {modAbility} modifier ({weapon.modifierProperty.toLowerCase()} weapon)
      </div>
      {
      attribute == 'attack bonus' &&
      <div>
        <b>+{pcData.baseDetails.proficiencyBonus}</b> from proficiency bonus
      </div>
      }
      {
        (weapon.bonus !== undefined && weapon.bonus > 0) &&
        <div>
          <b>+{weapon.bonus}</b> weapon bonus
        </div>
      }
    </div>
  )
}

export default WeaponContentPopover;