import Navbar from "@components/Navbar";
import Footer from "@components/Footer";
import Card from "@components/cards/Card";
import Refresh from "@components/Refresh";
import { formatDataAsTable, removeWhiteSpaceAndConvertToLowerCase } from "@components/utils";
import { Spell } from "@models/playerCharacter/Spell";
import { PlayerCharacter } from "@models/playerCharacter/PlayerCharacter";

interface Props {
    pcData: PlayerCharacter;
}

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

function Details({pcData}: Props) {
    return (
        <>
            <Navbar/>

            <h1 className="page-title">Details</h1>

            <Card>
                <h3>Spells & Abilities</h3>
                {pcData.baseDetails.spells && mapSpells(pcData.baseDetails.spells)}

                {
                    pcData.features.map(feature => (
                        <Card>
                            <a id={removeWhiteSpaceAndConvertToLowerCase(feature.data.name)}></a>
                            <h3>{feature.data.name.toUpperCase()}</h3>
                            <p><b>Description: </b>{feature.data.description}</p>
                            <p><b>Source: </b>{feature.data.source}</p>
                            { feature.data.damage && <p><b>Damage: </b>{feature.data.damage} {feature.data.damageType}</p>}
                            { feature.data.saveDC && <p><b>Spell Save DC: </b>{feature.data.saveDC}</p>}
                        </Card>
                    ))
                }
            </Card>

            <Card>
                <h3>Weapons</h3>
                {
                    pcData.baseDetails.weapons.map(weapon => (
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
                    pcData.baseDetails.equipment.map(item =>
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
                    pcData.baseDetails.languages.map(language => (
                        <p>{language}</p>
                    ))
                }
            </Card>

            <Card>
                <h3>Proficiencies</h3>
                {
                    pcData.baseDetails.proficiencies.map(proficiency => (
                        <p>{proficiency}</p>
                    ))
                }
            </Card>

            <Card>
                <h3>Other Notes</h3>
                {pcData.baseDetails.extras &&
                    pcData.baseDetails.extras.map(extra => (
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
