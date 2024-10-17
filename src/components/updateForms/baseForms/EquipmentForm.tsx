import { defaultEquipmentFormData } from "@data/emptyFormData";
import Button, { ButtonType } from "@components/Button";
import TextEditor, { buildEditor } from "@components/TextEditor";

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
  modalDismiss?: boolean;
}

function EquipmentForm ({handleChange, handleSubmit, formData, setFormData, initialEditorContent, modalDismiss=false}: Props) { 
  const editor = buildEditor(initialEditorContent, (value: string) => {
    handleChange({ target: { name: 'description', value: value }}, setFormData);
  });
  
  return (
    editor &&
    <form onSubmit={async (event) => {
      await handleSubmit(event, formData, setFormData, defaultEquipmentFormData);
      editor.commands.clearContent();
    }}>
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
        <TextEditor
          editor={editor}
        />
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

export default EquipmentForm;