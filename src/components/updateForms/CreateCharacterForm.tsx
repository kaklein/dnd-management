import Button, { ButtonType } from "@components/Button";
import Card from "@components/cards/Card";
import FormSelect from "@components/FormSelect";
import TextEditor, { buildEditor } from "@components/TextEditor";
import { buildProficiencyForms } from "@components/utils";
import { Alignment } from "@models/enum/Alignment";
import { HitDiceType } from "@models/enum/HitDiceType";
import { useState } from "react";
import { uploadImage } from "@services/firebaseStorage/write";
import ImageInput from "@components/ImageInput";
import { FileNameUtil } from "@services/firebaseStorage/util";
import { v4 as uuidv4 } from "uuid";
import { Ability } from "@models/enum/Ability";
import Popover from "@components/modals/Popover";
import { SentryLogger } from "@services/sentry/logger";

interface Props {
  handleChange: (event: any, setFunction: (prevFormData: any) => void) => void;
  handleSubmit: (
    event: any, 
    data: any, 
    generatedPcId: string
  ) => Promise<void>;
  formData: any;
  initialEditorContent: string;
  setFormData: (data: any) => void;
  logger: SentryLogger;
}

function CreateCharacterForm ({handleChange, handleSubmit, formData, initialEditorContent, setFormData, logger}: Props) {
  const [showBaseDetails, setShowBaseDetails] = useState(true);
  const [showAbilityScores, setShowAbilityScores] = useState(false);
  const editor = buildEditor(initialEditorContent, (value: string) => {
    handleChange({ target: { name: 'description', value: value }}, setFormData);
  });

  const [imageUploadElement, setImageUploadElement] = useState(document.getElementById("uploadFile") as HTMLInputElement);
  const generatedPcId = uuidv4();
  const fileNameUtil = new FileNameUtil(generatedPcId);
  
  return (
    editor &&
    <div>
      <form className="update-pc-form" onSubmit={async (event) => {
        event.preventDefault();
        if (formData.imagePath) {
          try {
            await uploadImage(imageUploadElement, fileNameUtil);
            await handleSubmit(event, formData, generatedPcId);
            editor.commands.clearContent();
          } catch (e: any) {
            logger.logError(e);
          }
        } else {
          await handleSubmit(event, formData, generatedPcId);
          editor.commands.clearContent();
        }
      }}>
        {
          showBaseDetails &&
          <>
            <h4 className="form-sub-heading">Character Details</h4>

            <div className="update-form-field">
              <label className="update-form-label" htmlFor="firstName">Character First Name</label>
              <input
                className="update-form-input"
                type="string"
                id="firstName"
                name="firstName"
                onChange={(event) => {handleChange(event, setFormData)}}
                value={formData.firstName}
                required
              />
            </div>
            <div className="update-form-field">
              <label className="update-form-label" htmlFor="lastName">Character Last Name</label>
              <input
                className="update-form-input"
                type="string"
                id="lastName"
                name="lastName"
                onChange={(event) => {handleChange(event, setFormData)}}
                value={formData.lastName}
                required
              />
            </div>
            <div className="update-form-field">
              <label className="update-form-label" htmlFor="description">Description (Optional)</label>
              <TextEditor
                editor={editor}
              />
            </div>
            <ImageInput
              maxFileSizeMB={1}
              formData={{
                data: formData,
                set: setFormData
              }}
              fileNameUtil={fileNameUtil}
              setImageUploadElement={setImageUploadElement}
            />
            <div className="update-form-field">
              <label className="update-form-label" htmlFor="class">Class</label>
              <input
                className="update-form-input"
                type="string"
                id="class"
                name="class"
                onChange={(event) => {handleChange(event, setFormData)}}
                value={formData.class}
                required
                placeholder="Ranger"
              />
            </div>
            <div className="update-form-field">
              <label className="update-form-label" htmlFor="subclass">Subclass (Optional)</label>
              <input
                className="update-form-input"
                type="string"
                id="subclass"
                name="subclass"
                onChange={(event) => {handleChange(event, setFormData)}}
                value={formData.subclass || ""}
                placeholder="Beast Master"
              />
            </div>
            <div className="update-form-field">
              <label className="update-form-label" htmlFor="race">Race</label>
              <input
                className="update-form-input"
                type="string"
                id="race"
                name="race"
                onChange={(event) => {handleChange(event, setFormData)}}
                value={formData.race}
                placeholder="Human"
                required
              />
            </div>
            <div className="update-form-field">
              <label className="update-form-label" htmlFor="alignment">Alignment</label>
              <FormSelect
                className="update-form-input"
                value={formData.alignment}
                handleChange={handleChange}
                setFormData={setFormData}
                name="alignment"
                options={
                  Object.values(Alignment).map((option) => ({
                    text: option.toUpperCase(),
                    value: option
                  }))
                }
                required
              />              
            </div>
            <div className="update-form-field">
              <label className="update-form-label" htmlFor="background">Background</label>
              <input
                className="update-form-input"
                type="string"
                id="background"
                name="background"
                onChange={(event) => {handleChange(event, setFormData)}}
                value={formData.background}
                required
                placeholder="Charlatan"
              />
            </div>
            <div className="update-form-field">
              <label className="update-form-label" htmlFor="defaultSpellCastingAbility">
                Spellcasting Ability (Optional)
                {
                  <Popover
                  customClass="inline"
                  popoverBody={
                    <p>
                      This usually depends on your character's class. Not all classes have a spellcasting ability.
                    </p>
                  }
                  fitContent={true}
                >
                  <p className="inline">&#9432;</p>
                </Popover>
                }
              </label>
              <FormSelect
                className="update-form-input"
                value={formData.defaultSpellCastingAbility}
                handleChange={handleChange}
                setFormData={setFormData}
                name="defaultSpellCastingAbility"
                options={
                  Object.values(Ability).map((option) => ({
                    text: option.toUpperCase(),
                    value: option
                  }))
                }
                defaultOptionText="-- None --"              
              />              
            </div>

            <h4 className="form-sub-heading">Base Stats</h4>

            <div className="update-form-field">
              <label className="update-form-label" htmlFor="level">Level</label>
              <input
                className="update-form-input"
                type="number"
                min="1"
                max="20"
                id="level"
                name="level"
                onChange={(event) => {handleChange(event, setFormData)}}
                value={formData.level}
                required
              />
            </div>
            <div className="update-form-field">
              <label className="update-form-label" htmlFor="xp">XP (Optional)</label>
              <input
                className="update-form-input"
                type="number"
                min="0"
                max="999999"
                id="xp"
                name="xp"
                onChange={(event) => {handleChange(event, setFormData)}}
                value={formData.xp || ""}
              />
            </div>
            <div className="update-form-field">
              <label className="update-form-label" htmlFor="armorClass">Armor Class</label>
              <input
                className="update-form-input"
                type="number"
                min="1"
                max="99"
                id="armorClass"
                name="armorClass"
                onChange={(event) => {handleChange(event, setFormData)}}
                value={formData.armorClass}
                required
              />
            </div>
            <div className="update-form-field">
              <label className="update-form-label" htmlFor="speed">Speed</label>
              <input
                className="update-form-input"
                type="number"
                min="1"
                max="99"
                id="speed"
                name="speed"
                onChange={(event) => {handleChange(event, setFormData)}}
                value={formData.speed}
                required
              />
            </div>
            <div className="update-form-field">
              <label className="update-form-label" htmlFor="hitPointMaximum">Max Hit Points</label>
              <input
                className="update-form-input"
                type="number"
                min="1"
                max="999"
                id="hitPointMaximum"
                name="hitPointMaximum"
                onChange={(event) => {handleChange(event, setFormData)}}
                value={formData.hitPointMaximum}
                required
              />
            </div>
            <div className="update-form-field">
              <label className="update-form-label" htmlFor="hitDiceType">Hit Dice Type</label>
              <FormSelect
                className="update-form-input"
                value={formData.hitDiceType}
                handleChange={handleChange}
                setFormData={setFormData}
                name="hitDiceType"
                options={
                  Object.values(HitDiceType).map((option) => ({
                    text: option,
                    value: option
                  }))
                }
                required
              />              
            </div>
            <div className="update-form-field">
              <label className="update-form-label" htmlFor="gold">Starting Gold</label>
              <input
                className="update-form-input"
                type="number"
                min="0"
                max="99999"
                id="gold"
                name="gold"
                onChange={(event) => {handleChange(event, setFormData)}}
                value={formData.gold}
                required
              />
            </div>
            
            <div className="container-fluid back-submit-row">
              <div className="row">
                <div className="col-6"/>
                <div className="col-6">
                <Button buttonType={ButtonType.INFO} text="Next >" onClick={() => {
                  setShowAbilityScores(true);
                  setShowBaseDetails(false);
                }}/>
                </div>
              </div>
            </div>
          </>   
        }

        {
          showAbilityScores &&
          <>
            <h4 className="form-sub-heading">Ability Scores</h4>
            <p className="update-form-description">
              Ability modifiers will be automatically calculated. After character creation, you can view and modify your ability scores and skill proficiencies
              at any time on the Ability Scores page.
            </p>
            <Card>
              <h4 className="form-sub-heading-2">Strength</h4>
              <div className="update-form-field">
                <label className="update-form-label" htmlFor="strengthScore">Score</label>
                <input
                  className="update-form-input"
                  type="number"
                  min="1"
                  max="30"
                  id="strengthScore"
                  name="strengthScore"
                  onChange={(event) => {handleChange(event, setFormData)}}
                  value={formData.strengthScore}
                  required
                  autoFocus
                />
              </div>
              {
                buildProficiencyForms(formData, 'strength', ['Athletics'], handleChange, setFormData)
              }
            </Card>
            <Card>
              <h4 className="form-sub-heading-2">Dexterity</h4>
              <div className="update-form-field">
                <label className="update-form-label" htmlFor="dexterityScore">Score</label>
                <input
                  className="update-form-input"
                  type="number"
                  min="1"
                  max="30"
                  id="dexterityScore"
                  name="dexterityScore"
                  onChange={(event) => {handleChange(event, setFormData)}}
                  value={formData.dexterityScore}
                  required
                />
              </div>
              {
                buildProficiencyForms(formData, 'dexterity', ['Acrobatics', 'Sleight of Hand', 'Stealth'], handleChange, setFormData)
              }
            </Card>
            <Card>
              <h4 className="form-sub-heading-2">Constitution</h4>
              <div className="update-form-field">
                <label className="update-form-label" htmlFor="constitutionScore">Score</label>
                <input
                  className="update-form-input"
                  type="number"
                  min="1"
                  max="30"
                  id="constitutionScore"
                  name="constitutionScore"
                  onChange={(event) => {handleChange(event, setFormData)}}
                  value={formData.constitutionScore}
                  required
                />
              </div>
              {
                buildProficiencyForms(formData, 'constitution', [], handleChange, setFormData)
              }
            </Card>
            <Card>
              <h4 className="form-sub-heading-2">Intelligence</h4>
              <div className="update-form-field">
                <label className="update-form-label" htmlFor="intelligenceScore">Score</label>
                <input
                  className="update-form-input"
                  type="number"
                  min="1"
                  max="30"
                  id="intelligenceScore"
                  name="intelligenceScore"
                  onChange={(event) => {handleChange(event, setFormData)}}
                  value={formData.intelligenceScore}
                  required
                />
              </div>
              {
                buildProficiencyForms(formData, 'intelligence', ['Arcana', 'History', 'Investigation', 'Nature', 'Religion'], handleChange, setFormData)
              }
            </Card>
            <Card>
              <h4 className="form-sub-heading-2">Wisdom</h4>
              <div className="update-form-field">
                <label className="update-form-label" htmlFor="wisdomScore">Score</label>
                <input
                  className="update-form-input"
                  type="number"
                  min="1"
                  max="30"
                  id="wisdomScore"
                  name="wisdomScore"
                  onChange={(event) => {handleChange(event, setFormData)}}
                  value={formData.wisdomScore}
                  required
                />
              </div>
              {
                buildProficiencyForms(formData, 'wisdom', ['Animal Handling', 'Insight', 'Medicine', 'Perception', 'Survival'], handleChange, setFormData)
              }
            </Card>
            <Card>
              <h4 className="form-sub-heading-2">Charisma</h4>
              <div className="update-form-field">
                <label className="update-form-label" htmlFor="charismaScore">Score</label>
                <input
                  className="update-form-input"
                  type="number"
                  min="1"
                  max="30"
                  id="charismaScore"
                  name="charismaScore"
                  onChange={(event) => {handleChange(event, setFormData)}}
                  value={formData.charismaScore}
                  required
                />
              </div>
              {
                buildProficiencyForms(formData, 'charisma', ['Deception', 'Intimidation', 'Performance', 'Persuasion'], handleChange, setFormData)
              }
            </Card>

            <div className="container-fluid back-submit-row">
              <div className="row">
                <div className="col-6">
                  <Button
                    buttonType={ButtonType.SECONDARY}
                    text="< Back"
                    onClick={() => {
                      setShowAbilityScores(false);
                      setShowBaseDetails(true);
                    }}
                  />
                </div>
                <div className="col-6">
                  <Button
                    text="Submit"
                    buttonType={ButtonType.INFO}
                    type="submit"
                    onClick={() => {}}
                  />
                </div>
              </div>
            </div>
          </>
        }
      </form>
    </div>
  )
}

export default CreateCharacterForm