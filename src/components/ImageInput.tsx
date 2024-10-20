import { useState } from "react";
import Button, { ButtonType } from "./Button";
import { getFileSizeDisplay } from "./updateForms/utils";
import { FileNameUtil } from "@services/firebaseStorage/util";

interface Props {
  maxFileSizeMB?: number;
  formData: {
    data: any;
    set: (data: any) => void;
  };
  setImageUploadElement: (element: HTMLInputElement) => void;
  fileNameUtil: FileNameUtil;
  existingImagePath?: string;
  required?: boolean;
}

function ImageInput ({maxFileSizeMB=1, formData, setImageUploadElement, fileNameUtil, existingImagePath, required=false}: Props) {
  const [fileSize, setFileSize] = useState(0);
  const [isValidFileSize, setIsValidFileSize] = useState(true);
  const [deleteImage, setDeleteImage] = useState(false);
  
  return (
    <div className="update-form-field">
      <label className="update-form-label" htmlFor="characterImage">Character Image{!required && ' (Optional)'}</label>
      {
        existingImagePath &&
        <div>
          <p className="update-form-description" style={{fontStyle: "normal"}}>Existing image: {existingImagePath}</p>
          {
            deleteImage &&
            <p className="alert-text-warning">&#10003; Image will be deleted on Save.</p>
          }
          <Button text={deleteImage ? "Cancel Delete" : "Delete Existing Image"} buttonType={deleteImage ? ButtonType.SECONDARY : ButtonType.DANGER} onClick={() => {
            const newDeleteImage = !deleteImage;
            setDeleteImage(newDeleteImage);
            formData.set({...formData.data, imagePath: newDeleteImage ? '' : existingImagePath});
            (document.getElementById("uploadFile") as HTMLInputElement).value = "";
            setFileSize(0);
            setIsValidFileSize(true);            
          }}/>
        </div>
      }
      <p className="update-form-description">Allowed file types: JPEG, PNG. Max file size: 1MB</p>

      <input id="uploadFile" type="file" accept="image/jpeg, image/png" disabled={deleteImage} onChange={(event) => {
        if (event.target.files?.[0]) {
          if (event.target.files[0].size > 1000000) {
            // Invalid size
            setFileSize(event.target.files[0].size);
            setIsValidFileSize(false);
            formData.set({...formData.data, imagePath: ''});
            alert('File size ' + getFileSizeDisplay(event.target.files[0].size) + ' exceeds max size of 1MB. Please upload a smaller file.');
          } else {
            // Valid size
            setFileSize(event.target.files[0].size);
            setIsValidFileSize(true);
            setImageUploadElement(document.getElementById("uploadFile") as HTMLInputElement);
            formData.set({...formData.data, imagePath: fileNameUtil.generateFileNameCheckDuplicates(event.target.files[0].name, false, existingImagePath)});
          }
        } else {
          // Reset
          setFileSize(0);
          setIsValidFileSize(true);
          formData.set({...formData.data, imagePath: ''});
        }
      }}/>
      {
        (fileSize > 0 && isValidFileSize) &&
        <p className="alert-text-ok">&#10003; {getFileSizeDisplay(fileSize)}</p>
      }
      {
        (fileSize > 0 && !isValidFileSize) &&
        <p className="alert-text-warning">&#9888; {getFileSizeDisplay(fileSize)} - Exceeds {maxFileSizeMB}MB limit</p>
      }
      {
        fileSize > 0 &&
        <Button text="Remove Selected File" buttonType={ButtonType.SECONDARY} onClick={() => {
          (document.getElementById("uploadFile") as HTMLInputElement).value = "";
          setFileSize(0);
          setIsValidFileSize(true);
        }}/>
      }
    </div>
  )
}

export default ImageInput;