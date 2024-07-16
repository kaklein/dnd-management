import { defaultEquipmentFormData } from "@data/emptyFormData";
import { useState } from "react";

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

function AddEquipment ({handleChange, handleSubmit, formData, setFormData}: Props) {
  const [showForm, setShowForm] = useState(false);
  
  return (
    <div>
    <h4>Add Equipment</h4>
    <button
      className="btn btn-primary"
      type="button"
      onClick={() => setShowForm(!showForm)}>
        {showForm ? '-' : '+'}
    </button>
    {
      showForm &&
      <form onSubmit={(event) => {handleSubmit(event, formData, setFormData, defaultEquipmentFormData)}}>
        <div className="update-form-field">
          <label className="form-label" htmlFor="type">Type</label>
          <input
            className="form-input"
            type="text"
            id="type"
            name="type"
            onChange={(event) => {handleChange(event, setFormData)}}
            value={formData.type}
            required
          />
        </div>
        <div className="update-form-field">
          <label className="form-label" htmlFor="description">Description (Optional)</label>
          <input
            className="form-input"
            type="text"
            id="description"
            name="description"
            onChange={(event) => {handleChange(event, setFormData)}}
            value={formData.description}
          />
        </div>
          
        <button type="submit">Add</button>
      </form>
    }
    </div>
  )
}

export default AddEquipment;