import Button, { ButtonType } from "@components/Button";
import Card from "@components/cards/Card";
import PageHeaderBar from "@components/headerBars/PageHeaderBar";
import Navbar from "@components/Navbar";
import CreateCharacterForm from "@components/updateForms/CreateCharacterForm";
import { defaultCreateCharacterFormData } from "@data/emptyFormData";
import { getAuth } from "@firebase/auth";
import { createCharacter } from "@services/firestore/createCharacter";
import { QueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";

interface Props {
  queryClient: QueryClient;
  setSelectedPcId: (pcId: string) => void;
}

function CreateCharacter ({queryClient, setSelectedPcId}: Props) {
  const navigate = useNavigate();

  const [formData, setFormData] = useState(defaultCreateCharacterFormData);

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>, 
    setFunction: (prevFormData: any) => void
  ) => {
    const { name, value } = event.target;
    setFunction((prevFormData: any) => ({...prevFormData, [name]: value}));
  };

  const handleSubmit = async (
    event: React.ChangeEvent<HTMLInputElement>, 
    formData: any
  ) => {
    event.preventDefault();
    const pcId = uuidv4();
    const uid = getAuth().currentUser!.uid;
    await createCharacter(uid, pcId, formData);
    queryClient.invalidateQueries();
    setSelectedPcId(pcId);
    navigate('/update?created=true');
  }


  return (
    <div>
      <Navbar isSelectedPc={false}/>

      <PageHeaderBar pageName="Create Character"/>
      <Button buttonType={ButtonType.DANGER} text="Exit Character Creation" onClick={() => navigate('/')}/>

      <Card>
        <CreateCharacterForm
          handleChange={handleChange}
          handleSubmit={handleSubmit}
          formData={formData}
          setFormData={setFormData}
        />
      </Card>
    </div>
    
  )
}

export default CreateCharacter;