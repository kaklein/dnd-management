import Button, { ButtonType } from "@components/Button";
import FormSelect from "@components/FormSelect";
import TextEditor, { buildEditor } from "@components/TextEditor";
import { defaultSummonableFormData } from "@data/emptyFormData";
import { PlayerCharacter } from "@models/playerCharacter/PlayerCharacter";
import { validateRequiredFields } from "../utils";
import SummonableAttackForm from "./SummonableAttackForm";
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { SummonableAttack } from "@models/playerCharacter/SummonableAttack";
import { emptyRichTextContent } from "@pages/utils";

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
  pcData: PlayerCharacter;
  modalDismiss?: boolean;
}

function SummonableForm ({handleChange, handleSubmit, formData, setFormData, initialEditorContent, pcData, modalDismiss=false}: Props) {
  const summonableDescriptionEditor = buildEditor(initialEditorContent, (value: string) => {
    handleChange({ target: { name: 'description', value: value }}, setFormData);
  });

  const emptyAttacks: string[] = [];
  const [attacks, setAttacks] = useState((formData.attacks && formData.attacks.length > 0) ? formData.attacks.map((a: SummonableAttack) => a.id) as string[] : emptyAttacks);
  
  const summonableId = formData.summonableId;

  return (
    summonableDescriptionEditor &&
    <form onSubmit={async (event) => {
      // todo - figure out how to validate dynamic attack description fields...
      const { valid, errorMessage } = validateRequiredFields(['description'], formData);
        if (!valid) {
          event.preventDefault();
          alert(errorMessage);
          return;
        } else {
          await handleSubmit(event, formData, setFormData, defaultSummonableFormData);
          summonableDescriptionEditor.commands.clearContent();
          setAttacks(emptyAttacks);
        }
    }}>
      <div className="update-form-field">
        <label className="update-form-label" htmlFor="name">Type</label>
        <input
          className="update-form-input"
          type="text"
          placeholder="Familiar"
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
          placeholder="Fluffy"
          id="name"
          name="name"
          onChange={(event) => {handleChange(event, setFormData)}}
          value={formData.name}
        />
      </div>
      <div className="update-form-field">
        <label className="update-form-label" htmlFor="description">Description</label>
        <TextEditor
          editor={summonableDescriptionEditor}
        />          
      </div>

      <div className="update-form-field">
        <label className="update-form-label" htmlFor="hitPointMaximum">Max HP</label>
        <input
          type="number"
          className="update-form-input"
          min="0"
          max="999"
          id="hitPointMaximum"
          name="hitPointMaximum"
          onChange={(event) => {handleChange(event, setFormData)}}
          value={formData.hitPointMaximum}
          required
        />     
      </div>

      <div className="update-form-field">
        <label className="update-form-label" htmlFor="armorClass">Armor Class</label>
        <input
          type="number"
          className="update-form-input"
          min="0"
          max="999"
          id="armorClass"
          name="armorClass"
          onChange={(event) => {handleChange(event, setFormData)}}
          value={formData.armorClass}
          required
        />     
      </div>

      <div className="update-form-field">
        <label className="update-form-label" htmlFor="sourceName">Source - Spell or Feature?</label>
        <FormSelect
          className="update-form-input"
          value={formData.sourceType}
          handleChange={handleChange}
          setFormData={setFormData}
          name="sourceType"
          options={
            [
              { text: 'SPELL', value: 'spell'},
              { text: 'FEATURE', value: 'feature'}
            ]
          }
          required
        />
      </div>
      {
        formData.sourceType === 'spell' &&
        <div className="update-form-field">
          <label className="update-form-label" htmlFor="sourceName">Source Spell</label>
          <p className="update-form-description">Select the spell that allows you to summon this{formData.type ? ' ' + formData.type.toLowerCase() : ''}.</p>
          <p className="update-form-description">If you still need to add it, go to the <a href="#spells">Spell</a> section.</p>
          <FormSelect
            className="update-form-input"
            value={formData.sourceName}
            handleChange={handleChange}
            setFormData={setFormData}
            name="sourceName"
            options={
              pcData.baseDetails.spells?.sort((a, b) => {
                if (a.name < b.name) return -1;
                return 1;
              }).map((s) => ({
                text: s.name,
                value: s.name
              })) ?? []
            }
            required
          />
        </div>
      }
      {
        formData.sourceType === 'feature' &&
        <div className="update-form-field">
          <label className="update-form-label" htmlFor="sourceName">Source Feature</label>
          <p className="update-form-description">Select the feature that allows you to summon this {formData.type.toLowerCase()}</p>
          <p className="update-form-description">If you still need to add it, go to the <a href="#features">Feature</a> section.</p>
          <FormSelect
            className="update-form-input"
            value={formData.sourceName}
            handleChange={handleChange}
            setFormData={setFormData}
            name="sourceName"
            options={
              pcData.features?.sort((a, b) => {
                if (a.data.name < b.data.name) return -1;
                return 1;
              }).map((f) => ({
                text: f.data.name,
                value: f.data.name
              })) ?? []
            }
            required
          />      
        </div>
      }

      {/* Attacks */}
      <div className="update-form-field multi-item-form-field">
        <h5 className="section-header">Attacks & Actions (Optional)</h5>
        <div className="multi-item-form-group">
          {
            attacks.map(a => (
            <SummonableAttackForm
              key={a}
              attackId={a}
              initialEditorContent={
                pcData.summonables?.find(s => s.id == summonableId)?.data.attacks?.find(attack => attack.id == a)?.description ?? emptyRichTextContent
              }
              formData={formData}
              setFormData={setFormData}
              removeAttack={() => {
                setAttacks(attacks.filter(attack => attack != a));
                const updatedAttacks = formData.attacks.filter((attack: SummonableAttack) => attack.id != a);
                setFormData({
                  ...formData,
                  attacks: updatedAttacks,
                  newField: 'bogusValue'
                });
              }}
              summonable={pcData.summonables?.find(s => s.id == summonableId)}
            />
            ))
          }
        </div>
        <Button
          buttonType={ButtonType.SUCCESS}
          text="+ Add"
          onClick={() => {
            const newId = uuidv4();
            setAttacks([...attacks, newId])
          }}
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

export default SummonableForm;