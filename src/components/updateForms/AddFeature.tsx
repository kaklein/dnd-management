import FormSelect from "@components/FormSelect";
import { defaultFeatureFormData } from "@data/emptyFormData";
import { DamageType } from "@models/enum/DamageType";
import { RestType } from "@models/enum/RestType";
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

function AddFeature ({handleChange, handleSubmit, formData, setFormData}: Props) {
  const [showForm, setShowForm] = useState(false);
  
  const [showLimitedUseFields, setShowLimitedUseFields] = useState(false);
  const handleLimitedUseCheckboxChange = () => {
    const newVal = !showLimitedUseFields;
    setShowLimitedUseFields(newVal);
    if (!newVal) {
      handleChange({target: {name: 'damage', value: ''}}, setFormData);
      handleChange({target: {name: 'damageType', value: ''}}, setFormData);
    }
  };

  const [showDamageFields, setShowDamageFields] = useState(false);
  const handleDamageCheckboxChange = () => {
    const newVal = !showDamageFields;
    setShowDamageFields(newVal);
    if (!newVal) {
      handleChange({target: {name: 'maxUses', value: ''}}, setFormData);
      handleChange({target: {name: 'refresh', value: ''}}, setFormData);
    }
  }

  const [showSaveDCField, setShowSaveDCField] = useState(false);
  const handleSavDcCheckboxChange = () => {
    const newVal = !showSaveDCField;
    setShowSaveDCField(newVal);
    if (!newVal) {
      handleChange({target: {name: 'saveDC', value: ''}}, setFormData);
    }
  }
  
  return (
    <div>
      <FormHeader
        formTitle="New Feature"
        onClick={() => setShowForm(!showForm)}
        showForm={showForm}
      />
    
    {
      showForm &&
      <form onSubmit={(event) => {handleSubmit(event, formData, setFormData, defaultFeatureFormData)}}>
        <p className="update-form-description">
          Add any special features you have due to race, class, magical items, etc.
        </p>
        
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
          <label className="update-form-label" htmlFor="source">Source</label>
          <p className="update-form-description">
            The reason you have this feature, e.g. 'Fighter' or 'Elf'
          </p>
          <input
            className="update-form-input"
            type="text"
            id="source"
            name="source"
            onChange={(event) => {handleChange(event, setFormData)}}
            value={formData.source}
            required
          />
        </div>

        <div>
          <div className="update-form-conditional">
            <p>Are there a limited number of uses for this feature?</p>
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

        <div>
          <div className="update-form-conditional">
            <p>Does this feature deal damage?</p>
            <label htmlFor="damageCheckbox">Yes</label>
            <input
              id="damageCheckbox"
              type="checkbox"
              checked={showDamageFields}
              onChange={handleDamageCheckboxChange}
            />
          </div>

          { showDamageFields &&
          <>
            <div className="update-form-field">
              <label className="update-form-label" htmlFor="damage">Damage</label>
              <input
                className="update-form-input"
                type="text"
                id="damage"
                name="damage"
                placeholder="1d6"
                onChange={(event) => {handleChange(event, setFormData)}}
                value={formData.damage}
                required={showDamageFields}
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
                required={showDamageFields}
              />
            </div>
          </>
          }
        </div>

        <div>
          <div className="update-form-conditional">
            <p>Is there a save DC for this feature?</p>
            <label htmlFor="saveDcCheckbox">Yes</label>
            <input
              id="saveDcCheckbox"
              type="checkbox"
              checked={showSaveDCField}
              onChange={handleSavDcCheckboxChange}
            />
          </div>
          
          { showSaveDCField &&
          <>
            <div className="update-form-field">
              <label className="update-form-label" htmlFor="saveDC">Save DC</label>
              <input
                className="update-form-input"
                type="number"
                min="1"
                max="99"
                id="saveDC"
                name="saveDC"
                onChange={(event) => {handleChange(event, setFormData)}}
                value={formData.saveDC}
              />
            </div>
          </>
          }
        </div>
        
        <div className="update-form-field">
          <label className="update-form-label" htmlFor="sourceUrl">Source URL (Optional)</label>
          <p className="update-form-description">
            Link to full details of this feature, e.g. a wikidot page.
          </p>
          <input
            className="update-form-input"
            type="text"
            id="sourceUrl"
            name="sourceUrl"
            onChange={(event) => {handleChange(event, setFormData)}}
            value={formData.sourceUrl}
          />
        </div>

        <button className="update-form-submit-btn" type="submit">Submit Feature</button>
      </form>
    }
    </div>
  )
}

export default AddFeature;