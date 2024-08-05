import Navbar from "@components/Navbar";
import AbilityCard from "@components/cards/AbilityCard";
import Card from "@components/cards/Card";
import CardSetHorizontal from "@components/cards/CardSetHorizontal";
import { AbilityScores } from "@models/playerCharacter/AbilityScores";
import { BaseDetails, PlayerCharacter } from "@models/playerCharacter/PlayerCharacter";
import { getPassiveWisdom, orderAbilityCardElements } from "@components/utils";
import { Ability } from "@models/enum/Ability";
import PageHeaderBarPC from "@components/headerBars/PageHeaderBarPC";
import Button, { ButtonType } from "@components/Button";
import { useState } from "react";
import Alert from "@components/Alert";
import { buildDefaultAbilityScoreFormData } from "@data/emptyFormData";
import { transformAndUpdate } from "@services/firestore/updateData";
import { QueryClient } from "@tanstack/react-query";
import QuickNav from "@components/QuickNav";

interface Props {
    pcData: PlayerCharacter;
    pcList: BaseDetails[];
    selectedPc: {pcId: string | null, setSelectedPcId: (pcId: string) => void};
    queryClient: QueryClient;
}

function Stats({pcData, pcList, selectedPc, queryClient}: Props) { 
    const [editable, setEditable] = useState(false);
    const [showSuccessAlert, setShowSuccessAlert] = useState(false);
    const triggerSuccessAlert = () => {
        setShowSuccessAlert(true);
        setTimeout(() => {
            setShowSuccessAlert(false);
        }, 2000);
    }
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
            await transformAndUpdate(pcData, formData); // todo - reuse this function? or new one needed?
        } catch (e) {
            console.error(e);
            alert(`Update failed. PLease refresh the page and try again.`);
            return;
        }
        setEditable(false);

        queryClient.invalidateQueries();
        triggerSuccessAlert();
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
                <Button type="submit" buttonType={ButtonType.INFO} text="Save Changes" onClick={() => {console.log('clicked.')}}/>
            }
            </form>             
            </>
        );
    }

    return (
        <>
        <div className="main-body">
            <Navbar isSelectedPc={!!selectedPc.pcId}/>
            
            <PageHeaderBarPC
                pcName={`${pcData.baseDetails.name.firstName} ${pcData.baseDetails.name.lastName}`}
                pageName="Stats"
                pcList={pcList}
                selectedPc={selectedPc}
            />

            {showSuccessAlert && <Alert alertText="Update successful." className="successful-alert" iconFile="/images/icons/success-icon.png"/>}

            {/* Ability Scores */}
            { 
                mapAbilityScoreCards(pcData.abilityScores) 
            }
            <div className="div-button">
                <Button buttonType={ButtonType.DANGER} text={editable ? "Cancel" : "Edit Ability Scores"} onClick={() => {
                    setEditable(!editable);
                    setFormData(buildDefaultAbilityScoreFormData(pcData.abilityScores));
                }}/>
            </div>

            <br/>

            <CardSetHorizontal>
                <Card>
                    <h4>AC</h4>
                    <h3>{pcData.baseDetails.armorClass}</h3>
                </Card>
                <Card>
                    <h4>Initiative</h4>
                    <h3>{pcData.abilityScores.data.dexterity.modifier > 0 && '+'}{pcData.abilityScores.data.dexterity.modifier}</h3>
                </Card>
                <Card>
                    <h4>Proficiency Bonus</h4>
                    <h3>+{pcData.baseDetails.proficiencyBonus}</h3>
                </Card>
                <Card>
                    <h4>Speed</h4>
                    <h3>{pcData.baseDetails.speed}</h3>
                </Card>
                <Card>
                    <h4>Passive Wisdom</h4>
                    <h3>{getPassiveWisdom(
                            pcData.abilityScores.data.wisdom.modifier, 
                            pcData.abilityScores.data.wisdom.perception.proficient, 
                            pcData.baseDetails.proficiencyBonus
                        )}
                    </h3>
                </Card>
            </CardSetHorizontal>
        </div>
        <QuickNav/>
        </>
    )
}


export default Stats;
