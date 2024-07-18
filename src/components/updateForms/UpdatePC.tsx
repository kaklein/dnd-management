import { PlayerCharacter } from "@models/playerCharacter/PlayerCharacter";
import { useState } from "react";

interface Props {
  pcData: PlayerCharacter;
  handleChange: (event: any, setFunction: (prevFormData: any) => void) => void;
  handleSubmit: (
    event: any, 
    data: any, 
    clearForm: (data: any) => void,
    clearedFormData: any
  ) => void;  formData: any;
  setFormData: (data: any) => void;
}

function UpdatePC ({pcData, handleChange, handleSubmit, formData, setFormData}: Props) {
  const [locked, setLocked] = useState(true);

  return (
    <div>
      <div className="update-form-section-header">
        <h3>Update Character</h3>
      </div>
      
      <div className="form-lock">
        <button
          className="btn btn-danger"
          onClick={() => {setLocked(!locked)}}
        >
          {locked ? 'Unlock' : 'Lock'}
        </button>
      </div>

      <br/>

      <form className="update-pc-form" onSubmit={(event) => {
        handleSubmit(event, formData, setFormData, formData);
        setLocked(true);
      }}>
        <div className="update-form-field">
          <label className="update-form-label" htmlFor="armorClass">Armor Class</label>
          <input
            className="update-form-input"
            type="number"
            min="1"
            max="99"
            id="armorClass"
            name="armorClass"
            onChange={(event) => {handleChange(event, setFormData)}}
            value={formData.armorClass}
            disabled={locked}
          />
        </div>
        <div className="update-form-field">
          <label className="update-form-label" htmlFor="level">Level</label>
          <input
            className="update-form-input"
            type="number"
            min="1"
            max="20"
            id="level"
            name="level"
            onChange={(event) => {handleChange(event, setFormData)}}
            value={formData.level}
            disabled={locked}
          />
        </div>
        <div className="update-form-field">
          <label className="update-form-label" htmlFor="proficiencyBonus">Proficiency Bonus</label>
          <input
            className="update-form-input"
            type="number"
            min="1"
            max="20"
            id="proficiencyBonus"
            name="proficiencyBonus"
            onChange={(event) => {handleChange(event, setFormData)}}
            value={formData.proficiencyBonus}
            disabled={locked}
          />
        </div>
        <div className="update-form-field">
          <label className="update-form-label" htmlFor="hitPointMaximum">Max Hit Points</label>
          <input
            className="update-form-input"
            type="number"
            min="1"
            max="999"
            id="hitPointMaximum"
            name="hitPointMaximum"
            onChange={(event) => {handleChange(event, setFormData)}}
            value={formData.hitPointMaximum}
            disabled={locked}
          />
        </div>
        <div className="update-form-field">
          <label className="update-form-label" htmlFor="hitDice">Hit Dice ({pcData.baseDetails.usableResources.hitDice.type})</label>
          <input
            className="update-form-input"
            type="number"
            min="1"
            max="99"
            id="hitDice"
            name="hitDice"
            onChange={(event) => {handleChange(event, setFormData)}}
            value={formData.hitDice}
            disabled={locked}
          />
        </div>
        <button className="update-form-submit-btn" type="submit" disabled={locked}>Save Changes</button>
      </form>      
    </div>
  )
}

export default UpdatePC;