import FormHeader from "./FormHeader";
import { emptyShowSectionData } from "@data/emptyFormData";
import SummonableForm from "./baseForms/SummonableForm";

interface Props {
  handleChange: (event: any, setFunction: (prevFormData: any) => void) => void;
  handleSubmit: (
    event: any, 
    data: any, 
    clearForm: (data: any) => void,
    clearedFormData: any
  ) => void;  formData: any;
  setFormData: (data: any) => void;
  showSection: {data: any, setFunction: (newValues: any) => void};
}

function AddSummonable ({handleChange, handleSubmit, formData, setFormData, showSection}: Props) {
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
      </p>

      <SummonableForm
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

export default AddSummonable;