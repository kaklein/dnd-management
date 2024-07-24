import { capitalize } from "@components/utils";
import { useState } from "react";
import FormHeader from "./FormHeader";

interface Props {
  fieldName: string;
  description?: string;
  handleChange: (event: any, setFunction: (prevFormData: any) => void) => void;
  handleSubmit: (
    event: any, 
    data: any, 
    clearForm: (data: any) => void,
    clearedFormData: any
  ) => void;  formData: any;
  setFormData: (data: any) => void;
  defaultFormData: any;
  useTextArea?: boolean;
}

function AddItemToArrayField ({fieldName, handleChange, handleSubmit, formData, setFormData, defaultFormData, description="", useTextArea=false}: Props) {
  const [showForm, setShowForm] = useState(false);

  return (
    <div>
      <FormHeader
        formTitle={`New ${capitalize(fieldName)}`}
        onClick={() => setShowForm(!showForm)}
        showForm={showForm}
      />
    
    {
      (showForm && description) &&
      <p className="update-form-description">{description}</p>
    }
    {
      showForm &&
      <form onSubmit={(event) => {handleSubmit(event, formData, setFormData, defaultFormData)}}>
        <div className="update-form-field">
          <label className="update-form-label" htmlFor={fieldName}>{capitalize(fieldName)}</label>
          {
            !useTextArea &&
            <input
              className="update-form-input"
              type="text"
              id={fieldName}
              name={fieldName}
              onChange={(event) => {handleChange(event, setFormData)}}
              value={formData[fieldName]}
              required
            />
          }
          {
            useTextArea &&
            <textarea
              className="update-form-input"
              id={fieldName}
              name={fieldName}
              onChange={(event) => {handleChange(event, setFormData)}}
              value={formData[fieldName]}
              required
            />
          }
          
        </div>
        
        <button className="update-form-submit-btn" type="submit">Submit {capitalize(fieldName)}</button>
      </form>
    }
    </div>
  )
}

export default AddItemToArrayField;