import Card from "@components/cards/Card";
import Navbar from "@components/Navbar";
import { BaseDetails, PlayerCharacter } from "@models/playerCharacter/PlayerCharacter";
import { useState } from "react";
import AddWeapon from "@components/updateForms/AddWeapon";
import AddSpell from "@components/updateForms/AddSpell";
import UpdateSpellSlot from "@components/updateForms/UpdateSpellSlot";
import AddFeature from "@components/updateForms/AddFeature";
import AddItemToArrayField from "@components/updateForms/AddItemToArrayField";
import UpdatePC from "@components/updateForms/UpdatePC";
import AddEquipment from "@components/updateForms/AddEquipment";
import { buildDefaultPCFormData, defaultEquipmentFormData, defaultFeatureFormData, defaultLanguageFormData, defaultNoteFormData, defaultProficiencyFormData, defaultSpellFormData, defaultSpellSlotFormData, defaultWeaponFormData } from "@data/emptyFormData";
import { UpdateType } from "@models/enum/service/UpdateType";
import { transformAndUpdate } from "@services/firestore/updateData";
import { QueryClient } from "@tanstack/react-query";
import PageHeaderBarPC from "@components/headerBars/PageHeaderBarPC";
import { useSearchParams } from "react-router-dom";
import QuickNav from "@components/QuickNav";
import { triggerSuccessAlert } from "@pages/utils";
import SuccessAlert from "@components/alerts/SuccessAlert";
import { UserRole } from "@services/firestore/enum/UserRole";

interface Props {
  pcData: PlayerCharacter;
  queryClient: QueryClient;
  pcList: BaseDetails[];
  selectedPc: {pcId: string | null, setSelectedPcId: (pcId: string) => void};
  userRole: UserRole | undefined;
}

function Update ({pcData, queryClient, pcList, selectedPc, userRole}: Props) {
  const [searchParams] = useSearchParams();
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);

  // Form Data
  const [weaponFormData, setWeaponFormData] = useState(defaultWeaponFormData);
  const [spellFormData, setSpellFormData] = useState(defaultSpellFormData);
  const [spellSlotFormData, setSpellSlotFormData] = useState(defaultSpellSlotFormData);
  const [featureFormData, setFeatureFormData] = useState(defaultFeatureFormData);
  const [equipmentFormData, setEquipmentFormData] = useState(defaultEquipmentFormData);
  const [proficiencyFormData, setProficiencyFormData] = useState(defaultProficiencyFormData);
  const [languageFormData, setLanguageFormData] = useState(defaultLanguageFormData);
  const [noteFormData, setNoteFormData] = useState(defaultNoteFormData);
  const [pcFormData, setPcFormData] = useState(buildDefaultPCFormData(pcData));

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>, 
    setFunction: (prevFormData: any) => void
  ) => {
    const { name, value } = event.target;
    setFunction((prevFormData: any) => ({...prevFormData, [name]: value}));
  };

  const handleSubmit = async (
    event: React.ChangeEvent<HTMLInputElement>, 
    data: {updateType: UpdateType, [key: string]: any},
    clearForm: (data: any) => void,
    clearedFormData: any
  ) => {
    event.preventDefault();
    try{
      await transformAndUpdate(pcData, data);
    } catch (e) {
      console.error(e);
      alert (`Update failed. Please refresh the page and try again.`);
      return;
    }
    clearForm(clearedFormData);
    queryClient.invalidateQueries();
    triggerSuccessAlert(setShowSuccessAlert);
  }

  return (
    <>
    <div className="main-body">
      <Navbar isSelectedPc={!!selectedPc.pcId} userRole={userRole}/>

      {
        searchParams.get("created") === "true" &&
        <div className="pop-up">
          <h4>Successfully created {pcData.baseDetails.name.firstName} {pcData.baseDetails.name.lastName}!</h4>
          <div>
            <b>You're almost done! To complete your character, use the forms below to add weapons, spell slots, spells, equipment, and more.</b>
            <br/>
            You can come back to this page at any time to add new items and update your character base stats.
          </div>
        </div>
      }
            
      <PageHeaderBarPC 
          pcName={`${pcData.baseDetails.name.firstName} ${pcData.baseDetails.name.lastName}`}
          pageName="Add Items and Make Updates"
          pcList={pcList}
          selectedPc={selectedPc}
      />

      <hr/>
      
      {showSuccessAlert && <SuccessAlert/>}
      
      <Card>
        <AddWeapon
          handleChange={handleChange}
          handleSubmit={handleSubmit}
          formData={weaponFormData}
          setFormData={setWeaponFormData}
        />
      </Card>
      
      <Card>
        <UpdateSpellSlot
          handleChange={handleChange}
          handleSubmit={handleSubmit}
          formData={spellSlotFormData}
          setFormData={setSpellSlotFormData}
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
        <AddFeature
          handleChange={handleChange}
          handleSubmit={handleSubmit}
          formData={featureFormData}
          setFormData={setFeatureFormData}
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

      <Card>
        <AddItemToArrayField
          fieldName="proficiency"
          handleChange={handleChange}
          handleSubmit={handleSubmit}
          formData={proficiencyFormData}
          setFormData={setProficiencyFormData}
          defaultFormData={defaultProficiencyFormData}
        />
      </Card>

      <Card>
        <AddItemToArrayField
          fieldName="language"
          handleChange={handleChange}
          handleSubmit={handleSubmit}
          formData={languageFormData}
          setFormData={setLanguageFormData}
          defaultFormData={defaultLanguageFormData}
        />
      </Card>

      <Card>
        <AddItemToArrayField
          fieldName="note"
          description="Add a miscellaneous note or fact about your character that you want to be able to easily reference. Notes are displayed at the bottom of the Details page."
          handleChange={handleChange}
          handleSubmit={handleSubmit}
          formData={noteFormData}
          setFormData={setNoteFormData}
          defaultFormData={defaultNoteFormData}
          useTextArea={true}
        />
      </Card>

      <Card>
        <UpdatePC
          pcData={pcData}
          handleChange={handleChange}
          handleSubmit={handleSubmit}
          formData={pcFormData}
          setFormData={setPcFormData}
        />
      </Card>
      
    </div>
    <QuickNav/>
    </>
  )
}

export default Update;