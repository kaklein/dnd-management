import { useState } from "react";
import FormHeader from "./FormHeader";
import FeatureForm from "./baseForms/FeatureForm";

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
  
  return (
    <div>
      <FormHeader
        formTitle="New Feature"
        onClick={() => setShowForm(!showForm)}
        showForm={showForm}
      />
    
    {
      showForm &&
      <>
      <p className="update-form-description">
        Add any special features you have due to race, class, magical items, etc.
      </p>

      <FeatureForm
        handleChange={handleChange}
        handleSubmit={handleSubmit}
        formData={formData}
        setFormData={setFormData}
      />
      </>
    }
    </div>
  )
}

export default AddFeature;