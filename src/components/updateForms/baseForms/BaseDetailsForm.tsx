import Button, { ButtonType } from "@components/Button";
import FormSelect from "@components/FormSelect";
import ImageInput from "@components/ImageInput";
import TextEditor, { buildEditor } from "@components/TextEditor";
import { Alignment } from "@models/enum/Alignment";
import { HitDiceType } from "@models/enum/HitDiceType";
import { deleteImage } from "@services/firebaseStorage/delete";
import { FileNameUtil } from "@services/firebaseStorage/util";
import { uploadImage } from "@services/firebaseStorage/write";
import { useState } from "react";

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
  existingPCImage: {
    path: string;
    url: string;
  };
  pcId: string;
}

function BaseDetailsForm ({handleChange, handleSubmit, formData, setFormData, initialEditorContent, modalDismiss, existingPCImage, pcId}: Props) {
  const editor = buildEditor(initialEditorContent, (value: string) => {
    handleChange({ target: { name: 'description', value: value }}, setFormData);
  });
  const [imageUploadElement, setImageUploadElement] = useState(document.getElementById("uploadFile") as HTMLInputElement);
  const fileNameUtil = new FileNameUtil(pcId);

  return (
    editor &&
    <form onSubmit={async (event) => {
      event.preventDefault();
      if (formData.imagePath && formData.imagePath !== existingPCImage.path) {
        // Add new image to bucket and update path in pc data
        try {
          await uploadImage(imageUploadElement, fileNameUtil, existingPCImage.path);
          await handleSubmit(event, formData, setFormData, formData);
          if (existingPCImage.path) {
            // Delete old image, if applicable
            await deleteImage(existingPCImage.path, fileNameUtil);
          }
          editor.commands.clearContent();
        } catch (e: any) {
          console.error(e);
          alert ('Sorry, an error occurred saving your changes. Please refresh the page and try again.');
        }
      } else if (existingPCImage.path && !formData.imagePath) {
        // Delete old photo
        try {
          await deleteImage(existingPCImage.path, fileNameUtil);
          await handleSubmit(event, formData, setFormData, formData);
          editor.commands.clearContent();
        } catch (e: any) {
          console.error(e);
          alert ('Sorry, an error occurred saving your changes. Please refresh the page and try again.');
        }
      } else {
        await handleSubmit(event, formData, setFormData, {});
        editor.commands.clearContent();
      }
    }}>
      <div className="update-form-field">
        <label className="update-form-label" htmlFor="firstName">First Name</label>
        <input
          className="update-form-input"
          type="text"          
          id="firstName"
          name="firstName"
          onChange={(event) => {handleChange(event, setFormData)}}
          value={formData.firstName}
          required
        />
      </div>
      <div className="update-form-field">
        <label className="update-form-label" htmlFor="lastName">Last Name</label>
        <input
          className="update-form-input"
          type="text"          
          id="lastName"
          name="lastName"
          onChange={(event) => {handleChange(event, setFormData)}}
          value={formData.lastName}
          required
        />
      </div>
      <div className="update-form-field">
        <label className="update-form-label" htmlFor="level">Level</label>
        <input
          className="update-form-input"
          type="number"
          min="1"
          max="20"
          id="level"
          name="level"
          onChange={(event) => {handleChange(event, setFormData)}}
          value={formData.level}
          required
        />
      </div>
      <div className="update-form-field">
        <label className="update-form-label" htmlFor="xp">XP (Optional)</label>
        <input
          className="update-form-input"
          type="number"
          min="0"
          max="999999"
          id="xp"
          name="xp"
          onChange={(event) => {handleChange(event, setFormData)}}
          value={formData.xp}
        />
      </div>
      <div className="update-form-field">
        <label className="update-form-label" htmlFor="maxHP">Max Hit Points</label>
        <input
          className="update-form-input"
          type="number"
          min="1"
          max="999"
          id="maxHP"
          name="maxHP"
          onChange={(event) => {handleChange(event, setFormData)}}
          value={formData.maxHP}
          required
        />
      </div>
      <div className="update-form-field">
        <label className="update-form-label" htmlFor="description">Description (Optional)</label>
        <TextEditor
          editor={editor}
        />
      </div>
      <ImageInput
        maxFileSizeMB={1}
        formData={{
          data: formData,
          set: setFormData
        }}
        fileNameUtil={fileNameUtil}
        existingImagePath={existingPCImage.path}
        existingImageUrl={existingPCImage.url}
        setImageUploadElement={setImageUploadElement}
      />
      <div className="update-form-field">
        <label className="update-form-label" htmlFor="class">Class</label>
        <input
          className="update-form-input"
          type="text"
          id="class"
          name="class"
          onChange={(event) => {handleChange(event, setFormData)}}
          value={formData.class}
          required
        />
      </div>
      <div className="update-form-field">
        <label className="update-form-label" htmlFor="hitDiceType">Hit Dice Type</label>
        <FormSelect
          className="update-form-input"
          value={formData.hitDiceType}
          handleChange={handleChange}
          setFormData={setFormData}
          name="hitDiceType"
          options={
            Object.values(HitDiceType).map((option) => ({
              text: option,
              value: option
            }))
          }
          required
        />              
      </div>
      <div className="update-form-field">
        <label className="update-form-label" htmlFor="subclass">Subclass (Optional)</label>
        <input
          className="update-form-input"
          type="text"
          id="subclass"
          name="subclass"
          onChange={(event) => {handleChange(event, setFormData)}}
          value={formData.subclass}
        />
      </div>
      <div className="update-form-field">
        <label className="update-form-label" htmlFor="race">Race</label>
        <input
          className="update-form-input"
          type="text"
          id="race"
          name="race"
          onChange={(event) => {handleChange(event, setFormData)}}
          value={formData.race}
          required
        />
      </div>
      <div className="update-form-field">
        <label className="update-form-label" htmlFor="speed">Speed</label>
        <input
          className="update-form-input"
          type="number"
          min="0"
          max="99"
          id="speed"
          name="speed"
          onChange={(event) => {handleChange(event, setFormData)}}
          value={formData.speed}
          required
        />
      </div>
      <div className="update-form-field">
        <label className="update-form-label" htmlFor="background">Background</label>
        <input
          className="update-form-input"
          type="text"
          id="background"
          name="background"
          onChange={(event) => {handleChange(event, setFormData)}}
          value={formData.background}
          required
        />
      </div>
      <div className="update-form-field">
        <label className="update-form-label" htmlFor="alignment">Alignment</label>
        <FormSelect
          className="update-form-input"
          value={formData.alignment}
          handleChange={handleChange}
          setFormData={setFormData}
          name="alignment"
          options={
            Object.values(Alignment).map((option) => ({
              text: option.toUpperCase(),
              value: option
            }))
          }
          required
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

export default BaseDetailsForm;