import { useState } from "react";
import FormHeader from "./FormHeader";
import SpellForm from "./baseForms/SpellForm";

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

function AddSpell ({handleChange, handleSubmit, formData, setFormData}: Props) {
  const [showForm, setShowForm] = useState(false);
  
  return (
    <div>
      <FormHeader
        formTitle="New Spell"
        onClick={() => setShowForm(!showForm)}
        showForm={showForm}
      />
    
    {
      showForm &&
      <SpellForm
        handleChange={handleChange}
        handleSubmit={handleSubmit}
        formData={formData}
        setFormData={setFormData}
      />
    }
    </div>
  )
}

export default AddSpell;