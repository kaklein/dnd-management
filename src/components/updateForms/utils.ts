import { CreateCharacterFormData } from "@models/CreateCharacterFormData";
import { RequiredCharacterCreateFields } from "@models/enum/RequiredCharacterCreateFields";

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
}