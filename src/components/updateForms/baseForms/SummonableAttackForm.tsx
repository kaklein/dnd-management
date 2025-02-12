import Button, { ButtonType } from '@components/Button';
import FormSelect from '@components/FormSelect';
import TextEditor, { buildEditor } from '@components/TextEditor';
import { DamageType } from '@models/enum/DamageType';
import { Summonable } from '@models/playerCharacter/Summonable';
import { SummonableAttack } from '@models/playerCharacter/SummonableAttack';
import { useEffect, useState } from 'react';

interface Props {
  formData: any;
  setFormData: (data: any) => void;
  removeAttack: () => void;
  initialEditorContent: string;
  summonable: Summonable | undefined;
  attackId: string;
}

function SummonableAttackForm({ formData, attackId, initialEditorContent, removeAttack, setFormData }: Props) {
  const formDataExistingAttack = formData.attacks.filter((a: SummonableAttack) => a.id == attackId)[0];

  const handleAttackFieldChange = (updatedAttack: SummonableAttack) => {
    const attacks = formData.attacks as SummonableAttack[];

    let updatedAttacks: SummonableAttack[] = attacks;
    
    const existingIndex = attacks.indexOf(attacks.filter(a => a.id == attackId)[0]);
    
    if (existingIndex > -1) {
      updatedAttacks[existingIndex] = updatedAttack;
    } else {
      updatedAttacks.push(updatedAttack);
    }

    setFormData({...formData, attacks: updatedAttacks});
  }
  
  const [showDamageFields, setShowDamageFields] = useState(formDataExistingAttack?.damage ? true : false);
  useEffect(() => {
    setShowDamageFields(formDataExistingAttack?.damage ? true : false);
  }, [formDataExistingAttack?.damage]);
    
  const handleDamageCheckboxChange = () => {
    const newVal = !showDamageFields;
    setShowDamageFields(newVal);
    if (!newVal) {
      handleAttackFieldChange({
        ...formDataExistingAttack,
        damage: '',
        damageType: ''
      })
    }
  }

  const summonableDescriptionEditor = buildEditor(
    initialEditorContent, (value: string) => {
      handleAttackFieldChange({
        ...formDataExistingAttack,
        id: attackId,
        description: value
      });
    },
    false
  );
  
  return (
    summonableDescriptionEditor &&
      <div className="update-form-field summonable-attack-form">
      <label className="update-form-label" htmlFor={`attack-name-${attackId}`}>Attack/Action Name</label>
      <input 
        className="update-form-input"
        type="text"
        id={`attack-name-${attackId}`}
        name="attackName"
        onChange={(event) => {
          handleAttackFieldChange({
            ...formDataExistingAttack,
            id: attackId,
            name: event.target.value
          });
        }}
        value={formDataExistingAttack?.name ?? ''}
        required
      />

      <label className="update-form-label" htmlFor={`attack-description-${attackId}`}>Description</label>
      <TextEditor
        editor={summonableDescriptionEditor}
      />

      <div>
        <div className="update-form-conditional">
          <p>Does this action deal damage or provide healing?</p>
          <label htmlFor="damageCheckbox">Yes</label>
          <input
            id="damageCheckbox"
            type="checkbox"
            checked={showDamageFields}
            onChange={handleDamageCheckboxChange}
          />
        </div>

        { showDamageFields &&
        <>
          <div className="update-form-field">
            <label className="update-form-label" htmlFor={`attack-damage-${attackId}`}>Damage</label>
            <input
              className="update-form-input"
              type="text"
              id={`attack-damage-${attackId}`}
              name="attackDamage"
              placeholder="1d6"
              onChange={(event) => {
                handleAttackFieldChange({
                  ...formDataExistingAttack,
                  id: attackId,
                  damage: event.target.value
                });
              }}
              value={formDataExistingAttack?.damage ?? ''}
              required={showDamageFields}
            />
          </div>
          <div className="update-form-field">
            <label className="update-form-label" htmlFor={`attack-damage-type-${attackId}`}>Damage Type</label>
            <p className="update-form-description">Select damage type, or 'HEALING' for healing actions</p>
            <FormSelect
              className="update-form-input"
              value={formDataExistingAttack.damageType ?? ''}
              handleChange={(event) => {
                handleAttackFieldChange({
                  ...formDataExistingAttack,
                  id: attackId,
                  damageType: event.target.value
                });
              }}
              setFormData={setFormData}
              name="attackDamageType"
              options={
                Object.values(DamageType).sort().map((option) => ({
                  text: option.toUpperCase(),
                  value: option
                }))
              }
              required={showDamageFields}
            />
          </div>
        </>
        }

        <Button
          text="Remove"
          onClick={removeAttack}
          buttonType={ButtonType.DANGER}
        />  
      </div>
    </div>
  )
}

export default SummonableAttackForm;