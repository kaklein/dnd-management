import Navbar from "../components/Navbar";
import AbilityCard from "../components/cards/AbilityCard";
import {AbilityScores} from "../models/playerCharacter/AbilityScores";
import Card from "../components/cards/Card";
import CardSetHorizontal from "../components/cards/CardSetHorizontal";
import { loadData } from "../services/firestore/loadData";
import { useEffect, useState } from "react";
import { EmptyPC } from "../data/playerCharacters/EmptyPC";

import Footer from "../components/Footer";

function Stats() {
    const [pcData, setPcData] = useState(EmptyPC);
    useEffect(() => {
        loadData().then(data => setPcData(data));
    }, []);

    const removeBaseStatsFromAbilityObject = (abilityObject: {score: number, modifier: number, [key: string]: number;}) => {
        const strippedObj = JSON.parse(JSON.stringify(abilityObject));
        delete strippedObj.score;
        delete strippedObj.modifier;
        return strippedObj;
    }

    //TODO: put abilities in set order
    const mapAbilityScoreCards = (abilityScores: AbilityScores) => {
        return (
            <>
                <AbilityCard
                    abilityName="STRENGTH"
                    score={abilityScores.strength.score}
                    modifier={abilityScores.strength.modifier}
                    data={removeBaseStatsFromAbilityObject(abilityScores.strength)}
                />
                <AbilityCard
                    abilityName="DEXTERITY"
                    score={abilityScores.dexterity.score}
                    modifier={abilityScores.dexterity.modifier}
                    data={removeBaseStatsFromAbilityObject(abilityScores.dexterity)}
                /> 
                <AbilityCard
                    abilityName="CONSTITUTION"
                    score={abilityScores.constitution.score}
                    modifier={abilityScores.constitution.modifier}
                    data={removeBaseStatsFromAbilityObject(abilityScores.constitution)}
                />
                <AbilityCard
                    abilityName="INTELLIGENCE"
                    score={abilityScores.intelligence.score}
                    modifier={abilityScores.intelligence.modifier}
                    data={removeBaseStatsFromAbilityObject(abilityScores.intelligence)}
                />
                <AbilityCard
                    abilityName="WISDOM"
                    score={abilityScores.wisdom.score}
                    modifier={abilityScores.wisdom.modifier}
                    data={removeBaseStatsFromAbilityObject(abilityScores.wisdom)}
                />
                <AbilityCard
                    abilityName="CHARISMA"
                    score={abilityScores.charisma.score}
                    modifier={abilityScores.charisma.modifier}
                    data={removeBaseStatsFromAbilityObject(abilityScores.charisma)}
                />               
            </>
        );
    }

    return (
        <>
            <Navbar/>
            <h1>Stats</h1>

            <CardSetHorizontal>
                <Card>
                    <h3>AC</h3>
                    <h3>{pcData.baseDetails.armorClass}</h3>
                </Card>
                <Card>
                    <h3>Initiative</h3>
                    <h3>{pcData.baseDetails.initiative}</h3>
                </Card>
                <Card>
                    <h3>Speed</h3>
                    <h3>{pcData.baseDetails.speed}</h3>
                </Card>
            </CardSetHorizontal>

            <CardSetHorizontal>
                <Card>
                    <h3>Proficiency Bonus</h3>
                    <h3>{pcData.baseDetails.proficiencyBonus}</h3>
                </Card>
                <Card>
                    <h3>Passive Wisdom</h3>
                    <h3>{pcData.baseDetails.passiveWisdom}</h3>
                </Card>
            </CardSetHorizontal>

            {/* Ability Scores */}
            { 
                mapAbilityScoreCards(pcData.abilityScores) 
            }

            <Footer/>
        </>
    )
}


export default Stats;
