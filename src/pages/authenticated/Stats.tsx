import Navbar from "@components/Navbar";
import Footer from "@components/Footer";
import AbilityCard from "@components/cards/AbilityCard";
import Card from "@components/cards/Card";
import CardSetHorizontal from "@components/cards/CardSetHorizontal";
import { AbilityScores } from "@models/playerCharacter/AbilityScores";
import { PlayerCharacter } from "@models/playerCharacter/PlayerCharacter";
import PageHeaderBar from "@components/PageHeaderBar";
import { orderAbilityCardElements } from "@components/utils";
import { Ability } from "@models/enum/Ability";

interface Props {
    pcData: PlayerCharacter;
}

function Stats({pcData}: Props) {
    const mapAbilityScoreCards = (abilityScores: AbilityScores) => {
        return (
            <>
                <AbilityCard
                    abilityName="STRENGTH"
                    score={abilityScores.strength.score}
                    modifier={abilityScores.strength.modifier}
                    data={orderAbilityCardElements(abilityScores, Ability.STR)}
                />
                <AbilityCard
                    abilityName="DEXTERITY"
                    score={abilityScores.dexterity.score}
                    modifier={abilityScores.dexterity.modifier}
                    data={orderAbilityCardElements(abilityScores, Ability.DEX)}
                /> 
                <AbilityCard
                    abilityName="CONSTITUTION"
                    score={abilityScores.constitution.score}
                    modifier={abilityScores.constitution.modifier}
                    data={orderAbilityCardElements(abilityScores, Ability.CON)}
                />
                <AbilityCard
                    abilityName="INTELLIGENCE"
                    score={abilityScores.intelligence.score}
                    modifier={abilityScores.intelligence.modifier}
                    data={orderAbilityCardElements(abilityScores, Ability.INT)}
                />
                <AbilityCard
                    abilityName="WISDOM"
                    score={abilityScores.wisdom.score}
                    modifier={abilityScores.wisdom.modifier}
                    data={orderAbilityCardElements(abilityScores, Ability.WIS)}
                />
                <AbilityCard
                    abilityName="CHARISMA"
                    score={abilityScores.charisma.score}
                    modifier={abilityScores.charisma.modifier}
                    data={orderAbilityCardElements(abilityScores, Ability.CHA)}
                />               
            </>
        );
    }

    return (
        <>
            <Navbar/>
            
            <PageHeaderBar 
                pcName={`${pcData.baseDetails.name.firstName} ${pcData.baseDetails.name.lastName}`}
                pageName="Stats"
            />

            {/* Ability Scores */}
            { 
                mapAbilityScoreCards(pcData.abilityScores) 
            }

            <br/>

            <CardSetHorizontal>
                <Card>
                    <h4>AC</h4>
                    <h3>{pcData.baseDetails.armorClass}</h3>
                </Card>
                <Card>
                    <h4>Initiative</h4>
                    <h3>+{pcData.baseDetails.initiative}</h3>
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
                    <h3>{pcData.baseDetails.passiveWisdom}</h3>
                </Card>
            </CardSetHorizontal>

            <Footer/>
        </>
    )
}


export default Stats;
