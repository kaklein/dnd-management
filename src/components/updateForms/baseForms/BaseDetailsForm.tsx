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
  modalDismiss?: boolean;
}

function BaseDetailsForm ({handleChange, handleSubmit, formData, setFormData, modalDismiss}: Props) {
  return (
    <form onSubmit={(event) => {handleSubmit(event, formData, setFormData, {})}}>
      <div className="update-form-field">
        <label className="update-form-label" htmlFor="description">Description (Optional)</label>
        <textarea
          className="update-form-input"
          id="description"
          name="description"
          onChange={(event) => {handleChange(event, setFormData)}}
          value={formData.description}
        />
      </div>
      <div className="update-form-field">
        <label className="update-form-label" htmlFor="class">Class</label>
        <input
          className="update-form-input"
          type="text"
          id="class"
          name="class"
          onChange={(event) => {handleChange(event, setFormData)}}
          value={formData.class}
          required
        />
      </div>
      <div className="update-form-field">
        <label className="update-form-label" htmlFor="subclass">Subclass (Optional)</label>
        <input
          className="update-form-input"
          type="text"
          id="subclass"
          name="subclass"
          onChange={(event) => {handleChange(event, setFormData)}}
          value={formData.subclass}
        />
      </div>
      <div className="update-form-field">
        <label className="update-form-label" htmlFor="race">Race</label>
        <input
          className="update-form-input"
          type="text"
          id="race"
          name="race"
          onChange={(event) => {handleChange(event, setFormData)}}
          value={formData.race}
          required
        />
      </div>
      <div className="update-form-field">
        <label className="update-form-label" htmlFor="background">Background</label>
        <input
          className="update-form-input"
          type="text"
          id="background"
          name="background"
          onChange={(event) => {handleChange(event, setFormData)}}
          value={formData.background}
          required
        />
      </div>
      <div className="update-form-field">
        <label className="update-form-label" htmlFor="alignment">Alignment</label>
        <input
          className="update-form-input"
          type="text"
          id="alignment"
          name="alignment"
          onChange={(event) => {handleChange(event, setFormData)}}
          value={formData.alignment}
          required
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
          required
        />
      </div>
      <div className="update-form-field">
        <label className="update-form-label" htmlFor="xp">XP (Optional)</label>
        <input
          className="update-form-input"
          type="number"
          min="0"
          max="999999"
          id="xp"
          name="xp"
          onChange={(event) => {handleChange(event, setFormData)}}
          value={formData.xp}
          required
        />
      </div>
      <div className="update-form-field">
        <label className="update-form-label" htmlFor="maxHP">Max Hit Points</label>
        <input
          className="update-form-input"
          type="number"
          min="1"
          max="999"
          id="maxHP"
          name="maxHP"
          onChange={(event) => {handleChange(event, setFormData)}}
          value={formData.maxHP}
          required
        />
      </div>
      <div className="update-form-field">
        <label className="update-form-label" htmlFor="armorClass">Armor Class (AC)</label>
        <input
          className="update-form-input"
          type="number"
          min="0"
          max="99"
          id="armorClass"
          name="armorClass"
          onChange={(event) => {handleChange(event, setFormData)}}
          value={formData.armorClass}
          required
        />
      </div>
      <div className="update-form-field">
        <label className="update-form-label" htmlFor="speed">Speed</label>
        <input
          className="update-form-input"
          type="number"
          min="0"
          max="99"
          id="speed"
          name="speed"
          onChange={(event) => {handleChange(event, setFormData)}}
          value={formData.speed}
          required
        />
      </div>
      <Button
          text="Save"
          buttonType={ButtonType.INFO}
          type="submit"
          onClick={() => {}}
          modalDismiss={modalDismiss}
        />
    </form>
  )
}

export default BaseDetailsForm;