import Button, { ButtonType } from "@components/Button";
import FormSelect from "@components/FormSelect";
import { defaultSummonableFormData } from "@data/emptyFormData";
import { RestType } from "@models/enum/RestType";
import { useState } from "react";

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

function SummonableForm ({handleChange, handleSubmit, formData, setFormData, modalDismiss=false}: Props) {
  const [showLimitedUseFields, setShowLimitedUseFields] = useState(formData.maxUses ? true : false);
  const handleLimitedUseCheckboxChange = () => {
    const newVal = !showLimitedUseFields;
    setShowLimitedUseFields(newVal);
    if (!newVal) {
      handleChange({target: {name: 'maxUses', value: ''}}, setFormData);
      handleChange({target: {name: 'refresh', value: ''}}, setFormData);
    }
  };

  return (
    <form onSubmit={(event) => {handleSubmit(event, formData, setFormData, defaultSummonableFormData)}}>     
      <div className="update-form-field">
        <label className="update-form-label" htmlFor="name">Type</label>
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
        <label className="update-form-label" htmlFor="name">Name (Optional)</label>
        <input
          className="update-form-input"
          type="text"
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

      <h5>Source</h5>
      <div className="update-form-field">
        <label className="update-form-label" htmlFor="sourceName">Type</label>
        <FormSelect
          className="update-form-input"
          value={formData.sourceType}
          handleChange={handleChange}
          setFormData={setFormData}
          name="sourceType"
          options={
            [
              { text: 'SPELL', value: 'spell'},
              { text: 'FEATURE / OTHER', value: 'feature'}
            ]
          }
          required
        />
      </div>
      <div className="update-form-field">
        <label className="update-form-label" htmlFor="sourceName">Name</label>
        <p className="update-form-description">Name of the spell or feature that allows you to summon this {formData.type.toLowerCase()}</p>
        <input
          className="update-form-input"
          type="text"
          id="sourceName"
          name="sourceName"
          onChange={(event) => {handleChange(event, setFormData)}}
          value={formData.sourceName}
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

      {
        formData.sourceType == 'feature' &&
        <div>
          <div className="update-form-conditional">
            <p>Are there a limited number of summons?</p>
            <label htmlFor="limitedUseCheckbox">Yes</label>
            <input
              id="limitedUseCheckbox"
              type="checkbox"
              checked={showLimitedUseFields}
              onChange={handleLimitedUseCheckboxChange}
            />
          </div>

          { showLimitedUseFields &&
          <>
            <div className="update-form-field">
              <label className="update-form-label" htmlFor="maxUses">Number of uses</label>
              <input
                className="update-form-input"
                type="number"
                min="1"
                max="99"
                id="maxUses"
                name="maxUses"
                onChange={(event) => {handleChange(event, setFormData)}}
                value={formData.maxUses}
                required={showLimitedUseFields}
              />
            </div>
            <div className="update-form-field">
              <label className="update-form-label" htmlFor="refresh">Refresh after</label>
              <FormSelect
                className="update-form-input"
                value={formData.refresh}
                handleChange={handleChange}
                setFormData={setFormData}
                name="refresh"
                options={
                  Object.values(RestType).sort().map((option) => ({
                    text: option.toUpperCase() + ' REST',
                    value: option
                  }))
                }
                required={showLimitedUseFields}
              />
            </div>
          </>
          }         
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