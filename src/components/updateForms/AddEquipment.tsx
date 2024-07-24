import { defaultEquipmentFormData } from "@data/emptyFormData";
import { useState } from "react";
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
}

function AddEquipment ({handleChange, handleSubmit, formData, setFormData}: Props) {
  const [showForm, setShowForm] = useState(false);
  
  return (
    <div>
      <FormHeader
        formTitle="New Equipment"
        onClick={() => setShowForm(!showForm)}
        showForm={showForm}
      />
    
    {
      showForm &&
      <form onSubmit={(event) => {handleSubmit(event, formData, setFormData, defaultEquipmentFormData)}}>
        <div className="update-form-field">
          <label className="update-form-label" htmlFor="type">Name</label>
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
          <label className="update-form-label" htmlFor="description">Description (Optional)</label>
          <textarea
            className="update-form-input"
            id="description"
            name="description"
            onChange={(event) => {handleChange(event, setFormData)}}
            value={formData.description}
          />
        </div>
          
        <Button
          text="Submit Equipment"
          buttonType={ButtonType.INFO}
          type="submit"
          onClick={() => {}}
        />      
        </form>
    }
    </div>
  )
}

export default AddEquipment;