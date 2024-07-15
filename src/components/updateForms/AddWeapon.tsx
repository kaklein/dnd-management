import { DamageType } from "@models/enum/DamageType"
import { WeaponModifierProperty } from "@models/enum/WeaponModifierProperty"
import { useState } from "react";
import { Link } from "react-router-dom"

interface Props {
  handleChange: (event: any, setFunction: (prevFormData: any) => void) => void;
  handleSubmit: (event: any, data: any) => void;
  weaponFormData: any;
  setWeaponFormData: (data: any) => void;
}

function AddWeapon ({handleChange, handleSubmit, weaponFormData, setWeaponFormData}: Props) {
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
      <form onSubmit={(event) => {handleSubmit(event, weaponFormData)}}>
      <div className="update-form-field">
        <label className="form-label" htmlFor="weaponName">Weapon Name</label>
        <input
          className="form-input"
          type="text"
          id="weaponName"
          name="weaponName"
          onChange={(event) => {handleChange(event, setWeaponFormData)}}
          value={weaponFormData.weaponName}
          required
        />
      </div>
      <div className="update-form-field">
        <label className="form-label" htmlFor="weaponType">Type</label>
        <p>"dagger", "quarterstaff", "shortbow", etc. See all possible weapon types listed <Link to="http://dnd5e.wikidot.com/weapons" target="_blank">here</Link>.</p>
        <input
          className="form-input"
          type="text"
          id="weaponType"
          name="weaponType"
          onChange={(event) => {handleChange(event, setWeaponFormData)}}
          value={weaponFormData.weaponType}
          required
        />
      </div>
      <div className="update-form-field">
        <label className="form-label" htmlFor="weaponDamage">Base Damage</label>
        <input
          className="form-input"
          type="text"
          id="weaponDamage"
          name="weaponDamage"
          placeholder="1d6"
          onChange={(event) => {handleChange(event, setWeaponFormData)}}
          value={weaponFormData.weaponDamage}
          required
        />
      </div>
      <div className="update-form-field">
        <label className="form-label" htmlFor="weaponDamageType">Damage Type</label>
        <select
          className="form-input"
          id="weaponDamageType"
          name="weaponDamageType"
          onChange={(event) => handleChange(event, setWeaponFormData)}
        >
          {Object.values(DamageType).sort().map((option, i) => (
            <option value={option} key={i}>{option.toUpperCase()}</option>
          ))}
        </select>
      </div>
      <div className="update-form-field">
        <label className="form-label" htmlFor="weaponModifierProperty">Weapon Range</label>
        <p>
          This will be used to determine the attack bonus modifier for the weapon.
          Select <b>Finesse</b> if it is a finesse weapon. 
          Otherwise, select <b>Melee</b> or <b>Ranged</b> as applies to the weapon.
        </p>
        <select
          className="form-input"
          id="weaponModifierProperty"
          name="weaponModifierProperty"
          onChange={(event) => handleChange(event, setWeaponFormData)}
        >
          {Object.values(WeaponModifierProperty).sort().map((option, i) => (
            <option value={option} key={i}>{option}</option>
          ))}
        </select>
      </div>
      <div className="update-form-field">
        <label className="form-label" htmlFor="weaponMagic">Is this weapon magic?</label>
        <input
          type="radio"
          id="No"
          name="weaponMagic"
          value="false"
          checked={weaponFormData.weaponMagic === "false"}
          onChange={(event) => handleChange(event, setWeaponFormData)}
        />
        <label htmlFor="weaponMagic">No</label>
        <input
          type="radio"
          id="Yes"
          name="weaponMagic"
          value="true"
          checked={weaponFormData.weaponMagic === "true"}
          onChange={(event) => handleChange(event, setWeaponFormData)}
        />
        <label htmlFor="weaponMagic">Yes</label>
      </div>
      <div className="update-form-field">
        <label className="form-label" htmlFor="weaponDescription">Description (Optional)</label>
        <input
          className="form-input long-text-input"
          type="text"
          id="weaponDescription"
          name="weaponDescription"
          onChange={(event) => {handleChange(event, setWeaponFormData)}}
          value={weaponFormData.weaponDescription}
        />
      </div>
      
      
      <button type="submit">Add</button>
    </form>
    }
    </div>
  )
}

export default AddWeapon;