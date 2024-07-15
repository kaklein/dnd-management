import Card from "@components/cards/Card";
import Footer from "@components/Footer";
import Navbar from "@components/Navbar";
import PageHeaderBar from "@components/PageHeaderBar";
import { PlayerCharacter } from "@models/playerCharacter/PlayerCharacter";
import { SpellLevel } from "@models/playerCharacter/Spell";
import { useState } from "react";
import { DamageType } from "@models/enum/DamageType";
import { WeaponModifierProperty } from "@models/enum/WeaponModifierProperty";
import { Link } from "react-router-dom";
import AddWeapon from "@components/updateForms/AddWeapon";
import AddSpell from "@components/updateForms/AddSpell";
import AddSpellSlot from "@components/updateForms/AddSpellSlot";
import AddFeature from "@components/updateForms/AddFeature";
import AddItemToArrayField from "@components/updateForms/AddItemToArrayField";

interface Props {
  pcData: PlayerCharacter;
}

function Update ({pcData}: Props) {
  const [weaponFormData, setWeaponFormData] = useState({
    weaponName: '',
    weaponType: '',
    weaponDamage: '',
    weaponDamageType: '',
    weaponModifierProperty: '',
    weaponMagic: "false",
    weaponDescription: ''
  });
  const [spellFormData, setSpellFormData] = useState({
    spellName: '',
    spellDescription: '',
    spellLevel: '',
    spellSpellCastingAbility: '',
    spellDamageType: '',
    spellDamage: ''
  });
  const [spellSlotFormData, setSpellSlotFormData] = useState({
    spellSlotLevel: '',
    spellSlotMax: '',
  });
  const [featureFormData, setFeatureFormData] = useState({
    featureName: '',
    featureDescription: '',
    featureSource: '',
    featureMaxUses: '',
    featureRefresh: '',
    featureDamage: '',
    featureDamageType: '',
    featureSaveDC: ''
  });
  const [proficiencyFormData, setProficiencyFormData] = useState({
    proficiency: ''
  });
  const [languageFormData, setLanguageFormData] = useState({
    language: ''
  });

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>, setFunction: (prevFormData: any) => void) => {
    const { name, value } = event.target;
    setFunction((prevFormData: any) => ({...prevFormData, [name]: value}));
  };

  const handleSubmit = async (event: React.ChangeEvent<HTMLInputElement>, data: any) => {
    event.preventDefault();
    console.log('Submitting data: ' + JSON.stringify(data));
  }

  return (
    <>
      <Navbar/>
            
      <PageHeaderBar 
          pcName={`${pcData.baseDetails.name.firstName} ${pcData.baseDetails.name.lastName}`}
          pageName="Update"
      />

      <hr/>

      <h3>Add Items</h3>
      
      <Card>
        <AddWeapon
          handleChange={handleChange}
          handleSubmit={handleSubmit}
          weaponFormData={weaponFormData}
          setWeaponFormData={setWeaponFormData}
        />
      </Card>

      <Card>
        <AddSpell
          handleChange={handleChange}
          handleSubmit={handleSubmit}
          spellFormData={spellFormData}
          setSpellFormData={setSpellFormData}
        />
      </Card>

      <Card>
      <AddSpellSlot
          handleChange={handleChange}
          handleSubmit={handleSubmit}
          spellSlotFormData={spellSlotFormData}
          setSpellSlotFormData={setSpellSlotFormData}
        />
      </Card>

      <Card>
        <AddFeature
            handleChange={handleChange}
            handleSubmit={handleSubmit}
            featureFormData={featureFormData}
            setFeatureFormData={setFeatureFormData}
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

      <hr/>

      <h3>Update PC</h3>

      <Card>
          <ul>
            <li>Level</li>
            <li>AC</li>
            <li>Hit Point Maximum</li>
            <li>Hit Dice</li>
            <li>Proficiency Bonus</li>
          </ul>
      </Card>

      <Footer/>
    </>
  )
}

export default Update;