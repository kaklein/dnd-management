import { Ability } from "@models/enum/Ability";
import { DamageType } from "@models/enum/DamageType";
import { SpellLevel } from "@models/playerCharacter/Spell";
import { useState } from "react";

interface Props {
  handleChange: (event: any, setFunction: (prevFormData: any) => void) => void;
  handleSubmit: (event: any, data: any) => void;
  formData: any;
  setFormData: (data: any) => void;
}

function AddSpell ({handleChange, handleSubmit, formData, setFormData}: Props) {
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
      <form onSubmit={(event) => {handleSubmit(event, formData)}}>
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
          <select
            className="form-input"
            id="level"
            name="level"
            onChange={(event) => handleChange(event, setFormData)}
          >
            {Object.values(SpellLevel).sort().map((option, i) => (
              <option value={option} key={i}>{option.toUpperCase()}</option>
            ))}
          </select>
        </div>
        <div className="update-form-field">
          <label className="form-label" htmlFor="spellCastingAbility">Spellcasting Ability</label>
          <select
            className="form-input"
            id="spellCastingAbility"
            name="spellCastingAbility"
            onChange={(event) => handleChange(event, setFormData)}
          >
            {Object.values(Ability).sort().map((option, i) => (
              <option value={option} key={i}>{option}</option>
            ))}
          </select>
        </div>
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
          <select
            className="form-input"
            id="damageType"
            name="damageType"
            onChange={(event) => handleChange(event, setFormData)}
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