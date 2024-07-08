import Navbar from "../components/Navbar";
import Toggle from "../components/Toggle";
import Card from "../components/cards/Card";
import Refresh from "../components/Refresh";
import Footer from "../components/Footer";

import { useEffect, useState} from "react";
import {removeWhiteSpaceAndConvertToLowerCase} from "../components/utils";
import { HashLink as Link } from 'react-router-hash-link';
import { loadData } from "../services/firestore/loadData";
import { EmptyPC } from "../data/playerCharacters/EmptyPC";

function Tracker() {
    const [pcData, setPcData] = useState(EmptyPC);
    useEffect(() => {
        loadData().then(data => setPcData(data));
    }, []);

    const limitedUseFeatures = pcData.baseDetails.features.filter(feature => feature.maxUses);

    // State variables
    const [hitPoints, setHitPoints] = useState(pcData.baseDetails.usableResources.hitPoints.current);
    const [tempHitPoints, setTempHitPoints] = useState(pcData.baseDetails.usableResources.hitPoints.temporary);
    const [gold, setGold] = useState(pcData.baseDetails.usableResources.gold);

    return (
        <>
            <Navbar/>
            <h1>Tracker</h1>

            <Card>
                <h3>Hit Points</h3>
                <form>
                    <input type="number" id="hit-points" defaultValue={hitPoints} min="0" max={pcData.baseDetails.usableResources.hitPoints.max} onChange={ evt => setHitPoints(Number(evt.target.value))}/> / {pcData.baseDetails.usableResources.hitPoints.max}
                    <br/>
                    <label htmlFor="temp-hit-points">Temporary Hit Points</label>
                    <br/>
                    <input type="number" id="temp-hit-points" min="0" max="99" defaultValue={tempHitPoints} onChange={ evt => setTempHitPoints(Number(evt.target.value))}/>
                </form>
            </Card>

            {
                pcData.baseDetails.usableResources.inspiration > 0 &&
                <Card>
                    <h3>Inspiration</h3>
                    <h4>{pcData.baseDetails.usableResources.inspiration}</h4>
                </Card>
            }

            {pcData.baseDetails.usableResources.spellSlots &&
                <Card>
                    <h3>Spell Slots</h3>
                    {
                        pcData.baseDetails.usableResources.spellSlots?.map(spellSlot => (
                            <Card>
                                <h3>{spellSlot.level}</h3>
                                <Toggle label="Slots" count={spellSlot.max} defaultPosition="unchecked"/>
                            </Card>
                        ))
                    }
                    <h4>Available Spells</h4>
                    {
                        pcData.baseDetails.spells!.map(spell => (
                            <p>{spell.level}: <Link to={'/details#' + removeWhiteSpaceAndConvertToLowerCase(spell.name)}>{spell.name}</Link></p>
                        ))
                    }
                </Card>
            }


            <Card>
                <h3>Weapons</h3>
                {
                    pcData.baseDetails.weapons.map(weapon => (
                        <Card>
                            <Link to={'/details#' + removeWhiteSpaceAndConvertToLowerCase(weapon.name)}><h4>{weapon.name} ({weapon.type})</h4></Link>
                            <h3>{weapon.damage} {weapon.damageType.toLowerCase()}</h3>
                        </Card>
                    ))
                }
            </Card>

            <Card>
                <h3>Abilities</h3>
                {
                    limitedUseFeatures.map(feature => (
                        <Card>
                            <Link to={'/details#' + removeWhiteSpaceAndConvertToLowerCase(feature.name)}><h4>{feature.name}</h4></Link>
                            <Toggle label="Uses" count={feature.maxUses!}/>
                            <Refresh refreshRestType={feature.refresh!}/>
                        </Card>
                    ))
                }
            </Card>

            <Card>
                <h3>Hit Dice</h3>
                <p>{pcData.baseDetails.usableResources.hitDice.type}</p>
                <Toggle label="Uses" count={pcData.baseDetails.usableResources.hitDice.max} defaultPosition="unchecked"/>
            </Card>

            <Card>
                <h3>Death Saves</h3>
                <Toggle label="Successes" count={pcData.baseDetails.usableResources.deathSaves.max} defaultPosition="unchecked"/>
                <Toggle label="Failures" count={pcData.baseDetails.usableResources.deathSaves.max} defaultPosition="unchecked"/>
            </Card>

            <Card>
                <h3>Gold</h3>
                <input type="number" defaultValue={gold} onChange={evt => setGold(Number(evt.target.value))}/>
            </Card>

            <Footer/>

        </>
    )
}

export default Tracker;
