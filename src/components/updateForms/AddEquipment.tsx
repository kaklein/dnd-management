import FormHeader from "./FormHeader";
import EquipmentForm from "./baseForms/EquipmentForm";
import { emptyShowSectionData } from "@data/emptyFormData";

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

function AddEquipment ({handleChange, handleSubmit, formData, setFormData, showSection}: Props) {
  const showForm = showSection.data.equipment;
  
  return (
    <div>
      <FormHeader
        anchorTag="equipment"
        formTitle="Equipment"
        onClick={() => showSection.setFunction({...emptyShowSectionData, equipment: !showForm})}
        showForm={showForm}
      />
    
    {
      showForm &&
      <EquipmentForm
        handleChange={handleChange}
        handleSubmit={handleSubmit}
        formData={formData}
        setFormData={setFormData}
      />
    }
    </div>
  )
}

export default AddEquipment;