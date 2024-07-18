import FormSelect from "@components/FormSelect";
import { defaultSpellSlotFormData } from "@data/emptyFormData";
import { SpellLevel } from "@models/playerCharacter/Spell";
import { useState } from "react";
import FormHeader from "./FormHeader";

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

function AddSpellSlot ({handleChange, handleSubmit, formData, setFormData}: Props) {
  const [showForm, setShowForm] = useState(false);
  
  return (
    <div>
      <FormHeader
        formTitle="Add Spell Slot"
        onClick={() => setShowForm(!showForm)}
        showForm={showForm}
      />
    
    {
      showForm &&
      <form onSubmit={(event) => {handleSubmit(event, formData, setFormData, defaultSpellSlotFormData)}}>
        <div className="update-form-field">
          <label className="update-form-label" htmlFor="level">Spell Level</label>
          <FormSelect
            className="update-form-input"
            value={formData.level}
            handleChange={handleChange}
            setFormData={setFormData}
            name="level"
            options={
              Object.values(SpellLevel).filter(level => level !== SpellLevel.CANTRIP).sort().map((option) => ({
                text: option.toUpperCase(),
                value: option
              }))
            }
            required
          />
        </div>
        <div className="update-form-field">
          <label className="update-form-label" htmlFor="max">Total Number of Slots</label>
          <p className="update-form-description">
            Enter the TOTAL number of slots for this spell level. For example, if you previously 
            had two Level 1 spell slots and are gaining one more, enter 3.
          </p>
          <input
            className="update-form-input"
            type="number"
            min="1"
            max="4"
            id="max"
            name="max"
            onChange={(event) => {handleChange(event, setFormData)}}
            value={formData.max}
            required
          />
        </div>
        <button className="update-form-submit-btn" type="submit">Submit Spell Slot Update</button>
      </form>
    }
    </div>
  )
}

export default AddSpellSlot;