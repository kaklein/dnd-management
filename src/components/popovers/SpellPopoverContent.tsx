import { AbilityAbbreviation } from "@models/enum/Ability";
import { PlayerCharacter } from "@models/playerCharacter/PlayerCharacter";
import { Spell } from "@models/playerCharacter/Spell";

interface Props {
  pcData: PlayerCharacter;
  spell: Spell;
  displayType: 'attack bonus' | 'damage' | 'save DC'
}

function PopoverContentSpell ({pcData, spell, displayType}: Props) {
  const spellCastingMod = pcData.abilityScores.data[spell.spellCastingAbility].modifier;
  let formattedMod: string;
  if (spellCastingMod > 0) formattedMod = `+${spellCastingMod}`;
  else formattedMod = String(spellCastingMod);
    
  if (displayType === 'attack bonus') {
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
  } else if (displayType === 'damage') {
    return (<div></div>)
  } else if (displayType === 'save DC') {
    return (
      <div>
        <div>
          <b>8</b> base
        </div>
        <div>
          <b>{formattedMod}</b> from spellcasting ability modifier ({AbilityAbbreviation[spell.spellCastingAbility]})
        </div>
        <div>
          <b>+{pcData.baseDetails.proficiencyBonus}</b> from proficiency bonus
        </div>
      </div>
    )
  }
}

export default PopoverContentSpell;