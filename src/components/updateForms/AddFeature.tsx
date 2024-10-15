import FormHeader from "./FormHeader";
import FeatureForm from "./baseForms/FeatureForm";
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
  initialEditorContent: string;
  setInitialEditorContent: (content: string) => void;
  showSection: {data: any, setFunction: (newValues: any) => void};
}

function AddFeature ({handleChange, handleSubmit, formData, setFormData, initialEditorContent, setInitialEditorContent, showSection}: Props) {
  const showForm = showSection.data.features;

  return (
    <div>
      <FormHeader
        anchorTag="features"
        formTitle="Feature"
        onClick={() => showSection.setFunction({...emptyShowSectionData, features: !showForm})}
        showForm={showForm}
      />
    
    {
      showForm &&
      <>
      <p className="update-form-description">
        Add any special features you have due to race, class, magical items, etc.
      </p>

      <FeatureForm
        handleChange={handleChange}
        handleSubmit={handleSubmit}
        formData={formData}
        setFormData={setFormData}
        initialEditorContent={initialEditorContent}
        setInitialEditorContent={setInitialEditorContent}
      />
      </>
    }
    </div>
  )
}

export default AddFeature;