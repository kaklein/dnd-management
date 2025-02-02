import { emptyShowSectionData } from "@data/emptyFormData";
import FormHeader from "./FormHeader";
import SpellForm from "./baseForms/SpellForm";
import { PlayerCharacter } from "@models/playerCharacter/PlayerCharacter";

interface Props {
  handleChange: (event: any, setFunction: (prevFormData: any) => void) => void;
  handleSubmit: (
    event: any, 
    data: any, 
    clearForm: (data: any) => void,
    clearedFormData: any
  ) => Promise<void>;
  formData: any;
  initialEditorContent: string;
  setFormData: (data: any) => void;
  showSection: {data: any, setFunction: (newValues: any) => void};
  pcData: PlayerCharacter;
}

function AddSpell ({handleChange, handleSubmit, formData, setFormData, initialEditorContent, showSection, pcData}: Props) { 
  const showForm = showSection.data.spells;

  return (
    <div>
      <FormHeader
        anchorTag="spells"
        formTitle="Spell"
        onClick={() => showSection.setFunction({...emptyShowSectionData, spells: !showForm})}
        showForm={showForm}
        expandType="add"
      />
    
    {
      showForm &&
      <SpellForm
        handleChange={handleChange}
        handleSubmit={handleSubmit}
        formData={formData}
        setFormData={setFormData}
        initialEditorContent={initialEditorContent}
        pcData={pcData}
      />
    }
    </div>
  )
}

export default AddSpell;