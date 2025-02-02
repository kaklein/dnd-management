import FormSelect from "@components/FormSelect";
import { defaultSpellSlotFormData, emptyShowSectionData } from "@data/emptyFormData";
import { SpellLevel } from "@models/playerCharacter/Spell";
import FormHeader from "./FormHeader";
import Button, { ButtonType } from "@components/Button";

interface Props {
  handleChange: (event: any, setFunction: (prevFormData: any) => void) => void;
  handleSubmit: (
    event: any, 
    data: any, 
    clearForm: (data: any) => void,
    clearedFormData: any
  ) => void;  formData: any;
  setFormData: (data: any) => void;
  showSection: {data: any, setFunction: (newValues: any) => void};
}

function UpdateSpellSlot ({handleChange, handleSubmit, formData, setFormData, showSection}: Props) {
  const showForm = showSection.data.spellSlots;
  
  return (
    <div>
      <FormHeader
        anchorTag="spellSlots"
        formTitle="Spell Slot"
        onClick={() => showSection.setFunction({...emptyShowSectionData, spellSlots: !showForm})}
        showForm={showForm}
        expandType="add"
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
          <label className="update-form-label" htmlFor="max">Number of Slots</label>
          <p className="update-form-description">
            Enter the TOTAL number of slots you have for this spell level. To remove spell slots of this level, enter 0.
          </p>
          <input
            className="update-form-input"
            type="number"
            min="0"
            max="10"
            id="max"
            name="max"
            onChange={(event) => {handleChange(event, setFormData)}}
            value={formData.max}
            required
          />
        </div>

        <Button
          text="Save"
          customClass="float-right"
          buttonType={ButtonType.INFO}
          type="submit"
          onClick={() => {}}
        />
      </form>
    }
    </div>
  )
}

export default UpdateSpellSlot;