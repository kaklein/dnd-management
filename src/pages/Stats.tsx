import Navbar from "../components/Navbar";
import AbilityCard from "../components/cards/AbilityCard";
import {AbilityScores} from "../models/playerCharacter/AbilityScores";
import Card from "../components/cards/Card";
import CardSetHorizontal from "../components/cards/CardSetHorizontal";

import { OsoniaSilverhand as pc } from "../data/playerCharacters/OsoniaSilverhand";
import Footer from "../components/Footer";

function Stats() {
    const removeBaseStatsFromAbilityObject = (abilityObject: {score: number, modifier: number, [key: string]: number;}) => {
        const strippedObj = JSON.parse(JSON.stringify(abilityObject));
        delete strippedObj.score;
        delete strippedObj.modifier;
        return strippedObj;
    }

    const mapAbilityScoreCards = (abilityScores: AbilityScores) => {
        const entries = Object.entries(abilityScores);
        return entries.map((abilityScore) => (
            <AbilityCard
                abilityName={abilityScore[0].toUpperCase()}
                score={abilityScore[1].score}
                modifier={abilityScore[1].modifier}
                data={removeBaseStatsFromAbilityObject(abilityScore[1])}
            />
        ));
    }

    return (
        <>
            <Navbar/>
            <h1>Stats</h1>

            <CardSetHorizontal>
                <Card>
                    <h3>AC</h3>
                    <h3>{pc.armorClass}</h3>
                </Card>
                <Card>
                    <h3>Initiative</h3>
                    <h3>{pc.initiative}</h3>
                </Card>
                <Card>
                    <h3>Speed</h3>
                    <h3>{pc.speed}</h3>
                </Card>
            </CardSetHorizontal>

            <CardSetHorizontal>
                <Card>
                    <h3>Proficiency Bonus</h3>
                    <h3>{pc.proficiencyBonus}</h3>
                </Card>
                <Card>
                    <h3>Passive Wisdom</h3>
                    <h3>{pc.passiveWisdom}</h3>
                </Card>
            </CardSetHorizontal>

            {/* Ability Scores */}
            { mapAbilityScoreCards(pc.abilityScores) }

            <Footer/>
        </>
    )
}


export default Stats;
