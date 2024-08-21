import { capitalize } from "@components/utils";
import { useState } from "react";
import FormHeader from "./FormHeader";
import ArrayItemForm from "./baseForms/ArrayItemForm";

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
      <ArrayItemForm
        fieldName={fieldName}
        handleChange={handleChange}
        handleSubmit={handleSubmit}
        formData={formData}
        setFormData={setFormData}
        defaultFormData={defaultFormData}
        useTextArea={useTextArea}
      />
    }
    </div>
  )
}

export default AddItemToArrayField;