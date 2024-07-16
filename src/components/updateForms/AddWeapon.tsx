import { DamageType } from "@models/enum/DamageType"
import { WeaponModifierProperty } from "@models/enum/WeaponModifierProperty"
import { useState } from "react";
import { Link } from "react-router-dom"

interface Props {
  handleChange: (event: any, setFunction: (prevFormData: any) => void) => void;
  handleSubmit: (event: any, data: any) => void;
  formData: any;
  setFormData: (data: any) => void;
}

function AddWeapon ({handleChange, handleSubmit, formData, setFormData}: Props) {
  const [showForm, setShowForm] = useState(false);
  
  return (
    <div>
    <h4>Add New Weapon</h4>
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
        <label className="form-label" htmlFor="name">Weapon Name</label>
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
        <label className="form-label" htmlFor="type">Type</label>
        <p>"dagger", "quarterstaff", "shortbow", etc. See all possible weapon types listed <Link to="http://dnd5e.wikidot.com/weapons" target="_blank">here</Link>.</p>
        <input
          className="form-input"
          type="text"
          id="type"
          name="type"
          onChange={(event) => {handleChange(event, setFormData)}}
          value={formData.type}
          required
        />
      </div>
      <div className="update-form-field">
        <label className="form-label" htmlFor="damage">Base Damage</label>
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
      <div className="update-form-field">
        <label className="form-label" htmlFor="modifierProperty">Weapon Range</label>
        <p>
          This will be used to determine the attack bonus modifier for the weapon.
          Select <b>Finesse</b> if it is a finesse weapon. 
          Otherwise, select <b>Melee</b> or <b>Ranged</b> as applies to the weapon.
        </p>
        <select
          className="form-input"
          id="modifierProperty"
          name="modifierProperty"
          onChange={(event) => handleChange(event, setFormData)}
        >
          {Object.values(WeaponModifierProperty).sort().map((option, i) => (
            <option value={option} key={i}>{option}</option>
          ))}
        </select>
      </div>
      <div className="update-form-field">
        <label className="form-label" htmlFor="magic">Is this weapon magic?</label>
        <input
          type="radio"
          id="No"
          name="magic"
          value="false"
          checked={formData.magic === "false"}
          onChange={(event) => handleChange(event, setFormData)}
        />
        <label htmlFor="magic">No</label>
        <input
          type="radio"
          id="Yes"
          name="magic"
          value="true"
          checked={formData.magic === "true"}
          onChange={(event) => handleChange(event, setFormData)}
        />
        <label htmlFor="magic">Yes</label>
      </div>
      <div className="update-form-field">
        <label className="form-label" htmlFor="description">Description (Optional)</label>
        <input
          className="form-input long-text-input"
          type="text"
          id="description"
          name="description"
          onChange={(event) => {handleChange(event, setFormData)}}
          value={formData.description}
        />
      </div>
      
      
      <button type="submit">Add</button>
    </form>
    }
    </div>
  )
}

export default AddWeapon;