import { defaultEquipmentFormData } from "@data/emptyFormData";
import Button, { ButtonType } from "@components/Button";

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
  modalDismiss?: boolean;
}

function EquipmentForm ({handleChange, handleSubmit, formData, setFormData, modalDismiss=false}: Props) { 
  return (
    <form onSubmit={(event) => {handleSubmit(event, formData, setFormData, defaultEquipmentFormData)}}>
      <div className="update-form-field">
        <label className="update-form-label" htmlFor="type">Name</label>
        <input
          className="update-form-input"
          type="text"
          id="type"
          name="type"
          onChange={(event) => {handleChange(event, setFormData)}}
          value={formData.type}
          required
        />
      </div>
      <div className="update-form-field">
        <label className="update-form-label" htmlFor="description">Description (Optional)</label>
        <textarea
          className="update-form-input"
          id="description"
          name="description"
          onChange={(event) => {handleChange(event, setFormData)}}
          value={formData.description}
        />
      </div>
        
      <Button
        text="Save"
        buttonType={ButtonType.INFO}
        type="submit"
        onClick={() => {}}
        modalDismiss={modalDismiss}
      />      
      </form>
  )
}

export default EquipmentForm;