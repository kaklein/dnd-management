import FormSelect from "@components/FormSelect";
import { defaultSpellFormData } from "@data/emptyFormData";
import { Ability } from "@models/enum/Ability";
import { DamageType } from "@models/enum/DamageType";
import { SpellLevel } from "@models/playerCharacter/Spell";
import { useState } from "react";
import FormHeader from "./FormHeader";
import Button, { ButtonType } from "@components/Button";

interface Props {
  handleChange: (event: any, setFunction: (prevFormData: any) => void) => void;
  handleSubmit: (
    event: any, 
    data: any, 
    clearForm: (data: any) => void,
    clearedFormData: any
  ) => void;  formData: any;
  setFormData: (data: any) => void;
}

function AddSpell ({handleChange, handleSubmit, formData, setFormData}: Props) {
  const [showForm, setShowForm] = useState(false);

  const [showDamageFields, setShowDamageFields] = useState(false);
  const handleDamageCheckboxChange = () => {
    const newVal = !showDamageFields;
    setShowDamageFields(newVal);
    if (!newVal) {
      handleChange({target: {name: 'damage', value: ''}}, setFormData);
      handleChange({target: {name: 'damageType', value: ''}}, setFormData);
    }
  }
  
  return (
    <div>
      <FormHeader
        formTitle="New Spell"
        onClick={() => setShowForm(!showForm)}
        showForm={showForm}
      />
    
    {
      showForm &&
      <form onSubmit={(event) => {handleSubmit(event, formData, setFormData, defaultSpellFormData)}}>
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
            Copy/paste the full spell description from your source, including Casting Time, 
            Range, Target, Components, Duration, Classes, and Description. This will be displayed on the Details page for easy reference.
          </p>
          <textarea
            className="update-form-input"
            id="description"
            name="description"
            onChange={(event) => {handleChange(event, setFormData)}}
            value={formData.description}
            required
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
            <p>Does this spell deal damage?</p>
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
            <label className="update-form-label" htmlFor="damage">Damage</label>
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
          text="Submit Spell"
          buttonType={ButtonType.INFO}
          type="submit"
          onClick={() => {}}
        />
      </form>
    }
    </div>
  )
}

export default AddSpell;