import Button, { ButtonType } from "@components/Button";
import Card from "@components/cards/Card";
import PageHeaderBarThreeColumn from "@components/headerBars/PageHeaderBarThreeColumn";
import Navbar from "@components/Navbar";
import CreateCharacterForm from "@components/updateForms/CreateCharacterForm";
import { isFormDataValid } from "@components/updateForms/utils";
import { defaultCreateCharacterFormData } from "@data/emptyFormData";
import { getAuth } from "@firebase/auth";
import { emptyRichTextContent } from "@pages/utils";
import { createCharacter } from "@services/firestore/createCharacter";
import { UserRole } from "@services/firestore/enum/UserRole";
import { logError } from "@services/sentry/logger";
import { QueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

interface Props {
  queryClient: QueryClient;
  setSelectedPcId: (pcId: string) => void;
  userRole: UserRole | undefined;
}

function CreateCharacter ({queryClient, setSelectedPcId, userRole}: Props) {
  const navigate = useNavigate();

  const [formData, setFormData] = useState(defaultCreateCharacterFormData);
  const initialEditorContent = emptyRichTextContent;

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>, 
    setFunction: (prevFormData: any) => void
  ) => {
    const { name, value } = event.target;
    setFunction((prevFormData: any) => ({...prevFormData, [name]: value}));
  };

  const handleSubmit = async (
    event: React.ChangeEvent<HTMLInputElement>, 
    formData: any,
    generatedPcId: string
  ) => {
    event.preventDefault();
    const validation = isFormDataValid(formData);
    if(!validation.isValid) {
      console.error('Invalid form data');
      alert(`Missing the following fields: ${JSON.stringify(validation.missingFields)}. Please fill out all required fields before submitting.`);
      return;
    }
    const uid = getAuth().currentUser!.uid;
    try {
      await createCharacter(uid, generatedPcId, formData);
      queryClient.refetchQueries({ queryKey: ['pcData', generatedPcId]});
      setSelectedPcId(generatedPcId);
      navigate('/add?created=true');
    } catch (e: any) {
      logError({error: e, formData});
      alert('Error creating character. Please make sure you filled out all fields correctly before submitting, or refresh the page and try again.');
    }
  }


  return (
    <div>
      <Navbar isSelectedPc={false} userRole={userRole}/>

      <PageHeaderBarThreeColumn
        contentRight={
          <Button
            buttonType={ButtonType.DANGER}
            text="Cancel"
            onClick={() => navigate('/')}
          />
        }
        pageName="Create Character"
      />

      <Card>
        <CreateCharacterForm
          handleChange={handleChange}
          handleSubmit={handleSubmit}
          formData={formData}
          setFormData={setFormData}
          initialEditorContent={initialEditorContent}
        />
      </Card>
    </div>
    
  )
}

export default CreateCharacter;