import { Ability, AbilityAbbreviation } from "@models/enum/Ability";
import { AbilityScores } from "@models/playerCharacter/AbilityScores";

interface Props {
    proficiencyBonus: number;
    defaultSpellCastingAbility: Ability;
    abilityScores: AbilityScores;
}
  
function SpellSaveDCPopoverContent ({proficiencyBonus, defaultSpellCastingAbility, abilityScores}: Props) {   
    return (
        <div>
        <div><b>8</b> base</div>
        <div><b>+{proficiencyBonus}</b> from proficiency bonus</div>
        <div><b>{abilityScores.data[defaultSpellCastingAbility].modifier > 0 && '+'}{abilityScores.data[defaultSpellCastingAbility].modifier}</b> from spellcasting ability modifier ({AbilityAbbreviation[defaultSpellCastingAbility]})</div>
        </div>
    )
}
  
export default SpellSaveDCPopoverContent;