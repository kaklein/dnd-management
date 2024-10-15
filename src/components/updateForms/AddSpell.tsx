import { emptyShowSectionData } from "@data/emptyFormData";
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
  initialEditorContent: string;
  setInitialEditorContent: (content: string) => void;
  setFormData: (data: any) => void;
  showSection: {data: any, setFunction: (newValues: any) => void};
}

function AddSpell ({handleChange, handleSubmit, formData, setFormData, initialEditorContent, setInitialEditorContent, showSection}: Props) { 
  const showForm = showSection.data.spells;

  return (
    <div>
      <FormHeader
        anchorTag="spells"
        formTitle="Spell"
        onClick={() => showSection.setFunction({...emptyShowSectionData, spells: !showForm})}
        showForm={showForm}
      />
    
    {
      showForm &&
      <SpellForm
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

export default AddSpell;