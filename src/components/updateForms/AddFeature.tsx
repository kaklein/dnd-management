import { DamageType } from "@models/enum/DamageType";
import { RestType } from "@models/enum/RestType";
import { useState } from "react";

interface Props {
  handleChange: (event: any, setFunction: (prevFormData: any) => void) => void;
  handleSubmit: (event: any, data: any) => void;
  featureFormData: any;
  setFeatureFormData: (data: any) => void;
}

function AddFeature ({handleChange, handleSubmit, featureFormData, setFeatureFormData}: Props) {
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
      <form onSubmit={(event) => {handleSubmit(event, featureFormData)}}>
        <div className="update-form-field">
          <label className="form-label" htmlFor="featureName">Name</label>
          <input
            className="form-input"
            type="text"
            id="featureName"
            name="featureName"
            onChange={(event) => {handleChange(event, setFeatureFormData)}}
            value={featureFormData.featureName}
            required
          />
        </div>
        <div className="update-form-field">
          <label className="form-label" htmlFor="featureDescription">Description</label>
          <input
            className="form-input"
            type="text"
            id="featureDescription"
            name="featureDescription"
            onChange={(event) => {handleChange(event, setFeatureFormData)}}
            value={featureFormData.featureDescription}
            required
          />
        </div>
        <div className="update-form-field">
          <label className="form-label" htmlFor="featureSource">Source</label>
          <p>
            The reason you have this feature, e.g. 'Fighter' or 'Elf'
          </p>
          <input
            className="form-input"
            type="text"
            id="featureSource"
            name="featureSource"
            onChange={(event) => {handleChange(event, setFeatureFormData)}}
            value={featureFormData.featureSource}
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
              <label className="form-label" htmlFor="featureMaxUses">Number of uses</label>
              <input
                className="form-input"
                type="number"
                min="1"
                max="99"
                id="featureMaxUses"
                name="featureMaxUses"
                onChange={(event) => {handleChange(event, setFeatureFormData)}}
                value={featureFormData.featureMaxUses}
                required
              />
            </div>
            <div className="update-form-field">
              <label className="form-label" htmlFor="featureRefresh">Refresh after</label>
              <select
                className="form-input"
                id="featureRefresh"
                name="featureRefresh"
                onChange={(event) => handleChange(event, setFeatureFormData)}
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
              <label className="form-label" htmlFor="featureDamage">Damage</label>
              <input
                className="form-input"
                type="text"
                id="featureDamage"
                name="featureDamage"
                placeholder="1d6"
                onChange={(event) => {handleChange(event, setFeatureFormData)}}
                value={featureFormData.featureDamage}
                required
              />
            </div>
            <div className="update-form-field">
              <label className="form-label" htmlFor="featureDamageType">Damage Type</label>
              <select
                className="form-input"
                id="featureDamageType"
                name="featureDamageType"
                onChange={(event) => handleChange(event, setFeatureFormData)}
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
              <label className="form-label" htmlFor="featureSaveDC">Save DC</label>
              <input
                className="form-input"
                type="number"
                min="1"
                max="99"
                id="featureSaveDC"
                name="featureSaveDC"
                onChange={(event) => {handleChange(event, setFeatureFormData)}}
                value={featureFormData.featureSaveDC}
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