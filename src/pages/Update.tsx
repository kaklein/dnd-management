import Card from "@components/cards/Card";
import Footer from "@components/Footer";
import Navbar from "@components/Navbar";
import PageHeaderBar from "@components/PageHeaderBar";
import { PlayerCharacter } from "@models/playerCharacter/PlayerCharacter";
import { useState } from "react";
import AddWeapon from "@components/updateForms/AddWeapon";
import AddSpell from "@components/updateForms/AddSpell";
import AddSpellSlot from "@components/updateForms/AddSpellSlot";
import AddFeature from "@components/updateForms/AddFeature";
import AddItemToArrayField from "@components/updateForms/AddItemToArrayField";
import UpdatePC from "@components/updateForms/UpdatePC";
import AddEquipment from "@components/updateForms/AddEquipment";
import { defaultEquipmentFormData, defaultFeatureFormData, defaultSpellFormData, defaultSpellSlotFormData, defaultWeaponFormData } from "@data/emptyFormData";
import { UpdateType } from "@models/enum/service/UpdateType";
import { transformAndUpdate } from "@services/firestore/updateData";
import { QueryClient } from "@tanstack/react-query";
import Alert from "@components/Alert";

interface Props {
  pcData: PlayerCharacter;
  queryClient: QueryClient;
}

function Update ({pcData, queryClient}: Props) {
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const triggerSuccessAlert = () => {
      setShowSuccessAlert(true);
      setTimeout(() => {
          setShowSuccessAlert(false);
      }, 2000);
  };

  // Form Data
  const [weaponFormData, setWeaponFormData] = useState(defaultWeaponFormData);
  const [spellFormData, setSpellFormData] = useState(defaultSpellFormData);
  const [spellSlotFormData, setSpellSlotFormData] = useState(defaultSpellSlotFormData);
  const [featureFormData, setFeatureFormData] = useState(defaultFeatureFormData);
  const [equipmentFormData, setEquipmentFormData] = useState(defaultEquipmentFormData);
  const [proficiencyFormData, setProficiencyFormData] = useState({ 
    updateType: UpdateType.PROFICIENCIES, proficiency: ''
  });
  const [languageFormData, setLanguageFormData] = useState({ 
    updateType: UpdateType.LANGUAGES, language: ''
  });
  const [pcFormData, setPcFormData] = useState({
    updateType: UpdateType.BASE_DETAILS,
    level: pcData.baseDetails.level,
    armorClass: pcData.baseDetails.armorClass,
    hitPointMaximum: pcData.baseDetails.usableResources.hitPoints.max,
    hitDice: pcData.baseDetails.usableResources.hitDice.max,
    proficiencyBonus: pcData.baseDetails.proficiencyBonus
  });

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>, setFunction: (prevFormData: any) => void) => {
    const { name, value } = event.target;
    setFunction((prevFormData: any) => ({...prevFormData, [name]: value}));
  };

  const handleSubmit = async (event: React.ChangeEvent<HTMLInputElement>, data: any) => {
    event.preventDefault();
    console.log('Submitting data: ' + JSON.stringify(data));
    await transformAndUpdate(pcData.baseDetails.pcId, data);
    queryClient.invalidateQueries();
    triggerSuccessAlert();
  }

  return (
    <>
      <Navbar/>
            
      <PageHeaderBar 
          pcName={`${pcData.baseDetails.name.firstName} ${pcData.baseDetails.name.lastName}`}
          pageName="Add Items and Make Updates"
      />

      <hr/>

      <h3>Add Items</h3>
      {showSuccessAlert && <Alert alertText="Save successful." className="successful-alert" iconFile="/images/icons/success-icon.png"/>}

      <Card>
        <AddWeapon
          handleChange={handleChange}
          handleSubmit={handleSubmit}
          formData={weaponFormData}
          setFormData={setWeaponFormData}
        />
      </Card>

      <Card>
        <AddSpell
          handleChange={handleChange}
          handleSubmit={handleSubmit}
          formData={spellFormData}
          setFormData={setSpellFormData}
        />
      </Card>

      <Card>
      <AddSpellSlot
          handleChange={handleChange}
          handleSubmit={handleSubmit}
          formData={spellSlotFormData}
          setFormData={setSpellSlotFormData}
        />
      </Card>

      <Card>
        <AddFeature
            handleChange={handleChange}
            handleSubmit={handleSubmit}
            formData={featureFormData}
            setFormData={setFeatureFormData}
        />
      </Card>

      <Card>
        <AddItemToArrayField
            fieldName="proficiency"
            handleChange={handleChange}
            handleSubmit={handleSubmit}
            formData={proficiencyFormData}
            setFormData={setProficiencyFormData}
        />
      </Card>

      <Card>
        <AddItemToArrayField
            fieldName="language"
            handleChange={handleChange}
            handleSubmit={handleSubmit}
            formData={languageFormData}
            setFormData={setLanguageFormData}
        />
      </Card>

      <Card>
        <AddEquipment
            handleChange={handleChange}
            handleSubmit={handleSubmit}
            formData={equipmentFormData}
            setFormData={setEquipmentFormData}
        />
      </Card>

      <hr/>

      <h3>Update Character</h3>

      <Card>
        <UpdatePC
          pcData={pcData}
          handleChange={handleChange}
          handleSubmit={handleSubmit}
          formData={pcFormData}
          setFormData={setPcFormData}
        />
      </Card>
      

      <Footer/>
    </>
  )
}

export default Update;