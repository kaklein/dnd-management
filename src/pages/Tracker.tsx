/**
 * Will contain:
 * - All dynamic fields that may change during a session.
 * - E.g. HP, spells slots, features used per long/short rest, etc.
 */

import Navbar from "../components/Navbar";
import Toggle from "../components/Toggle";
import Card from "../components/cards/Card";
import Refresh from "../components/Refresh";
import Footer from "../components/Footer";

import { OsoniaSilverhand as pc } from "../data/playerCharacters/OsoniaSilverhand";
import { useState} from "react";
import {removeWhiteSpaceAndConvertToLowerCase} from "../components/utils";
import { HashLink as Link } from 'react-router-hash-link';

function Tracker() {
    const rs = pc.usableResources;
    const limitedUseFeatures = pc.features.filter(feature => feature.maxUses);

    // State variables
    const [hitPoints, setHitPoints] = useState(rs.hitPoints.current);
    const [tempHitPoints, setTempHitPoints] = useState(rs.hitPoints.temporary);
    const [gold, setGold] = useState(rs.gold);

    return (
        <>
            <Navbar/>
            <h1>Tracker</h1>

            <Card>
                <h3>Hit Points</h3>
                <form>
                    <input type="number" id="hit-points" defaultValue={hitPoints} min="0" max={rs.hitPoints.max} onChange={ evt => setHitPoints(Number(evt.target.value))}/> / {rs.hitPoints.max}
                    <br/>
                    <label for="temp-hit-points">Temporary Hit Points</label>
                    <br/>
                    <input type="number" id="temp-hit-points" min="0" max="99" defaultValue={tempHitPoints} onChange={ evt => setTempHitPoints(Number(evt.target.value))}/>
                </form>
            </Card>

            {
                rs.inspiration > 0 &&
                <Card>
                    <h3>Inspiration</h3>
                    <h4>{rs.inspiration}</h4>
                </Card>
            }

            {rs.spellSlots?.length > 0 &&
                <Card>
                    <h3>Spell Slots</h3>
                    {
                        rs.spellSlots!.map(spellSlot => (
                            <Card>
                                <h3>{spellSlot.level}</h3>
                                <Toggle label="Slots" count={spellSlot.max} defaultPosition="unchecked"/>
                            </Card>
                        ))
                    }
                    <h4>Available Spells</h4>
                    {
                        pc.spells!.map(spell => (
                            <p>{spell.level}: <Link to={'/details#' + removeWhiteSpaceAndConvertToLowerCase(spell.name)}>{spell.name}</Link></p>
                        ))
                    }
                </Card>
            }


            <Card>
                <h3>Weapons</h3>
                {
                    pc.weapons.map(weapon => (
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
                <p>{rs.hitDice.type}</p>
                <Toggle label="Uses" count={rs.hitDice.max} defaultPosition="unchecked"/>
            </Card>

            <Card>
                <h3>Death Saves</h3>
                <Toggle label="Successes" count={rs.deathSaves.max} defaultPosition="unchecked"/>
                <Toggle label="Failures" count={rs.deathSaves.max} defaultPosition="unchecked"/>
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
