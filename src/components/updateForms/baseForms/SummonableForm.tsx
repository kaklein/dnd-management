import Button, { ButtonType } from "@components/Button";
import FormSelect from "@components/FormSelect";
import { defaultSummonableFormData } from "@data/emptyFormData";
import { PlayerCharacter } from "@models/playerCharacter/PlayerCharacter";

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
  pcData: PlayerCharacter;
  modalDismiss?: boolean;
}

function SummonableForm ({handleChange, handleSubmit, formData, setFormData, pcData, modalDismiss=false}: Props) {
  return (
    <form onSubmit={(event) => {handleSubmit(event, formData, setFormData, defaultSummonableFormData)}}>     
      <div className="update-form-field">
        <label className="update-form-label" htmlFor="name">Type</label>
        <input
          className="update-form-input"
          type="text"
          placeholder="Familiar"
          id="type"
          name="type"
          onChange={(event) => {handleChange(event, setFormData)}}
          value={formData.type}
          required
        />
      </div>
      <div className="update-form-field">
        <label className="update-form-label" htmlFor="name">Name (Optional)</label>
        <input
          className="update-form-input"
          type="text"
          placeholder="Fluffy"
          id="name"
          name="name"
          onChange={(event) => {handleChange(event, setFormData)}}
          value={formData.name}
        />
      </div>
      <div className="update-form-field">
        <label className="update-form-label" htmlFor="description">Description</label>
        <textarea
          className="update-form-input"
          id="description"
          name="description"
          onChange={(event) => {handleChange(event, setFormData)}}
          value={formData.description}
          required
        />          
      </div>

      <div className="update-form-field">
        <label className="update-form-label" htmlFor="hitPointMaximum">Max HP</label>
        <input
          type="number"
          className="update-form-input"
          min="0"
          max="999"
          id="hitPointMaximum"
          name="hitPointMaximum"
          onChange={(event) => {handleChange(event, setFormData)}}
          value={formData.hitPointMaximum}
          required
        />     
      </div>

      <div className="update-form-field">
        <label className="update-form-label" htmlFor="armorClass">Armor Class</label>
        <input
          type="number"
          className="update-form-input"
          min="0"
          max="999"
          id="armorClass"
          name="armorClass"
          onChange={(event) => {handleChange(event, setFormData)}}
          value={formData.armorClass}
          required
        />     
      </div>

      <div className="update-form-field">
        <label className="update-form-label" htmlFor="sourceName">Source - Spell or Feature?</label>
        <FormSelect
          className="update-form-input"
          value={formData.sourceType}
          handleChange={handleChange}
          setFormData={setFormData}
          name="sourceType"
          options={
            [
              { text: 'SPELL', value: 'spell'},
              { text: 'FEATURE', value: 'feature'}
            ]
          }
          required
        />
      </div>
      {
        formData.sourceType === 'spell' &&
        <div className="update-form-field">
          <label className="update-form-label" htmlFor="sourceName">Source Spell</label>
          <p className="update-form-description">Select the spell that allows you to summon this{formData.type ? ' ' + formData.type.toLowerCase() : ''}.</p>
          <p className="update-form-description">If you still need to add it, go to the <a href="#spells">Spell</a> section.</p>
          <FormSelect
            className="update-form-input"
            value={formData.sourceName}
            handleChange={handleChange}
            setFormData={setFormData}
            name="sourceName"
            options={
              pcData.baseDetails.spells?.sort((a, b) => {
                if (a.name < b.name) return -1;
                return 1;
              }).map((s) => ({
                text: s.name,
                value: s.name
              })) ?? []
            }
            required
          />
        </div>
      }
      {
        formData.sourceType === 'feature' &&
        <div className="update-form-field">
          <label className="update-form-label" htmlFor="sourceName">Source Feature</label>
          <p className="update-form-description">Select the feature that allows you to summon this {formData.type.toLowerCase()}</p>
          <p className="update-form-description">If you still need to add it, go to the <a href="#features">Feature</a> section.</p>
          <FormSelect
            className="update-form-input"
            value={formData.sourceName}
            handleChange={handleChange}
            setFormData={setFormData}
            name="sourceName"
            options={
              pcData.features?.sort((a, b) => {
                if (a.data.name < b.data.name) return -1;
                return 1;
              }).map((f) => ({
                text: f.data.name,
                value: f.data.name
              })) ?? []
            }
            required
          />      
        </div>
      }
             

      <Button
        text="Save"
        customClass="float-right"
        buttonType={ButtonType.INFO}
        type="submit"
        onClick={() => {}}
        modalDismiss={modalDismiss}
      />
    </form>
  )
}

export default SummonableForm;