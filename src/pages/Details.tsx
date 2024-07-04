/**
 * Will contain:
 * - Detailed descriptions of all features/spells/etc.
 */
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Card from "../components/cards/Card";

import { OsoniaSilverhand as pc } from "../data/playerCharacters/OsoniaSilverhand";
import Refresh from "../components/Refresh";
import {Spell} from "../models/playerCharacter/Spell";
import {formatDataAsTable, removeWhiteSpaceAndConvertToLowerCase} from "../components/utils";

const mapSpells = (spells: Spell[]) => {
    return (
        spells.map(spell => (
            <Card>
                <a id={removeWhiteSpaceAndConvertToLowerCase(spell.name)}></a>
                <h3>{spell.name.toUpperCase()}</h3>

                <p><b>Description: </b>{spell.description}</p>

                <p><b>Type: </b>{spell.level}</p>

                {spell.damage &&
                    <p><b>Damage: </b>{spell.damage} {spell.damageType}</p>
                }

                {spell.saveDC &&
                    <p><b>Spell Save DC: </b>{spell.saveDC}</p>
                }

                {spell.attackBonus &&
                    <p><b>Attack bonus: </b>+{spell.attackBonus}</p>
                }

                {spell.spellCastingAbility &&
                    <p><b>Spellcasting ability: </b>{spell.spellCastingAbility}</p>
                }

                {spell.refresh &&
                    <Refresh refreshRestType={spell.refresh}/>
                }
            </Card>
        ))
    )
}

function Details() {
    return (
        <>
            <Navbar/>

            <h1>Details</h1>

            <Card>
                <h3>Spells & Abilities</h3>
                {pc.spells && mapSpells(pc.spells)}

                {
                    pc.features.map(feature => (
                        <Card>
                            <a id={removeWhiteSpaceAndConvertToLowerCase(feature.name)}></a>
                            <h3>{feature.name.toUpperCase()}</h3>
                            <p><b>Description: </b>{feature.description}</p>
                            <p><b>Source: </b>{feature.source}</p>
                            { feature.damage && <p><b>Damage: </b>{feature.damage} {feature.damageType}</p>}
                            { feature.saveDC && <p><b>Spell Save DC: </b>{feature.saveDC}</p>}
                        </Card>
                    ))
                }
            </Card>

            <Card>
                <h3>Weapons</h3>
                {
                    pc.weapons.map(weapon => (
                        <Card>
                            <a id={removeWhiteSpaceAndConvertToLowerCase(weapon.name)}></a>
                            <h3>{weapon.name}</h3>
                            {formatDataAsTable(weapon)}
                        </Card>
                    ))
                }
            </Card>

            <Card>
                <h3>Equipment</h3>
                {
                    pc.equipment.map(item =>
                        <Card>
                            <p>{item.type}</p>
                            {item.description && <p><i>{item.description}</i></p>}
                        </Card>
                    )
                }
            </Card>

            <Card>
                <h3>Languages</h3>
                {
                    pc.languages.map(language => (
                        <p>{language}</p>
                    ))
                }
            </Card>

            <Card>
                <h3>Proficiencies</h3>
                {
                    pc.proficiencies.map(proficiency => (
                        <p>{proficiency}</p>
                    ))
                }
            </Card>

            <Card>
                <h3>Other Notes</h3>
                {pc.extras &&
                    pc.extras.map(extra => (
                        <Card>
                            <p>{extra}</p>
                        </Card>
                    ))
                }
            </Card>

            <Footer/>
        </>
    )
}

export default Details;
