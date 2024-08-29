import Button, { ButtonType } from "@components/Button";
import TitleButtonRow from "@components/TitleButtonRow";
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
        <h3>Update Character Base Stats</h3>
      </div>

      <TitleButtonRow
        text="These fields will only change when you get new armor or level up your PC.
        Click the Unlock button to make changes."
        formatAsHeader={false}
        buttons={
          <button
            className="btn btn-danger"
            onClick={() => {setLocked(!locked)}}
          >
            {locked ? 'Unlock' : 'Lock'}
          </button>
        }
      />
      
      <br/>

      <form className="update-pc-form" onSubmit={(event) => {
        handleSubmit(event, formData, setFormData, formData);
        setLocked(true);
      }}>
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

        <Button
          text="Save Changes"
          buttonType={ButtonType.INFO}
          type="submit"
          onClick={() => {}}
          disabled={locked}
        />
      </form>      
    </div>
  )
}

export default UpdatePC;