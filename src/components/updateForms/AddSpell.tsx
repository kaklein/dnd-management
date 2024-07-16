import FormSelect from "@components/FormSelect";
import { defaultSpellFormData } from "@data/emptyFormData";
import { Ability } from "@models/enum/Ability";
import { DamageType } from "@models/enum/DamageType";
import { SpellLevel } from "@models/playerCharacter/Spell";
import { useState } from "react";

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
    <h4>Add New Spell</h4>
    <button
      className="btn btn-primary"
      type="button"
      onClick={() => setShowForm(!showForm)}>
        {showForm ? '-' : '+'}
    </button>
    {
      showForm &&
      <form onSubmit={(event) => {handleSubmit(event, formData, setFormData, defaultSpellFormData)}}>
        <div className="update-form-field">
          <label className="form-label" htmlFor="name">Name</label>
          <input
            className="form-input"
            type="text"
            id="name"
            name="name"
            onChange={(event) => {handleChange(event, setFormData)}}
            value={formData.name}
            required
          />
        </div>
        <div className="update-form-field">
          <label className="form-label" htmlFor="description">Description</label>
          <p>
            Copy/paste the full spell description from your source, including Casting Time, 
            Range, Target, Components, Duration, Classes, and Description.
          </p>
          <input
            className="form-input"
            type="text"
            id="description"
            name="description"
            onChange={(event) => {handleChange(event, setFormData)}}
            value={formData.description}
            required
          />
        </div>
        <div className="update-form-field">
          <label className="form-label" htmlFor="level">Spell Level</label>
          <FormSelect
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
          <label className="form-label" htmlFor="spellCastingAbility">Spellcasting Ability</label>
          <FormSelect
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
          <p>Does this spell deal damage?</p>
          <label htmlFor="damageCheckBox">Yes</label>
          <input
            id="damageCheckbox"
            type="checkbox"
            checked={showDamageFields}
            onChange={handleDamageCheckboxChange}
          />

          { showDamageFields &&
          <>
            <div className="update-form-field">
            <label className="form-label" htmlFor="damage">Damage</label>
            <input
              className="form-input"
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
              <label className="form-label" htmlFor="damageType">Damage Type</label>
              <FormSelect
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
           
        <button type="submit">Add</button>
      </form>
    }
    </div>
  )
}

export default AddSpell;