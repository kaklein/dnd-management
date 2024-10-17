import { capitalize } from "@components/utils";
import Button, { ButtonType } from "@components/Button";
import { validateRequiredFields } from "../utils";
import TextEditor, { buildEditor } from "@components/TextEditor";

interface Props {
  fieldName: string;
  handleChange: (event: any, setFunction: (prevFormData: any) => void) => void;
  handleSubmit: (
    event: any, 
    data: any, 
    clearForm: (data: any) => void,
    clearedFormData: any
  ) => Promise<void>;
  formData: any;
  setFormData: (data: any) => void;
  defaultFormData: any;
  initialEditorContent?: string;
  useTextArea?: boolean;
  modalDismiss?: boolean;
}

function ArrayItemForm ({fieldName, handleChange, handleSubmit, formData, setFormData, defaultFormData, initialEditorContent, useTextArea=false, modalDismiss=false}: Props) {
  const editor = buildEditor(initialEditorContent ?? '', (value: string) => {
    handleChange({ target: { name: 'note', value: value }}, setFormData);
  });

  return (
    editor &&
    <form onSubmit={async (event) => {
      if (fieldName == 'note') {
        const { valid, errorMessage } = validateRequiredFields(['note'], formData);
        if (!valid) {
          event.preventDefault();
          alert(errorMessage);
          return;
        } else {
          await handleSubmit(event, formData, setFormData, defaultFormData);
          editor.commands.clearContent();
        }
      } else {
        handleSubmit(event, formData, setFormData, defaultFormData);
      }
    }}>
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
          <TextEditor
            editor={editor}
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