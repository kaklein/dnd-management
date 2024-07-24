import Button, { ButtonType } from "@components/Button";
import Card from "@components/cards/Card";
import ThreeColumnBar from "@components/ThreeColumnBar";
import { buildProficiencyForms } from "@components/utils";
import { useState } from "react";

interface Props {
  handleChange: (event: any, setFunction: (prevFormData: any) => void) => void;
  handleSubmit: (
    event: any, 
    data: any, 
    clearForm: (data: any) => void,
    clearedFormData: any
  ) => void;
  formData: any;
  setFormData: (data: any) => void;
}

function CreateCharacterForm ({handleChange, handleSubmit, formData, setFormData}: Props) {
  const [showBaseDetails, setShowBaseDetails] = useState(true);
  const [showAbilityScores, setShowAbilityScores] = useState(false);
  
  return (
    <div>
      <form className="update-pc-form" onSubmit={(event) => handleSubmit(event, formData, setFormData, formData)}>
        {
          showBaseDetails &&
          <>
            <div className="update-form-field">
              <label className="update-form-label" htmlFor="playerName">Player Name</label>
              <input
                className="update-form-input"
                type="string"
                id="playerName"
                name="playerName"
                onChange={(event) => {handleChange(event, setFormData)}}
                value={formData.playerName}
                required
                autoFocus
              />
            </div>

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
              <textarea
                className="update-form-input"
                id="description"
                name="description"
                onChange={(event) => {handleChange(event, setFormData)}}
                value={formData.description || ""}
              />
            </div>
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
              <input
                className="update-form-input"
                type="string"
                id="alignment"
                name="alignment"
                onChange={(event) => {handleChange(event, setFormData)}}
                value={formData.alignment}
                required
                placeholder="Chaotic neutral"
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
                value={formData.xp || "0"}
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
              <input
                className="update-form-input"
                type="string"
                id="hitDiceType"
                name="hitDiceType"
                onChange={(event) => {handleChange(event, setFormData)}}
                value={formData.hitDiceType}
                placeholder="d8"
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
            <Button buttonType={ButtonType.INFO} text="Next >" onClick={() => {
              setShowAbilityScores(true);
              setShowBaseDetails(false);
            }}/>
          </>   
        }

        {
          showAbilityScores &&
          <>
            <ThreeColumnBar
              contentLeft={
                <Button 
                  buttonType={ButtonType.SECONDARY}
                  text="< Back"
                  onClick={() => {
                    setShowAbilityScores(false);
                    setShowBaseDetails(true);
                  }}
                />
              }
            />
            <h4 className="form-sub-heading">Ability Scores</h4>
            <p className="update-form-description">
              Ability modifiers will be automatically calculated. After character creation, you can view and modify your ability scores and skill proficiencies
              at any time on the Stats page.
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

            <div className="container-fluid">
              <ThreeColumnBar
                contentLeft={
                  <Button
                    buttonType={ButtonType.SECONDARY}
                    text="< Back"
                    onClick={() => {
                      setShowAbilityScores(false);
                      setShowBaseDetails(true);
                    }}
                  />
                }
                contentRight={
                  <Button
                    text="Submit"
                    buttonType={ButtonType.INFO}
                    type="submit"
                    onClick={() => {}}
                  />
                }
              />
            </div>
          </>
        }
      </form>
    </div>
  )
}

export default CreateCharacterForm