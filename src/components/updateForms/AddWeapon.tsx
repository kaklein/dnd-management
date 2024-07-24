import FormSelect from "@components/FormSelect";
import { defaultWeaponFormData } from "@data/emptyFormData";
import { DamageType } from "@models/enum/DamageType"
import { WeaponModifierProperty } from "@models/enum/WeaponModifierProperty"
import { useState } from "react";
import { Link } from "react-router-dom"
import FormHeader from "./FormHeader";
import Button, { ButtonType } from "@components/Button";

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
}

function AddWeapon ({handleChange, handleSubmit, formData, setFormData}: Props) {
  const [showForm, setShowForm] = useState(false);
  
  return (
    <div>
      <FormHeader
        formTitle="New Weapon"
        onClick={() => setShowForm(!showForm)}
        showForm={showForm}
      />
    
    {
      showForm &&
      <form onSubmit={(event) => {handleSubmit(event, formData, setFormData, defaultWeaponFormData)}}>
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
        <label className="update-form-label" htmlFor="type">Type</label>
        <p className="update-form-description">"dagger", "quarterstaff", "shortbow", etc. See all possible weapon types listed <Link to="http://dnd5e.wikidot.com/weapons" target="_blank">here</Link>.</p>
        <input
          className="update-form-input"
          type="text"
          id="type"
          name="type"
          onChange={(event) => {handleChange(event, setFormData)}}
          value={formData.type}
          required
        />
      </div>
      <div className="update-form-field">
        <label className="update-form-label" htmlFor="damage">Base Damage</label>
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
      <div className="update-form-field">
        <label className="update-form-label" htmlFor="modifierProperty">Weapon Range</label>
        <p className="update-form-description">
          This will be used to determine the attack bonus modifier for the weapon.
          Select <b>Finesse</b> if it is a finesse weapon. 
          Otherwise, select <b>Melee</b> or <b>Ranged</b> as applies to the weapon.
        </p>
        <FormSelect
          className="update-form-input"
          value={formData.modifierProperty}
          handleChange={handleChange}
          setFormData={setFormData}
          name="modifierProperty"
          options={
            Object.values(WeaponModifierProperty).sort().map((option) => ({
              text: option.toUpperCase(),
              value: option
            }))
          }
          required
        />
      </div>
      <div className="update-form-field">
        <label className="update-form-label" htmlFor="magic">Is this weapon magic?</label>
        <div className="container-fluid">
          <div className="row">
            <div className="col-auto">
              <input
                className="form-radio-input"
                type="radio"
                id="No"
                name="magic"
                value="false"
                checked={formData.magic === "false"}
                onChange={(event) => handleChange(event, setFormData)}
              />
              <label className="form-radio-label" htmlFor="No">No</label>
            </div>
            <div className="col-auto">
              <input
                className="form-radio-input"
                type="radio"
                id="Yes"
                name="magic"
                value="true"
                checked={formData.magic === "true"}
                onChange={(event) => handleChange(event, setFormData)}
              />
              <label className="form-radio-label" htmlFor="Yes">Yes</label>
            </div>
          </div>
        </div> 
      </div>
      <div className="update-form-field">
        <label className="update-form-label" htmlFor="description">Description (Optional)</label>
        <textarea
          className="update-form-input long-text-input"
          id="description"
          name="description"
          onChange={(event) => {handleChange(event, setFormData)}}
          value={formData.description}
        />
      </div>
      
      <Button
          text="Submit Weapon"
          buttonType={ButtonType.INFO}
          type="submit"
          onClick={() => {}}
        />
    </form>
    }
    </div>
  )
}

export default AddWeapon;