import FormHeader from "./FormHeader";
import WeaponForm from "./baseForms/WeaponForm";
import { emptyShowSectionData } from "@data/emptyFormData";

interface Props {
  handleChange: (event: any, setFunction: (prevFormData: any) => void) => void;
  handleSubmit: (
    event: any, 
    data: any, 
    clearForm: (data: any) => void,
    clearedFormData: any
  ) => Promise<void>;
  formData: any;
  setFormData: (data: any) => void;
  initialEditorContent: string;
  showSection: {data: any, setFunction: (newValues: any) => void};
}

function AddWeapon ({handleChange, handleSubmit, formData, setFormData, initialEditorContent, showSection}: Props) {  
  const showForm = showSection.data.weapons;
  
  return (
    <div>
      <FormHeader
        anchorTag="weapons"
        formTitle="Weapon"
        onClick={() => showSection.setFunction({...emptyShowSectionData, weapons: !showForm})}
        showForm={showForm}
        expandType="add"
      />
    
    {
      showForm &&
      <WeaponForm
        handleChange={handleChange}
        handleSubmit={handleSubmit}
        formData={formData}
        setFormData={setFormData}
        initialEditorContent={initialEditorContent}
      />
    }
    </div>
  )
}

export default AddWeapon;