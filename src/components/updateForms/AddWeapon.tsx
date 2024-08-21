import { useState } from "react";
import FormHeader from "./FormHeader";
import WeaponForm from "./baseForms/WeaponForm";

interface Props {
  handleChange: (event: any, setFunction: (prevFormData: any) => void) => void;
  handleSubmit: (
    event: any, 
    data: any, 
    clearForm: (data: any) => void,
    clearedFormData: any
  ) => void;
  formData: any;
  setFormData: (data: any) => void;
}

function AddWeapon ({handleChange, handleSubmit, formData, setFormData}: Props) {
  const [showForm, setShowForm] = useState(false);
  
  return (
    <div>
      <FormHeader
        formTitle="New Weapon"
        onClick={() => setShowForm(!showForm)}
        showForm={showForm}
      />
    
    {
      showForm &&
      <WeaponForm
        handleChange={handleChange}
        handleSubmit={handleSubmit}
        formData={formData}
        setFormData={setFormData}
      />
    }
    </div>
  )
}

export default AddWeapon;