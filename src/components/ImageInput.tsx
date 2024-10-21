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
  existingImageUrl?: string;
  required?: boolean;
}

function ImageInput ({maxFileSizeMB=1, formData, setImageUploadElement, fileNameUtil, existingImagePath, existingImageUrl, required=false}: Props) {
  const [fileSize, setFileSize] = useState(0);
  const [isValidFileSize, setIsValidFileSize] = useState(true);
  const [deleteImage, setDeleteImage] = useState(false);
  
  return (
    <div className="update-form-field">
      <label className="update-form-label" htmlFor="uploadFile">Character Image{!required && ' (Optional)'}</label>

      {
        existingImagePath &&
        <div className="center">
          <div className={`update-form-field-group ${(document.getElementById("uploadFile") as HTMLInputElement)?.value != "" ? 'disabled' : ''}`}>
            <p className="update-form-description center" style={{fontStyle: "normal"}}><b>Existing Image</b> {existingImagePath}</p>
            {
              existingImageUrl &&
              <div className="pc-image-container-preview">
                <img src={existingImageUrl} id="pc-image-display" className="card-img-top" alt={existingImagePath}/>
              </div>
            }
            {
              deleteImage &&
              <p className="alert-text-warning center">&#10003; Image will be deleted on Save.</p>
            }
            <Button
              text={deleteImage ? "Cancel Delete" : "Delete Existing Image"}
              buttonType={deleteImage ? ButtonType.SECONDARY : ButtonType.DANGER}
              customClass="button-center"
              onClick={() => {
                const newDeleteImage = !deleteImage;
                setDeleteImage(newDeleteImage);
                formData.set({...formData.data, imagePath: newDeleteImage ? '' : existingImagePath});
                (document.getElementById("uploadFile") as HTMLInputElement).value = "";
                setFileSize(0);
                setIsValidFileSize(true);            
              }}
              disabled={(document.getElementById("uploadFile") as HTMLInputElement)?.value != ""}
            />
          </div>          
        </div>
      }
      <div className="center">
        <div className={`update-form-field-group ${deleteImage ? 'disabled' : ''}`}>
          <p className="center"><b>Upload New Image</b></p>
          <p className="update-form-description dark-purple">&#9432; Allowed file types: JPEG, PNG. Max file size: 1MB</p>
          <br/>
          <input className="update-form-input update-form-input-wide center" id="uploadFile" type="file" accept="image/jpeg, image/png" disabled={deleteImage} onChange={(event) => {
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
          <br/>
          {
            (fileSize > 0 && isValidFileSize) &&
            <div>
              <p className="alert-text-ok center">&#10003; {getFileSizeDisplay(fileSize)} - Ready for upload</p>
              {
                existingImagePath &&
                <p className="alert-text-ok alert-text-description center">This will replace the existing image.</p>
              }
            </div>
          }
          {
            (fileSize > 0 && !isValidFileSize) &&
            <div>
              <p className="alert-text-warning center">&#9888; {getFileSizeDisplay(fileSize)} - Exceeds {maxFileSizeMB}MB limit</p>
              <p className="alert-text-warning alert-text-description center">File will not be uploaded. Please choose another file.</p>
            </div>
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
      </div>      
    </div>
  )
}

export default ImageInput;