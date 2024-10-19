import Card from "@components/cards/Card";
import Navbar from "@components/Navbar";
import { BaseDetails, PlayerCharacter } from "@models/playerCharacter/PlayerCharacter";
import { useState } from "react";
import AddWeapon from "@components/updateForms/AddWeapon";
import AddSpell from "@components/updateForms/AddSpell";
import UpdateSpellSlot from "@components/updateForms/UpdateSpellSlot";
import AddFeature from "@components/updateForms/AddFeature";
import AddItemToArrayField from "@components/updateForms/AddItemToArrayField";
import AddEquipment from "@components/updateForms/AddEquipment";
import { defaultEquipmentFormData, defaultFeatureFormData, defaultLanguageFormData, defaultNoteFormData, defaultProficiencyFormData, defaultSpellFormData, defaultSpellSlotFormData, defaultSummonableFormData, defaultWeaponFormData, emptyShowSectionData } from "@data/emptyFormData";
import { UpdateType } from "@models/enum/service/UpdateType";
import { transformAndUpdate } from "@services/firestore/updateData";
import { QueryClient } from "@tanstack/react-query";
import PageHeaderBarPC from "@components/headerBars/PageHeaderBarPC";
import { useSearchParams } from "react-router-dom";
import QuickNav from "@components/QuickNav";
import { emptyRichTextContent, triggerSuccessAlert } from "@pages/utils";
import SuccessAlert from "@components/alerts/SuccessAlert";
import { UserRole } from "@services/firestore/enum/UserRole";
import AboutFooter from "@components/AboutFooter";
import AddSummonable from "@components/updateForms/AddSummonable";

interface Props {
  pcData: PlayerCharacter;
  queryClient: QueryClient;
  pcList: BaseDetails[];
  selectedPc: {pcId: string | null, setSelectedPcId: (pcId: string) => void};
  userRole: UserRole | undefined;
}

function AddItems ({pcData, queryClient, pcList, selectedPc, userRole}: Props) {
  const [searchParams] = useSearchParams();
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [showSection, setShowSection] = useState(emptyShowSectionData);

  // Form Data
  const [weaponFormData, setWeaponFormData] = useState(defaultWeaponFormData);
  const [spellFormData, setSpellFormData] = useState(defaultSpellFormData);
  const [spellSlotFormData, setSpellSlotFormData] = useState(defaultSpellSlotFormData);
  const [featureFormData, setFeatureFormData] = useState(defaultFeatureFormData);
  const [equipmentFormData, setEquipmentFormData] = useState(defaultEquipmentFormData);
  const [proficiencyFormData, setProficiencyFormData] = useState(defaultProficiencyFormData);
  const [languageFormData, setLanguageFormData] = useState(defaultLanguageFormData);
  const [noteFormData, setNoteFormData] = useState(defaultNoteFormData);
  const [summonableFormData, setSummonableFormData] = useState(defaultSummonableFormData);

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
    queryClient.refetchQueries({ queryKey: ['pcData', pcData.baseDetails.pcId]});
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
            You're almost done! Use the tools on this page to add items and complete your character.
            <br/>
            Then check out the other pages to view, track, and edit your character info as needed.
          </div>
        </div>
      }
            
      <PageHeaderBarPC 
          pcName={`${pcData.baseDetails.name.firstName} ${pcData.baseDetails.name.lastName}`}
          pageName="Add Items"
          pcList={pcList}
          selectedPc={selectedPc}
      />
      
      {showSuccessAlert && <SuccessAlert/>}
      
      <Card>
        <UpdateSpellSlot
          handleChange={handleChange}
          handleSubmit={handleSubmit}
          formData={spellSlotFormData}
          setFormData={setSpellSlotFormData}
          showSection={{data: showSection, setFunction: setShowSection}}
        />
      </Card>
      
      <Card>
        <AddSpell
          handleChange={handleChange}
          handleSubmit={handleSubmit}
          formData={spellFormData}
          setFormData={setSpellFormData}
          initialEditorContent={initialEditorContent}
          showSection={{data: showSection, setFunction: setShowSection}}
        />
      </Card>

      <Card>
        <AddWeapon
          handleChange={handleChange}
          handleSubmit={handleSubmit}
          formData={weaponFormData}
          setFormData={setWeaponFormData}
          initialEditorContent={initialEditorContent}
          showSection={{data: showSection, setFunction: setShowSection}}
        />
      </Card>

      <Card>
        <AddFeature
          handleChange={handleChange}
          handleSubmit={handleSubmit}
          formData={featureFormData}
          setFormData={setFeatureFormData}
          initialEditorContent={initialEditorContent}
          showSection={{data: showSection, setFunction: setShowSection}}
        />
      </Card>

      <Card>
        <AddEquipment
          handleChange={handleChange}
          handleSubmit={handleSubmit}
          formData={equipmentFormData}
          setFormData={setEquipmentFormData}
          initialEditorContent={initialEditorContent}
          showSection={{data: showSection, setFunction: setShowSection}}
        />
      </Card>

      <Card>
        <AddSummonable
          handleChange={handleChange}
          handleSubmit={handleSubmit}
          formData={summonableFormData}
          setFormData={setSummonableFormData}
          initialEditorContent={initialEditorContent}
          showSection={{data: showSection, setFunction: setShowSection}}
          pcData={pcData}
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
          showSection={{data: showSection, setFunction: setShowSection}}
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
          showSection={{data: showSection, setFunction: setShowSection}}
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
          initialEditorContent={initialEditorContent}
          showSection={{data: showSection, setFunction: setShowSection}}
        />
      </Card>
      <AboutFooter/>   
    </div>
    <QuickNav/>
    </>
  )
}

export default AddItems;