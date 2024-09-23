import Navbar from "@components/Navbar";
import AbilityCard from "@components/cards/AbilityCard";
import Card from "@components/cards/Card";
import { AbilityScores } from "@models/playerCharacter/AbilityScores";
import { BaseDetails, PlayerCharacter } from "@models/playerCharacter/PlayerCharacter";
import { getPassiveWisdom, orderAbilityCardElements } from "@components/utils";
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

interface Props {
    pcData: PlayerCharacter;
    pcList: BaseDetails[];
    selectedPc: {pcId: string | null, setSelectedPcId: (pcId: string) => void};
    queryClient: QueryClient;
    userRole: UserRole | undefined;
}

function Stats({pcData, pcList, selectedPc, queryClient, userRole}: Props) { 
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
            console.error(e);
            alert(`Update failed. PLease refresh the page and try again.`);
            return;
        }
        setEditable(false);

        queryClient.invalidateQueries();
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
            { editable &&
                <Button type="submit" buttonType={ButtonType.INFO} text="Save Changes" onClick={() => {}}/>
            }
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
            <div className="div-button">
                <Button customClass="float-right" buttonType={ButtonType.DANGER} text={editable ? "Cancel" : "Edit Ability Scores"} onClick={() => {
                    setEditable(!editable);
                    setFormData(buildDefaultAbilityScoreFormData(pcData.abilityScores));
                }}/>
            </div>

            <br/>

            <Card>
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-6 right-justify">
                            <h5>AC:</h5>
                        </div>
                        <div className="col-6 left-justify">
                            <h4>{pcData.baseDetails.armorClass}</h4>
                        </div>
                    </div>
                </div>
            </Card>
            <Card>
                <div className="row">
                    <div className="col-6 right-justify">
                        <h5>Initiative:</h5>
                    </div>
                    <div className="col-6 left-justify">
                    <Popover
                        popoverBody={
                            <div>
                                <b>{pcData.abilityScores.data.dexterity.modifier > 0 && '+'}{pcData.abilityScores.data.dexterity.modifier}</b> from DEX modifier
                            </div>
                        }
                        fitContent={true}
                    >
                        <h4>{pcData.abilityScores.data.dexterity.modifier > 0 && '+'}{pcData.abilityScores.data.dexterity.modifier}</h4>
                    </Popover>
                    </div>
                </div>                    
            </Card>
            <Card>
                    <div className="row">
                    <div className="col-6 right-justify">
                        <h5>Passive Perception:</h5>
                    </div>
                    <div className="col-6 left-justify">
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
                        <h4>
                            {getPassiveWisdom(
                                pcData.abilityScores.data.wisdom.modifier, 
                                pcData.abilityScores.data.wisdom.perception.proficient, 
                                pcData.baseDetails.proficiencyBonus
                            )}
                        </h4>                            
                    </Popover>
                    </div>
                </div>                    
            </Card>
            <Card>
                <div className="row">
                    <div className="col-6 right-justify">
                        <h5>Proficiency Bonus:</h5>
                    </div>
                    <div className="col-6 left-justify">
                    <Popover
                        popoverBody={
                            <div>
                            <b>+{pcData.baseDetails.proficiencyBonus}</b> for level {pcData.baseDetails.level} character
                            </div>
                        }
                        fitContent={true}
                    >
                        <h4>+{pcData.baseDetails.proficiencyBonus}</h4>
                    </Popover>
                    </div>
                </div>
            </Card>
            <Card>
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-6 right-justify">
                            <h5>Speed:</h5>
                        </div>
                        <div className="col-6 left-justify">
                            <h4>{pcData.baseDetails.speed}</h4>
                        </div>
                    </div>
                </div>
            </Card>

            <AboutFooter/>
        </div>
        <QuickNav/>
        </>
    )
}


export default Stats;
