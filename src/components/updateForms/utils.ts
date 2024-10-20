import { capitalize } from "@components/utils";
import { CreateCharacterFormData } from "@models/CreateCharacterFormData";
import { RequiredCharacterCreateFields } from "@models/enum/RequiredCharacterCreateFields";
import { emptyRichTextContent } from "@pages/utils";

export const isFormDataValid = (formData: CreateCharacterFormData): {
  isValid: boolean,
  missingFields: string[]
} => {
  let isValid = true;
  const entries = Object.entries(formData);
  const requiredFields = Object.keys(RequiredCharacterCreateFields);
  let missingFields: string[] = [];
  for (const entry of entries) {
    if(requiredFields.includes(entry[0]) && entry[1] === "") {
      missingFields.push(RequiredCharacterCreateFields[entry[0] as keyof typeof RequiredCharacterCreateFields])
      isValid = false;
    }
  }

  return {
    isValid,
    missingFields
  };
};

export const validateRequiredFields = (
  requiredFields: string[],
  formData: any
): { valid: boolean, errorMessage?: string } => {
  let missingFields: string[] = [];
  for (const field of requiredFields) {
    if (!formData[field] || formData[field] == '' || formData[field] == emptyRichTextContent) {
      missingFields.push(field);
    };
  };
  if (missingFields.length > 0) {
    const message = 'Please fill out required field(s): ' + missingFields.map(f => capitalize(f));
    return { valid: false, errorMessage: message }
  } else {
    return { valid: true }
  }
}

export const getFileSizeDisplay = (fileSizeBytes: number): string => {
  if (fileSizeBytes > 1000000) {
    return `${(fileSizeBytes / 1000000).toPrecision(4)}MB`;
  } else {
    return `${(fileSizeBytes / 1000).toPrecision(4)}KB`;
  }
}