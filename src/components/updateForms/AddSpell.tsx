import { Ability } from "@models/enum/Ability";
import { DamageType } from "@models/enum/DamageType";
import { SpellLevel } from "@models/playerCharacter/Spell";
import { useState } from "react";

interface Props {
  handleChange: (event: any, setFunction: (prevFormData: any) => void) => void;
  handleSubmit: (event: any, data: any) => void;
  spellFormData: any;
  setSpellFormData: (data: any) => void;
}

function AddSpell ({handleChange, handleSubmit, spellFormData, setSpellFormData}: Props) {
  const [showForm, setShowForm] = useState(false);
  
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
      <form onSubmit={(event) => {handleSubmit(event, spellFormData)}}>
        <div className="update-form-field">
          <label className="form-label" htmlFor="spellName">Name</label>
          <input
            className="form-input"
            type="text"
            id="spellName"
            name="spellName"
            onChange={(event) => {handleChange(event, setSpellFormData)}}
            value={spellFormData.spellName}
            required
          />
        </div>
        <div className="update-form-field">
          <label className="form-label" htmlFor="spellDescription">Description</label>
          <p>
            Copy/paste the full spell description from your source, including Casting Time, 
            Range, Target, Components, Duration, Classes, and Description.
          </p>
          <input
            className="form-input"
            type="text"
            id="spellDescription"
            name="spellDescription"
            onChange={(event) => {handleChange(event, setSpellFormData)}}
            value={spellFormData.spellDescription}
            required
          />
        </div>
        <div className="update-form-field">
          <label className="form-label" htmlFor="spellLevel">Spell Level</label>
          <select
            className="form-input"
            id="spellLevel"
            name="spellLevel"
            onChange={(event) => handleChange(event, setSpellFormData)}
          >
            {Object.values(SpellLevel).sort().map((option, i) => (
              <option value={option} key={i}>{option.toUpperCase()}</option>
            ))}
          </select>
        </div>
        <div className="update-form-field">
          <label className="form-label" htmlFor="spellSpellCastingAbility">Spellcasting Ability</label>
          <select
            className="form-input"
            id="spellSpellCastingAbility"
            name="spellSpellCastingAbility"
            onChange={(event) => handleChange(event, setSpellFormData)}
          >
            {Object.values(Ability).sort().map((option, i) => (
              <option value={option} key={i}>{option}</option>
            ))}
          </select>
        </div>
        <div className="update-form-field">
          <label className="form-label" htmlFor="spellDamage">Damage</label>
          <input
            className="form-input"
            type="text"
            id="spellDamage"
            name="spellDamage"
            placeholder="1d6"
            onChange={(event) => {handleChange(event, setSpellFormData)}}
            value={spellFormData.spellDamage}
            required
          />
        </div>
        <div className="update-form-field">
          <label className="form-label" htmlFor="spellDamageType">Damage Type</label>
          <select
            className="form-input"
            id="spellDamageType"
            name="spellDamageType"
            onChange={(event) => handleChange(event, setSpellFormData)}
          >
            {Object.values(DamageType).sort().map((option, i) => (
              <option value={option} key={i}>{option.toUpperCase()}</option>
            ))}
          </select>
        </div>    
        <button type="submit">Add</button>
      </form>
    }
    </div>
  )
}

export default AddSpell;