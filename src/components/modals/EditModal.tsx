import ArrayItemForm from "@components/updateForms/baseForms/ArrayItemForm";
import EquipmentForm from "@components/updateForms/baseForms/EquipmentForm";
import FeatureForm from "@components/updateForms/baseForms/FeatureForm";
import SpellForm from "@components/updateForms/baseForms/SpellForm";
import WeaponForm from "@components/updateForms/baseForms/WeaponForm";
import { capitalize } from "@components/utils";
import { emptyEditModalData } from "@data/emptyFormData";
import { ReactNode } from "react";

interface Props {
  formType: string;
  formData: any;
  handleChange: (event: any, setFunction: (prevFormData: any) => void) => void;
  handleSubmit: (
    event: any, 
    data: any, 
    clearForm: (data: any) => void,
    clearedFormData: any
  ) => void;
  setFormData: (data: any) => void;
  handleCancel: () => void;
}

function EditModal ({ formType, formData, handleChange, handleSubmit, handleCancel, setFormData}: Props) {
  let form: ReactNode;
  switch (formType) {
    case 'spell': {
      form = <SpellForm
        handleChange={handleChange}
        handleSubmit={handleSubmit}
        formData={formData}
        setFormData={setFormData}
        modalDismiss={true}
      />
      break;
    }
    case 'feature': {
      form = <FeatureForm
        handleChange={handleChange}
        handleSubmit={handleSubmit}
        formData={formData}
        setFormData={setFormData}
        modalDismiss={true}
      />
      break;
    }
    case 'weapon': {
      form = <WeaponForm
        handleChange={handleChange}
        handleSubmit={handleSubmit}
        formData={formData}
        setFormData={setFormData}
        modalDismiss={true}
      />
      break;
    }
    case 'equipment': {
      form = <EquipmentForm
        handleChange={handleChange}
        handleSubmit={handleSubmit}
        formData={formData}
        setFormData={setFormData}
        modalDismiss={true}
      />
      break;
    }
    case 'language':
    case 'note':
    case 'proficiency': {
      form = <ArrayItemForm
        fieldName={formData.formType}
        handleChange={handleChange}
        handleSubmit={handleSubmit}
        formData={formData}
        setFormData={setFormData}
        useTextArea={formData.useTextArea}
        defaultFormData={emptyEditModalData}
        modalDismiss={true}
      />
      break;
    }
    default: {
      form = <div/>
      break;
    }
  }
  
  return (
    <div className="modal fade" id="editModal" tabIndex={-1} aria-labelledby="editModalLabel" aria-hidden="true">
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h1 className="modal-title fs-5" id="editModalLabel">Edit {`${capitalize(formType)}: ${formData.displayName}`}</h1>
            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div className="modal-body">
            {form}
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={handleCancel} data-bs-dismiss="modal">Cancel</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default EditModal;