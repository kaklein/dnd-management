import ArrayItemForm from "@components/updateForms/baseForms/ArrayItemForm";
import BaseDetailsForm from "@components/updateForms/baseForms/BaseDetailsForm";
import EquipmentForm from "@components/updateForms/baseForms/EquipmentForm";
import FeatureForm from "@components/updateForms/baseForms/FeatureForm";
import SpellForm from "@components/updateForms/baseForms/SpellForm";
import SummonableForm from "@components/updateForms/baseForms/SummonableForm";
import WeaponForm from "@components/updateForms/baseForms/WeaponForm";
import { capitalize } from "@components/utils";
import { emptyEditModalData } from "@data/emptyFormData";
import { PlayerCharacter } from "@models/playerCharacter/PlayerCharacter";
import { SentryLogger } from "@services/sentry/logger";
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
  ) => Promise<void>;
  setFormData: (data: any) => void;
  initialEditorContent?: string;
  handleCancel: () => void;
  pcData: PlayerCharacter;
  imageUrl?: string;
  logger: SentryLogger;
}

const checkRequiredContent = (formType: string, content?: string, imageUrl?: string) => {
  if (['spell', 'weapon', 'feature', 'equipment', 'summonable', 'note', 'character'].includes(formType)) {
    if (content == undefined) throw Error(formType + ' form is missing required initialEditorContent');
    return {
      content: content,
    };
  }
  if (['character'].includes(formType)) {
    if (imageUrl == undefined) throw Error(formType + ' form is missing required imageUrl');
  }
  return undefined;  
}

function EditModal ({ formType, formData, handleChange, handleSubmit, handleCancel, setFormData, initialEditorContent, pcData, imageUrl, logger}: Props) {
  const editorContent = checkRequiredContent(formType, initialEditorContent);
  
  let form: ReactNode;
  switch (formType) {
    case 'spell': {
      form = <SpellForm
        handleChange={handleChange}
        handleSubmit={handleSubmit}
        formData={formData}
        setFormData={setFormData}
        modalDismiss={true}
        initialEditorContent={editorContent!.content}
        pcData={pcData}
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
        initialEditorContent={editorContent!.content}
      />
      break;
    }
    case 'summonable': {
      form = <SummonableForm
        handleChange={handleChange}
        handleSubmit={handleSubmit}
        formData={formData}
        setFormData={setFormData}
        pcData={pcData}
        modalDismiss={true}
        initialEditorContent={editorContent!.content}
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
        initialEditorContent={editorContent!.content}
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
        initialEditorContent={editorContent!.content}
      />
      break;
    }
    case 'language':
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
    case 'note': {
      form = <ArrayItemForm
        fieldName={formData.formType}
        handleChange={handleChange}
        handleSubmit={handleSubmit}
        formData={formData}
        setFormData={setFormData}
        useTextArea={formData.useTextArea}
        initialEditorContent={editorContent!.content}
        defaultFormData={emptyEditModalData}
        modalDismiss={true}
      />
      break;
    }
    case 'character': {
      form = <BaseDetailsForm
        handleChange={handleChange}
        handleSubmit={handleSubmit}
        formData={formData}
        setFormData={setFormData}
        initialEditorContent={editorContent!.content}
        modalDismiss={true}
        existingPCImage={{
          path: pcData.baseDetails.imagePath ?? '',
          url: imageUrl!
        }}
        pcId={pcData.baseDetails.pcId}
        logger={logger}
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