import FormSelect from "@components/FormSelect";
import { defaultWeaponFormData } from "@data/emptyFormData";
import { DamageType } from "@models/enum/DamageType"
import { WeaponModifierProperty } from "@models/enum/WeaponModifierProperty"
import { Link } from "react-router-dom"
import Button, { ButtonType } from "@components/Button";
import TextEditor, { buildEditor } from "@components/TextEditor";
import { useEffect, useState } from "react";
import Popover from "@components/modals/Popover";

interface Props {
  handleChange: (event: any, setFunction: (prevFormData: any) => void) => void;
  handleSubmit: (
    event: any, 
    data: any, 
    clearForm: (data: any) => void,
    clearedFormData: any
  ) => Promise<void>;
  formData: any;
  setFormData: (data: any) => void;
  initialEditorContent: string;
  modalDismiss?: boolean;
}

function WeaponForm ({handleChange, handleSubmit, formData, setFormData, initialEditorContent, modalDismiss=false}: Props) { 
  const editor = buildEditor(initialEditorContent, (value: string) => {
    handleChange({ target: { name: 'description', value: value }}, setFormData);
  });

  const [showBonusField, setShowBonusField] = useState(formData.bonus ? true : false);  
  useEffect(() => {
    setShowBonusField(formData.bonus ? true : false);
  }, [formData.bonus]);
  const handleBonusCheckboxChange = () => {
    const newVal = !showBonusField;
    setShowBonusField(newVal);
    if (!newVal) {
      handleChange({target: {name: 'bonus', value: ''}}, setFormData);
    }
  }

  return (
    editor &&
    <form onSubmit={async (event) => {
      await handleSubmit(event, formData, setFormData, defaultWeaponFormData);
      editor.commands.clearContent();
    }}>
      <div className="update-form-field">
        <label className="update-form-label" htmlFor="type">Type</label>
        <p className="update-form-description">"dagger", "quarterstaff", "shortbow", etc. See all possible weapon types listed <Link to="http://dnd5e.wikidot.com/weapons" target="_blank">here</Link>.</p>
        <input
          className="update-form-input"
          type="text"
          id="type"
          name="type"
          onChange={(event) => {handleChange(event, setFormData)}}
          value={formData.type}
          required
        />
      </div>
      <div className="update-form-field">
        <label className="update-form-label" htmlFor="name">Name (Optional)</label>
        <input
          className="update-form-input"
          type="text"
          id="name"
          name="name"
          onChange={(event) => {handleChange(event, setFormData)}}
          value={formData.name}
        />
      </div>
      <div className="update-form-field">
        <label className="update-form-label" htmlFor="damage">Base Damage</label>
        <input
          className="update-form-input"
          type="text"
          id="damage"
          name="damage"
          placeholder="1d6"
          onChange={(event) => {handleChange(event, setFormData)}}
          value={formData.damage}
          required
        />
      </div>      
      <div className="update-form-field">
        <label className="update-form-label" htmlFor="damageType">Damage Type</label>
        <FormSelect
          className="update-form-input"
          value={formData.damageType}
          handleChange={handleChange}
          setFormData={setFormData}
          name="damageType"
          options={
            Object.values(DamageType).sort().map((option) => ({
              text: option.toUpperCase(),
              value: option
            }))
          }
          required
        />
      </div>
      <div className="update-form-field">
        <div className="update-form-conditional">
          <input
            id="bonusCheckBox"
            type="checkbox"
            checked={showBonusField}
            onChange={handleBonusCheckboxChange}
          />
          <label htmlFor="bonusCheckBox" className="inline-label">
            &nbsp; Weapon has a bonus (e.g. is a "+1" weapon)
            <Popover
              popoverBody={<>Bonus amount will be added to attack and damage rolls</>}
              fitContent={true}
              customClass="inline"
            ><>&#9432;</></Popover>
          </label>
        </div>
        {
          showBonusField &&
          <div className="form-sub-section">
            <label className="update-form-label" htmlFor="bonus">Bonus amount</label>
            <input
              className="update-form-input"
              type="number"
              min="0"
              max="9"
              id="bonus"
              name="bonus"
              onChange={(event) => {handleChange(event, setFormData)}}
              value={formData.bonus}
              required
            />  
          </div>
        }        
      </div>
      <div className="update-form-field">
        <label className="update-form-label" htmlFor="modifierProperty">Weapon Range</label>
        <p className="update-form-description">
          This will be used to determine the attack bonus modifier for the weapon.
          Select <b>Finesse</b> if it is a finesse weapon. 
          Otherwise, select <b>Melee</b> or <b>Ranged</b> as applies to the weapon.
        </p>
        <FormSelect
          className="update-form-input"
          value={formData.modifierProperty}
          handleChange={handleChange}
          setFormData={setFormData}
          name="modifierProperty"
          options={
            Object.values(WeaponModifierProperty).sort().map((option) => ({
              text: option.toUpperCase(),
              value: option
            }))
          }
          required
        />
      </div>
      <div className="update-form-field">
        <label className="update-form-label" htmlFor="magic">Is this weapon magic?</label>
        <div className="container-fluid">
          <div className="row">
            <div className="col-auto">
              <input
                className="form-radio-input"
                type="radio"
                id="No"
                name="magic"
                value="false"
                checked={formData.magic === "false"}
                onChange={(event) => handleChange(event, setFormData)}
              />
              <label className="form-radio-label" htmlFor="No">No</label>
            </div>
            <div className="col-auto">
              <input
                className="form-radio-input"
                type="radio"
                id="Yes"
                name="magic"
                value="true"
                checked={formData.magic === "true"}
                onChange={(event) => handleChange(event, setFormData)}
              />
              <label className="form-radio-label" htmlFor="Yes">Yes</label>
            </div>
          </div>
        </div> 
      </div>
      <div className="update-form-field">
        <label className="update-form-label" htmlFor="description">Description (Optional)</label>
        <TextEditor
          editor={editor}
        />
      </div>
      
      <Button
          text="Save"
          customClass="float-right"
          buttonType={ButtonType.INFO}
          type="submit"
          onClick={() => {}}
          modalDismiss={modalDismiss}
        />
    </form>
  )
}

export default WeaponForm;