import { DamageType } from "@models/enum/DamageType";
import { RestType } from "@models/enum/RestType";
import { useState } from "react";

interface Props {
  handleChange: (event: any, setFunction: (prevFormData: any) => void) => void;
  handleSubmit: (event: any, data: any) => void;
  formData: any;
  setFormData: (data: any) => void;
}

function AddFeature ({handleChange, handleSubmit, formData, setFormData}: Props) {
  const [showForm, setShowForm] = useState(false);
  
  const [showLimitedUseFields, setShowLimitedUseFields] = useState(false);
  const handleLimitedUseCheckboxChange = () => {
    setShowLimitedUseFields(!showLimitedUseFields);
  };

  const [showDamageFields, setShowDamageFields] = useState(false);
  const handleDamageCheckboxChange = () => {
    setShowDamageFields(!showDamageFields);
  }

  const [showSaveDCField, setShowSaveDCField] = useState(false);
  const handleSavDcCheckboxChange = () => {
    setShowSaveDCField(!showSaveDCField);
  }
  
  return (
    <div>
    <h4>Add New Feature</h4>
    <button
      className="btn btn-primary"
      type="button"
      onClick={() => setShowForm(!showForm)}>
        {showForm ? '-' : '+'}
    </button>
    {
      showForm &&
      <form onSubmit={(event) => {handleSubmit(event, formData)}}>
        <div className="update-form-field">
          <label className="form-label" htmlFor="name">Name</label>
          <input
            className="form-input"
            type="text"
            id="name"
            name="name"
            onChange={(event) => {handleChange(event, setFormData)}}
            value={formData.name}
            required
          />
        </div>
        <div className="update-form-field">
          <label className="form-label" htmlFor="description">Description</label>
          <input
            className="form-input"
            type="text"
            id="description"
            name="description"
            onChange={(event) => {handleChange(event, setFormData)}}
            value={formData.description}
            required
          />
        </div>
        <div className="update-form-field">
          <label className="form-label" htmlFor="source">Source</label>
          <p>
            The reason you have this feature, e.g. 'Fighter' or 'Elf'
          </p>
          <input
            className="form-input"
            type="text"
            id="source"
            name="source"
            onChange={(event) => {handleChange(event, setFormData)}}
            value={formData.source}
            required
          />
        </div>

        <div>
          <p>Are there a limited number of uses for this feature?</p>
          <label htmlFor="limitedUseCheckbox">Yes</label>
          <input
            id="limitedUseCheckbox"
            type="checkbox"
            checked={showLimitedUseFields}
            onChange={handleLimitedUseCheckboxChange}
          />

          { showLimitedUseFields &&
          <>
            <div className="update-form-field">
              <label className="form-label" htmlFor="maxUses">Number of uses</label>
              <input
                className="form-input"
                type="number"
                min="1"
                max="99"
                id="maxUses"
                name="maxUses"
                onChange={(event) => {handleChange(event, setFormData)}}
                value={formData.maxUses}
                required
              />
            </div>
            <div className="update-form-field">
              <label className="form-label" htmlFor="refresh">Refresh after</label>
              <select
                className="form-input"
                id="refresh"
                name="refresh"
                onChange={(event) => handleChange(event, setFormData)}
              >
                {Object.values(RestType).sort().map((option, i) => (
                  <option value={option} key={i}>{option.toUpperCase()} REST</option>
                ))}
              </select>
            </div>
          </>
          }         
        </div>

        <div>
          <p>Does this feature deal damage?</p>
          <label htmlFor="damageCheckbox">Yes</label>
          <input
            id="damageCheckbox"
            type="checkbox"
            checked={showDamageFields}
            onChange={handleDamageCheckboxChange}
          />

          { showDamageFields &&
          <>
            <div className="update-form-field">
              <label className="form-label" htmlFor="damage">Damage</label>
              <input
                className="form-input"
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
              <label className="form-label" htmlFor="damageType">Damage Type</label>
              <select
                className="form-input"
                id="damageType"
                name="damageType"
                onChange={(event) => handleChange(event, setFormData)}
              >
                {Object.values(DamageType).sort().map((option, i) => (
                  <option value={option} key={i}>{option.toUpperCase()}</option>
                ))}
              </select>
            </div>
          </>
          }
        </div>

        <div>
          <p>Is there a save DC for this feature?</p>
          <label htmlFor="saveDcCheckbox">Yes</label>
          <input
            id="saveDcCheckbox"
            type="checkbox"
            checked={showSaveDCField}
            onChange={handleSavDcCheckboxChange}
          />

          { showSaveDCField &&
          <>
            <div className="update-form-field">
              <label className="form-label" htmlFor="saveDC">Save DC</label>
              <input
                className="form-input"
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

        <button type="submit">Add</button>
      </form>
    }
    </div>
  )
}

export default AddFeature;