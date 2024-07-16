import { capitalize } from "@components/utils";
import { useState } from "react";

interface Props {
  fieldName: string;
  handleChange: (event: any, setFunction: (prevFormData: any) => void) => void;
  handleSubmit: (
    event: any, 
    data: any, 
    clearForm: (data: any) => void,
    clearedFormData: any
  ) => void;  formData: any;
  setFormData: (data: any) => void;
  defaultFormData: any;
}

function AddItemToArrayField ({fieldName, handleChange, handleSubmit, formData, setFormData, defaultFormData}: Props) {
  const [showForm, setShowForm] = useState(false);

  return (
    <div>
    <h4>Add New {capitalize(fieldName)}</h4>
    <button
      className="btn btn-primary"
      type="button"
      onClick={() => setShowForm(!showForm)}>
        {showForm ? '-' : '+'}
    </button>
    {
      showForm &&
      <form onSubmit={(event) => {handleSubmit(event, formData, setFormData, defaultFormData)}}>
        <div className="update-form-field">
          <label className="form-label" htmlFor={fieldName}>{capitalize(fieldName)}</label>
          <input
            className="form-input"
            type="text"
            id={fieldName}
            name={fieldName}
            onChange={(event) => {handleChange(event, setFormData)}}
            value={formData[fieldName]}
            required
          />
        </div>
        
        <button type="submit">Add</button>
      </form>
    }
    </div>
  )
}

export default AddItemToArrayField;