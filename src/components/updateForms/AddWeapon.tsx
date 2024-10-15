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
  ) => void;
  formData: any;
  setFormData: (data: any) => void;
  initialEditorContent: string;
  setInitialEditorContent: (content: string) => void;
  showSection: {data: any, setFunction: (newValues: any) => void};
}

function AddWeapon ({handleChange, handleSubmit, formData, setFormData, initialEditorContent, setInitialEditorContent, showSection}: Props) {  
  const showForm = showSection.data.weapons;
  
  return (
    <div>
      <FormHeader
        anchorTag="weapons"
        formTitle="Weapon"
        onClick={() => showSection.setFunction({...emptyShowSectionData, weapons: !showForm})}
        showForm={showForm}
      />
    
    {
      showForm &&
      <WeaponForm
        handleChange={handleChange}
        handleSubmit={handleSubmit}
        formData={formData}
        setFormData={setFormData}
        initialEditorContent={initialEditorContent}
        setInitialEditorContent={setInitialEditorContent}
      />
    }
    </div>
  )
}

export default AddWeapon;