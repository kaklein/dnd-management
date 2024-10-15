import FormSelect from "@components/FormSelect";
import { defaultSpellFormData } from "@data/emptyFormData";
import { Ability } from "@models/enum/Ability";
import { DamageType } from "@models/enum/DamageType";
import { SpellLevel } from "@models/playerCharacter/Spell";
import { useState } from "react";
import Button, { ButtonType } from "@components/Button";
import TextEditor from "@components/TextEditor";
import { validateRequiredFields } from "../utils";

interface Props {
  handleChange: (event: any, setFunction: (prevFormData: any) => void) => void;
  handleSubmit: (
    event: any, 
    data: any, 
    clearForm: (data: any) => void,
    clearedFormData: any
  ) => void;
  formData: any;
  setFormData: (data: any) => void;
  initialEditorContent: string;
  setInitialEditorContent: (content: string) => void; 
  modalDismiss?: boolean;
}

function SpellForm ({handleChange, handleSubmit, formData, setFormData, initialEditorContent, setInitialEditorContent, modalDismiss=false}: Props) {
  const [showDamageFields, setShowDamageFields] = useState(formData.damage ? true : false);
  const handleDamageCheckboxChange = () => {
    const newVal = !showDamageFields;
    setShowDamageFields(newVal);
    if (!newVal) {
      handleChange({target: {name: 'damage', value: ''}}, setFormData);
      handleChange({target: {name: 'damageType', value: ''}}, setFormData);
    }
  }

  return (
      <form onSubmit={(event) => {
        const { valid, errorMessage } = validateRequiredFields(['description'], formData);
        if (!valid) {
          event.preventDefault();
          alert(errorMessage);
          return;
        } else {
          setInitialEditorContent('<p></p>');
          handleSubmit(event, formData, setFormData, defaultSpellFormData);
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
            initialEditorContent={initialEditorContent}
            handleChange={(value: string) => {
              handleChange({ target: { name: 'description', value: value }}, setFormData);
            }}
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

        <div>
          <div className="update-form-conditional">
            <p>Does this spell deal damage or provide healing?</p>
            <label htmlFor="damageCheckBox">Yes</label>
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
          </>
          }
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