import Navbar from "@components/Navbar";
import Footer from "@components/Footer";
import Card from "@components/cards/Card";
import { formatDataAsTable, orderAndFormatWeaponElements, removeWhiteSpaceAndConvertToLowerCase } from "@components/utils";
import { Spell } from "@models/playerCharacter/Spell";
import { PlayerCharacter } from "@models/playerCharacter/PlayerCharacter";
import PageHeaderBar from "@components/PageHeaderBar";

interface Props {
    pcData: PlayerCharacter;
}

const mapSpells = (spells: Spell[]) => {    
    return (
        spells.map((spell, i) => (
            <Card key={i}>
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

                {spell.sourceUrl &&
                    <p><b>Source URL: </b><a href={spell.sourceUrl} target="_blank">{spell.sourceUrl}</a></p>
                }
            </Card>
        ))
    )
}

function Details({pcData}: Props) {
    return (
        <>
            <Navbar/>

            <PageHeaderBar 
                pcName={`${pcData.baseDetails.name.firstName} ${pcData.baseDetails.name.lastName}`}
                pageName="Details"
            />

            {
                pcData.baseDetails.spells &&
                <Card>
                    <h3>Spells</h3>
                    {mapSpells(pcData.baseDetails.spells)}
                </Card>
            }

            {
                (pcData.features && pcData.features.length > 0) &&
                <Card>
                    <h3>Features</h3>
                    {
                    pcData.features.map(feature => (
                        <Card key={feature.id}>
                            <a id={removeWhiteSpaceAndConvertToLowerCase(feature.data.name)}></a>
                            <h3>{feature.data.name.toUpperCase()}</h3>
                            <p><b>Description: </b>{feature.data.description}</p>
                            <p><b>Source: </b>{feature.data.source}</p>
                            { feature.data.damage && <p><b>Damage: </b>{feature.data.damage} {feature.data.damageType}</p>}
                            { feature.data.saveDC && <p><b>Spell Save DC: </b>{feature.data.saveDC}</p>}
                            { feature.data.sourceUrl && <p><b>Source URL: </b><a href={feature.data.sourceUrl} target="_blank">{feature.data.sourceUrl}</a></p>}
                        </Card>
                    ))
                    }
                </Card>
            }

            <Card>
                <h3>Weapons</h3>
                {
                    pcData.baseDetails.weapons.map((weapon, i) => (
                        <Card key={i}>
                            <a id={removeWhiteSpaceAndConvertToLowerCase(weapon.name)}></a>
                            <h3>{weapon.name}</h3>
                            {formatDataAsTable(orderAndFormatWeaponElements(weapon, pcData))}
                        </Card>
                    ))
                }
            </Card>

            <Card>
                <h3>Equipment</h3>
                {
                    pcData.baseDetails.equipment.map((item, i) =>
                        <Card key={i}>
                            <p>{item.type}</p>
                            {item.description && <p><i>{item.description}</i></p>}
                        </Card>
                    )
                }
            </Card>

            <Card>
                <h3>Languages</h3>
                {
                    pcData.baseDetails.languages.map((language, i) => (
                        <p key={i}>{language}</p>
                    ))
                }
            </Card>

            <Card>
                <h3>Proficiencies</h3>
                {
                    pcData.baseDetails.proficiencies.map((proficiency, i) => (
                        <p key={i}>{proficiency}</p>
                    ))
                }
            </Card>

            <Card>
                <h3>Notes</h3>
                {pcData.baseDetails.notes &&
                    pcData.baseDetails.notes.map((note, i) => (
                        <Card key={i}>
                            <p>{note}</p>
                        </Card>
                    ))
                }
            </Card>

            <Footer/>
        </>
    )
}

export default Details;
