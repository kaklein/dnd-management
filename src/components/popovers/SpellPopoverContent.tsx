import { AbilityAbbreviation } from "@models/enum/Ability";
import { PlayerCharacter } from "@models/playerCharacter/PlayerCharacter";
import { Spell } from "@models/playerCharacter/Spell";

interface Props {
  pcData: PlayerCharacter;
  spell: Spell;
}

function PopoverContentSpell ({pcData, spell}: Props) {
  const spellCastingMod = pcData.abilityScores.data[spell.spellCastingAbility].modifier;
  let formattedMod: string;
  if (spellCastingMod > 0) formattedMod = `+${spellCastingMod}`;
  else formattedMod = String(spellCastingMod);
    
  return (
    <div>
    <div>
      <b>{formattedMod}</b>{` from spellcasting ability (${AbilityAbbreviation[spell.spellCastingAbility]})`}
    </div>
    <div>
      <b>+{pcData.baseDetails.proficiencyBonus}</b>{` from proficiency bonus`}
    </div>
    </div>
  )
}

export default PopoverContentSpell;