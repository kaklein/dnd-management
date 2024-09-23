interface Props {
  wisdomModifier: number;
  perceptionProficiency: boolean;
  proficiencyBonus: number;
}

function PassivePerceptionPopoverContent ({wisdomModifier, perceptionProficiency, proficiencyBonus}: Props) {
  const formattedModifier = 
    wisdomModifier > 0 ? `+${wisdomModifier}` :
    String(wisdomModifier);
  
  return (
    <div>
      <div>
        <b>10</b> base
      </div>
      <div>
        <b>{formattedModifier}</b> from WIS modifier
      </div>
      {
        perceptionProficiency &&
        <div>
          <b>+{proficiencyBonus}</b> from proficiency bonus
        </div>
      }
    </div>
  )

}

export default PassivePerceptionPopoverContent;