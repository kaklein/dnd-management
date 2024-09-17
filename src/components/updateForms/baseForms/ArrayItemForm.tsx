import { capitalize } from "@components/utils";
import Button, { ButtonType } from "@components/Button";

interface Props {
  fieldName: string;
  handleChange: (event: any, setFunction: (prevFormData: any) => void) => void;
  handleSubmit: (
    event: any, 
    data: any, 
    clearForm: (data: any) => void,
    clearedFormData: any
  ) => void;
  formData: any;
  setFormData: (data: any) => void;
  defaultFormData: any;
  useTextArea?: boolean;
  modalDismiss?: boolean;
}

function ArrayItemForm ({fieldName, handleChange, handleSubmit, formData, setFormData, defaultFormData, useTextArea=false, modalDismiss=false}: Props) {
  return (
    <form onSubmit={(event) => {handleSubmit(event, formData, setFormData, defaultFormData)}}>
      <div className="update-form-field">
        <label className="update-form-label" htmlFor={fieldName}>{capitalize(fieldName)}</label>
        {
          !useTextArea &&
          <input
            className="update-form-input"
            type="text"
            id={fieldName}
            name={fieldName}
            onChange={(event) => {handleChange(event, setFormData)}}
            value={formData[fieldName]}
            required
          />
        }
        {
          useTextArea &&
          <textarea
            className="update-form-input"
            id={fieldName}
            name={fieldName}
            onChange={(event) => {handleChange(event, setFormData)}}
            value={formData[fieldName]}
            required
          />
        }
        
      </div>
      
      <Button
        text="Save"
        customClass="float-right"
        buttonType={ButtonType.INFO}
        type="submit"
        onClick={() => {}}
        modalDismiss={modalDismiss}
      />
    </form>
  )
}

export default ArrayItemForm;