import { capitalize } from "@components/utils";
import FormHeader from "./FormHeader";
import ArrayItemForm from "./baseForms/ArrayItemForm";
import { emptyShowSectionData } from "@data/emptyFormData";

interface Props {
  fieldName: string;
  description?: string;
  handleChange: (event: any, setFunction: (prevFormData: any) => void) => void;
  handleSubmit: (
    event: any, 
    data: any, 
    clearForm: (data: any) => void,
    clearedFormData: any
  ) => void;  formData: any;
  setFormData: (data: any) => void;
  defaultFormData: any;
  useTextArea?: boolean;
  showSection: {data: any, setFunction: (newValues: any) => void};
}

function AddItemToArrayField ({fieldName, handleChange, handleSubmit, formData, setFormData, defaultFormData, description="", useTextArea=false, showSection}: Props) {
  const arrayFieldName = 
    fieldName == 'language' ? 'languages' : 
    fieldName == 'proficiency' ? 'proficiencies' : 
    fieldName == 'note' ? 'notes' :
    undefined;
  if(!arrayFieldName) throw Error (`Unknown array field  name: ${fieldName}`);
  const showForm = showSection.data[arrayFieldName];

  return (
    <div>
      <FormHeader
        anchorTag={arrayFieldName}
        formTitle={capitalize(fieldName)}
        onClick={() => showSection.setFunction({...emptyShowSectionData, [arrayFieldName]: !showSection.data[arrayFieldName]})}
        showForm={showForm}
      />
    
    {
      (showForm && description) &&
      <p className="update-form-description">{description}</p>
    }
    {
      showForm &&
      <ArrayItemForm
        fieldName={fieldName}
        handleChange={handleChange}
        handleSubmit={handleSubmit}
        formData={formData}
        setFormData={setFormData}
        defaultFormData={defaultFormData}
        useTextArea={useTextArea}
      />
    }
    </div>
  )
}

export default AddItemToArrayField;