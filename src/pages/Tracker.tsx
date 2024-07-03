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

function Tracker() {
    const limitedUseFeatures = pc.features.filter(feature => feature.maxUses);

    return (
        <>
            <Navbar/>
            <h1>Tracker</h1>

            <Card>
                <h3>Hit Points</h3>
                <h4>{pc.usableResources.hitPoints.current} / {pc.usableResources.hitPoints.max}</h4>
                {pc.usableResources.hitPoints.temporary > 0 && <h4>+{pc.usableResources.hitPoints.temporary}</h4>}
            </Card>

            {
                pc.usableResources.inspiration > 0 &&
                <Card>
                    <h3>Inspiration</h3>
                    <h4>{pc.usableResources.inspiration}</h4>
                </Card>
            }

            <Card>
                <h3>Weapons</h3>
                {
                    pc.weapons.map(weapon => (
                        <Card>
                            <h4>{weapon.name} ({weapon.type})</h4>
                            <h3>{weapon.damage} {weapon.damageType.toLowerCase()}</h3>
                        </Card>
                    ))
                }
            </Card>

            <Card>
                <h3>Features</h3>
                {
                    limitedUseFeatures.map(feature => (
                        <Card>
                            <h4>{feature.name}</h4>
                            <Toggle label="Uses" count={feature.maxUses!}/>
                            <Refresh refreshRestType={feature.refresh!}/>
                        </Card>
                    ))
                }
            </Card>

            <Card>
                <h3>Hit Dice</h3>
                <p>{pc.usableResources.hitDice.type}</p>
                <Toggle label="Uses" count={pc.usableResources.hitDice.max} defaultPosition="unchecked"/>
            </Card>

            <Card>
                <h3>Death Saves</h3>
                <Toggle label="Successes" count={pc.usableResources.deathSaves.max} defaultPosition="unchecked"/>
                <Toggle label="Failures" count={pc.usableResources.deathSaves.max} defaultPosition="unchecked"/>
            </Card>

            <Card>
                <h3>Gold</h3>
                <p>{pc.usableResources.gold}</p>
            </Card>

            <Footer/>

        </>
    )
}

export default Tracker;
