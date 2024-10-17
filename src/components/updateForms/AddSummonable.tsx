import FormHeader from "./FormHeader";
import { emptyShowSectionData } from "@data/emptyFormData";
import SummonableForm from "./baseForms/SummonableForm";
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
  setFormData: (data: any) => void;
  initialEditorContent: string;
  showSection: {data: any, setFunction: (newValues: any) => void};
  pcData: PlayerCharacter;
}

function AddSummonable ({handleChange, handleSubmit, formData, setFormData, showSection, initialEditorContent, pcData}: Props) {
  const showForm = showSection.data.summonables;

  return (
    <div>
      <FormHeader
        anchorTag="summonables"
        formTitle="Summonable"
        onClick={() => showSection.setFunction({...emptyShowSectionData, summonables: !showForm})}
        showForm={showForm}
      />
    
    {
      showForm &&
      <>
      <p className="update-form-description">
        If any features or spells (such as Find Familiar) enable you to summon something, add the details of that item here.
        It can then be summoned and tracked from the Tracker page.
      </p>

      <SummonableForm
        handleChange={handleChange}
        handleSubmit={handleSubmit}
        formData={formData}
        setFormData={setFormData}
        pcData={pcData}
        initialEditorContent={initialEditorContent}
      />
      </>
    }
    </div>
  )
}

export default AddSummonable;