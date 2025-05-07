import Navbar from "@components/Navbar";
import AbilityCard from "@components/cards/AbilityCard";
import Card from "@components/cards/Card";
import { AbilityScores } from "@models/playerCharacter/AbilityScores";
import { BaseDetails, PlayerCharacter } from "@models/playerCharacter/PlayerCharacter";
import { getDefaultSpellSaveDC, getPassiveWisdom, orderAbilityCardElements } from "@components/utils";
import { Ability } from "@models/enum/Ability";
import PageHeaderBarPC from "@components/headerBars/PageHeaderBarPC";
import Button, { ButtonType } from "@components/Button";
import { useState } from "react";
import { buildDefaultAbilityScoreFormData } from "@data/emptyFormData";
import { transformAndUpdate } from "@services/firestore/updateData";
import { QueryClient } from "@tanstack/react-query";
import QuickNav from "@components/QuickNav";
import { triggerSuccessAlert } from "@pages/utils";
import SuccessAlert from "@components/alerts/SuccessAlert";
import { UserRole } from "@services/firestore/enum/UserRole";
import Popover from "@components/modals/Popover";
import PassivePerceptionPopoverContent from "@components/popovers/PassivePerceptionPopoverContent";
import AboutFooter from "@components/AboutFooter";
import SpellSaveDCPopoverContent from "@components/popovers/SpellSaveDCPopoverContent";
import { logError } from "@services/sentry/logger";

interface Props {
    pcData: PlayerCharacter;
    pcList: BaseDetails[];
    selectedPc: {pcId: string | null, setSelectedPcId: (pcId: string) => void};
    queryClient: QueryClient;
    userRole: UserRole | undefined;
}

function Stats({pcData, pcList, selectedPc, queryClient, userRole}: Props) { 
    const defaultSpellCastingAbility = pcData.baseDetails.defaultSpellCastingAbility;
    
    const [editable, setEditable] = useState(false);
    const [showSuccessAlert, setShowSuccessAlert] = useState(false);
    
    const [formData, setFormData] = useState(buildDefaultAbilityScoreFormData(pcData.abilityScores));
    const handleChange = (
        event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>, 
        setFunction: (prevFormData: any) => void
    ) => {
        const { name, value } = event.target;
        setFunction((prevFormData: any) => ({...prevFormData, [name]: value}));
    };
    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        try {
            await transformAndUpdate(pcData, formData);
        } catch (e) {
            logError(e);
            alert(`Update failed. PLease refresh the page and try again.`);
            return;
        }
        setEditable(false);

        queryClient.refetchQueries({ queryKey: ['pcData', pcData.baseDetails.pcId]});
        triggerSuccessAlert(setShowSuccessAlert);
    }
    
    const mapAbilityScoreCards = (abilityScores: AbilityScores) => {
        return ( 
            <>
            <form onSubmit={(event) => handleSubmit(event)}>
            <AbilityCard
                abilityName="STRENGTH"
                score={formData.strengthScore}
                proficiencyBonus={pcData.baseDetails.proficiencyBonus}
                skills={orderAbilityCardElements(abilityScores, Ability.STR)}
                editable={editable}
                handleChange={handleChange}
                setFormData={setFormData}
                formData={formData}
            />
            <AbilityCard
                abilityName="DEXTERITY"
                score={abilityScores.data.dexterity.score}
                proficiencyBonus={pcData.baseDetails.proficiencyBonus}
                skills={orderAbilityCardElements(abilityScores, Ability.DEX)}
                editable={editable}
                handleChange={handleChange}
                setFormData={setFormData}
                formData={formData}
            /> 
            <AbilityCard
                abilityName="CONSTITUTION"
                score={abilityScores.data.constitution.score}
                proficiencyBonus={pcData.baseDetails.proficiencyBonus}
                skills={orderAbilityCardElements(abilityScores, Ability.CON)}
                editable={editable}
                handleChange={handleChange}
                setFormData={setFormData}
                formData={formData}
            />
            <AbilityCard
                abilityName="INTELLIGENCE"
                score={abilityScores.data.intelligence.score}
                proficiencyBonus={pcData.baseDetails.proficiencyBonus}
                skills={orderAbilityCardElements(abilityScores, Ability.INT)}
                editable={editable}
                handleChange={handleChange}
                setFormData={setFormData}
                formData={formData}
            />
            <AbilityCard
                abilityName="WISDOM"
                score={abilityScores.data.wisdom.score}
                proficiencyBonus={pcData.baseDetails.proficiencyBonus}
                skills={orderAbilityCardElements(abilityScores, Ability.WIS)}
                editable={editable}
                handleChange={handleChange}
                setFormData={setFormData}
                formData={formData}
            />
            <AbilityCard
                abilityName="CHARISMA"
                score={abilityScores.data.charisma.score}
                proficiencyBonus={pcData.baseDetails.proficiencyBonus}
                skills={orderAbilityCardElements(abilityScores, Ability.CHA)}
                editable={editable}
                handleChange={handleChange}
                setFormData={setFormData}
                formData={formData}
            />
            <div className="container-fluid bottom-button-container">
                {
                    editable &&
                    <>
                    <div className="row">
                        <div className="col small-padding">
                        <Button customClass="full-width bottom-button-container-button" buttonType={ButtonType.SECONDARY} text={"Cancel"} onClick={() => {
                            setEditable(!editable);
                            setFormData(buildDefaultAbilityScoreFormData(pcData.abilityScores));
                        }}/>
                        </div>
                        <div className="col small-padding">
                                <Button customClass="full-width bottom-button-container-button" type="submit" buttonType={ButtonType.INFO} text="Save Changes" onClick={() => {}}/>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col"/>
                        <div className="col-auto small-padding border-row">
                            <Popover
                                popoverBody={
                                    <>
                                    <p>To change an <b>ability score</b>, edit the score at the top left - all modifiers will be automatically recalculated.</p>
                                    <p>To add or remove <b>skill proficiencies</b>, check or uncheck the box to the left of the relevant skill.</p>
                                    <p>Be sure to click <b>Save Changes</b> when you're done, or <b>Cancel</b> if you've changed your mind.</p>
                                    </>
                                }
                            >
                                <p className="update-form-description dark-purple center">&#9432; Tips for editing</p>
                            </Popover>
                        </div>
                        <div className="col"/>
                    </div>
                    </>
                }
                {
                    !editable &&
                    <>
                    <div className="row">
                        <div className="col small-padding">
                            <Button customClass="full-width bottom-button-container-button" buttonType={ButtonType.SECONDARY} text={"Edit Ability Scores"} onClick={() => {
                                setEditable(!editable);
                                setFormData(buildDefaultAbilityScoreFormData(pcData.abilityScores));
                            }}/>
                        </div>
                    </div>                        
                    </>
                }
            </div>           
            </form>             
            </>
        );
    }

    return (
        <>
        <div className="main-body">
            <Navbar isSelectedPc={!!selectedPc.pcId} userRole={userRole}/>
            
            <PageHeaderBarPC
                pcName={`${pcData.baseDetails.name.firstName} ${pcData.baseDetails.name.lastName}`}
                pageName="Ability Scores"
                pcList={pcList}
                selectedPc={selectedPc}
            />

            {showSuccessAlert && <SuccessAlert/>}

            {/* Ability Scores */}
            { 
                mapAbilityScoreCards(pcData.abilityScores) 
            }
            
            <br/>

            <Card>
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-6 right-justify stat-item">
                            AC:
                        </div>
                        <div className="col-6 left-justify stat-item-bold">
                            {pcData.baseDetails.armorClass}
                        </div>
                    </div>
                </div>
            </Card>
            <Card>
                <div className="row">
                    <div className="col-6 right-justify stat-item">
                        Initiative:
                    </div>
                    <div className="col-6 left-justify stat-item-bold">
                    <Popover
                        popoverBody={
                            <div>
                                <b>{pcData.abilityScores.data.dexterity.modifier > 0 && '+'}{pcData.abilityScores.data.dexterity.modifier}</b> from DEX modifier
                            </div>
                        }
                        fitContent={true}
                    >
                        <>{pcData.abilityScores.data.dexterity.modifier > 0 && '+'}{pcData.abilityScores.data.dexterity.modifier}</>
                    </Popover>
                    </div>
                </div>                    
            </Card>
            <Card>
                    <div className="row">
                    <div className="col-6 right-justify stat-item">
                        Passive Perception:
                    </div>
                    <div className="col-6 left-justify stat-item-bold">
                    <Popover
                        popoverBody={
                            <PassivePerceptionPopoverContent
                                wisdomModifier={pcData.abilityScores.data.wisdom.modifier}
                                perceptionProficiency={pcData.abilityScores.data.wisdom.perception.proficient}
                                proficiencyBonus={pcData.baseDetails.proficiencyBonus}
                            />
                        }
                        fitContent={true}
                    >
                        <>
                            {getPassiveWisdom(
                                pcData.abilityScores.data.wisdom.modifier, 
                                pcData.abilityScores.data.wisdom.perception.proficient, 
                                pcData.baseDetails.proficiencyBonus
                            )}
                        </>                            
                    </Popover>
                    </div>
                </div>                    
            </Card>
            <Card>
                <div className="row">
                    <div className="col-6 right-justify stat-item">
                        Proficiency Bonus:
                    </div>
                    <div className="col-6 left-justify stat-item-bold">
                    <Popover
                        popoverBody={
                            <div>
                            <b>+{pcData.baseDetails.proficiencyBonus}</b> for level {pcData.baseDetails.level} character
                            </div>
                        }
                        fitContent={true}
                    >
                        <>+{pcData.baseDetails.proficiencyBonus}</>
                    </Popover>
                    </div>
                </div>
            </Card>            
            <Card>
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-6 right-justify stat-item">
                            Speed:
                        </div>
                        <div className="col-6 left-justify stat-item-bold">
                            {pcData.baseDetails.speed}
                        </div>
                    </div>
                </div>
            </Card>
            {
                defaultSpellCastingAbility &&
                <Card>
                    <div className="row">
                        <div className="col-6 right-justify stat-item">
                            Spell Save DC:
                        </div>
                        <div className="col-6 left-justify stat-item-bold">
                        <Popover
                            popoverBody={
                                <SpellSaveDCPopoverContent
                                    proficiencyBonus={pcData.baseDetails.proficiencyBonus}
                                    defaultSpellCastingAbility={defaultSpellCastingAbility}
                                    abilityScores={pcData.abilityScores}
                                />
                            }
                            fitContent={true}
                        >
                            <>{getDefaultSpellSaveDC(pcData.baseDetails.proficiencyBonus, defaultSpellCastingAbility, pcData.abilityScores)}</>
                        </Popover>
                        </div>
                    </div>                    
                </Card>
            }

            <AboutFooter/>
        </div>
        <QuickNav/>
        </>
    )
}


export default Stats;
