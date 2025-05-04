import FormSelect from "@components/FormSelect";
import { getDefaultSpellFormData } from "@data/emptyFormData";
import { Ability } from "@models/enum/Ability";
import { DamageType } from "@models/enum/DamageType";
import { SpellLevel } from "@models/playerCharacter/Spell";
import { useEffect, useState } from "react";
import Button, { ButtonType } from "@components/Button";
import TextEditor, { buildEditor } from "@components/TextEditor";
import { validateRequiredFields } from "../utils";
import { PlayerCharacter } from "@models/playerCharacter/PlayerCharacter";
import { capitalize } from "@components/utils";
import CheckboxMultiSelect from "@components/CheckboxMultiSelect";

interface Props {
  handleChange: (event: any, setFunction: (prevFormData: any) => void) => void;
  handleSubmit: (
    event: any, 
    data: any, 
    clearForm: (data: any) => void,
    clearedFormData: any
  ) => Promise<void>;
  formData: any;
  setFormData: (data: any) => void;
  initialEditorContent: string;
  pcData: PlayerCharacter;
  modalDismiss?: boolean;
}

function SpellForm ({handleChange, handleSubmit, formData, setFormData, initialEditorContent, pcData, modalDismiss=false}: Props) {
  const [showDamageFields, setShowDamageFields] = useState(formData.damage ? true : false);
  useEffect(() => {
    setShowDamageFields(formData.damage ? true : false);
  }, [formData.damage]);
  const handleDamageCheckboxChange = () => {
    const newVal = !showDamageFields;
    setShowDamageFields(newVal);
    if (!newVal) {
      handleChange({target: {name: 'damage', value: ''}}, setFormData);
      handleChange({target: {name: 'damageType', value: ''}}, setFormData);
    }
  }

  const editor = buildEditor(initialEditorContent, (value: string) => {
    handleChange({ target: { name: 'description', value: value }}, setFormData);
  });

  return (
      editor &&
      <form onSubmit={async (event) => {
        const { valid, errorMessage } = validateRequiredFields(['description'], formData);
        if (!valid) {
          event.preventDefault();
          alert(errorMessage);
          return;
        } else {
          await handleSubmit(event, formData, setFormData, getDefaultSpellFormData(pcData));
          editor.commands.clearContent();
        }
      }}>
        <div className="update-form-field">
          <label className="update-form-label" htmlFor="name">Name</label>
          <input
            className="update-form-input"
            type="text"
            id="name"
            name="name"
            onChange={(event) => {handleChange(event, setFormData)}}
            value={formData.name}
            required
          />
        </div>
        <div className="update-form-field">
          <label className="update-form-label" htmlFor="description">Description</label>
          <p className="update-form-description">
            Copy/paste the full spell description here. This will be displayed on the Details page for easy reference.
          </p>
          <TextEditor
            editor={editor}
          />
        </div>
        <div className="update-form-field">
          <label className="update-form-label" htmlFor="level">Spell Level</label>
          <FormSelect
            className="update-form-input"
            value={formData.level}
            handleChange={handleChange}
            setFormData={setFormData}
            name="level"
            options={
              Object.values(SpellLevel).sort().map((option) => ({
                text: option.toUpperCase(),
                value: option
              }))
            }
            required
          />
        </div>
        <div className="update-form-field">
          <label className="update-form-label" htmlFor="spellCastingAbility">Spellcasting Ability</label>
          {
            pcData.baseDetails.defaultSpellCastingAbility &&
            <p className="update-form-description">{`Character default: ${capitalize(pcData.baseDetails.defaultSpellCastingAbility)}`}</p>
          }
          <FormSelect
            className="update-form-input"
            value={formData.spellCastingAbility}
            handleChange={handleChange}
            setFormData={setFormData}
            name="spellCastingAbility"
            options={
              Object.values(Ability).sort().map((option) => ({
                text: option.toUpperCase(),
                value: option
              }))
            }
            required
          />          
        </div>

        <div className="form-section">
          <p className="update-form-label no-bottom-margin">Check all that apply:</p>
          <div>
            <div>
              <div className="update-form-conditional container-fluid">
                <div className="row">
                  <div className="col-auto">
                    <input
                      id="attackCheckBox"
                      type="checkbox"
                      checked={formData.hasAttack}
                      onChange={() => setFormData({...formData, hasAttack: !formData.hasAttack})}
                      className="no-margin"
                    />
                  </div>
                  <div className="col no-padding">
                    <label htmlFor="attackCheckBox" className="inline-label inline">Spell includes making an <b>attack</b></label>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <div className="update-form-conditional container-fluid">
                <div className="row">
                  <div className="col-auto">
                    <input
                      id="saveDCCheckbox"
                      type="checkbox"
                      checked={formData.hasSaveDC}
                      onChange={() => setFormData({...formData, hasSaveDC: !formData.hasSaveDC})}
                      className="no-margin"
                    />
                  </div>
                  <div className="col no-padding">
                    <label htmlFor="saveDCCheckbox" className="inline-label inline">Spell requires a <b>saving throw</b> by target(s)</label>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <div className="update-form-conditional container-fluid">
                <div className="row">
                  <div className="col-auto">
                    <input
                      id="damageCheckBox"
                      type="checkbox"
                      checked={showDamageFields}
                      onChange={handleDamageCheckboxChange}
                      className="no-margin"
                    />
                  </div>
                  <div className="col no-padding">
                    <label htmlFor="damageCheckBox" className="inline-label inline">Spell does <b>damage</b> or provides <b>healing</b></label>
                  </div>
                </div>
              </div>
            
              { showDamageFields &&
              <div className="form-sub-section">
                <div className="update-form-field">
                <label className="update-form-label" htmlFor="damage">Damage/Healing Amount</label>
                <input
                  className="update-form-input"
                  type="text"
                  id="damage"
                  name="damage"
                  placeholder="1d6"
                  onChange={(event) => {handleChange(event, setFormData)}}
                  value={formData.damage}
                  required
                />
                </div>
                <div className="update-form-field">
                  <label className="update-form-label" htmlFor="damageType">Damage Type</label>
                  <p className="update-form-description">Select damage type, or 'HEALING' for healing spells</p>
                  <FormSelect
                    className="update-form-input"
                    value={formData.damageType}
                    handleChange={handleChange}
                    setFormData={setFormData}
                    name="damageType"
                    options={
                      Object.values(DamageType).sort().map((option) => ({
                        text: option.toUpperCase(),
                        value: option
                      }))
                    }
                    required
                  />
                </div> 
              </div>
              }
            </div>
          </div>
        </div>

        <div>
          <label className="update-form-label">Add Tags (Optional)</label>
          <CheckboxMultiSelect
            formData={formData}
            setFormData={setFormData}
            formDataFieldName="tags"
          />
        </div>    

        <div className="update-form-field">
          <label className="update-form-label" htmlFor="sourceUrl">Source URL (Optional)</label>
          <p className="update-form-description">
            Link to full details of this spell, e.g. a wikidot page.
          </p>
          <input
            className="update-form-input"
            type="text"
            id="sourceUrl"
            name="sourceUrl"
            onChange={(event) => {handleChange(event, setFormData)}}
            value={formData.sourceUrl}
          />
        </div>
           
        <Button
          text="Save"
          customClass="float-right"
          buttonType={ButtonType.INFO}
          type="submit"
          onClick={() => {}}
          modalDismiss={modalDismiss}
        />
      </form>      
  )
}

export default SpellForm;