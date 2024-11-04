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
  formData: any,
  requiredArrayFields?: string[] | undefined,
): { valid: boolean, errorMessage?: string } => {
  let missingFields: string[] = [];
  for (const field of requiredFields) {
    const value = field.split('.').reduce((prev, cur) => prev[cur], formData);

    if (!value || value == '' || value == emptyRichTextContent) {
      missingFields.push(field);
    };
  };

  if (requiredArrayFields) {
    let splitField;
    let arr;
    let fieldName;
    for (const field of requiredArrayFields) {
      splitField = field.split('.');
      arr = formData[splitField[0]];
      fieldName = splitField[1];
      for (const i of arr) {
        if (!i[fieldName] || i[fieldName] == '' || i[fieldName] == emptyRichTextContent) {
          missingFields.push(field);
          break;
        }
      }
    }
  }

  if (missingFields.length > 0) {
    const message = 'Please fill out required field(s): ' + missingFields;
    return { valid: false, errorMessage: message }
  } else {
    return { valid: true }
  }
}

export const getFileSizeDisplay = (fileSizeBytes: number): string => {
  if (fileSizeBytes > 1000000) {
    return `${(fileSizeBytes / 1000000).toFixed(2)}MB`;
  } else {
    return `${(fileSizeBytes / 1000).toFixed(2)}KB`;
  }
}