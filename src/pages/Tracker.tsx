import Navbar from "@components/Navbar";
import Toggle from "@components/Toggle";
import Card from "@components/cards/Card";
import Refresh from "@components/Refresh";
import Footer from "@components/Footer";
import { formatFormData, removeWhiteSpaceAndConvertToLowerCase } from "@components/utils";
import { useState} from "react";
import { HashLink as Link } from 'react-router-hash-link';
import { updateDataByPcId } from "@services/firestore/crud/update";
import { db } from "../firebase";
import ItemUseToggle from "@components/ItemUseToggle";
import { PlayerCharacter } from "@models/playerCharacter/PlayerCharacter";
import { QueryClient } from "@tanstack/react-query";

interface Props {
    pcData: PlayerCharacter;
    queryClient: QueryClient;
}

function Tracker({pcData, queryClient}: Props) {
    const limitedUseFeatures = pcData.baseDetails.features.filter(feature => feature.maxUses);

    const defaultFormData = {
        hitPointsCurrent: pcData.baseDetails.usableResources.hitPoints.current,
        hitPointsTemporary: pcData.baseDetails.usableResources.hitPoints.temporary,
        hitDiceCurrent: pcData.baseDetails.usableResources.hitDice.current,
        deathSavesSuccesses: pcData.baseDetails.usableResources.deathSaves.successesRemaining,
        deathSavesFailures: pcData.baseDetails.usableResources.deathSaves.failuresRemaining,
        gold: pcData.baseDetails.usableResources.gold,
        inspiration: pcData.baseDetails.usableResources.inspiration,
        // spellSlotsL1: pcData.baseDetails.usableResources.spellSlots?.filter(spell => spell.level == SpellLevel.L1)[0].current,
        // spellSlotsL2: pcData.baseDetails.usableResources.spellSlots?.filter(spell => spell.level == SpellLevel.L2)[0].current,
        // spellSlotsL3: pcData.baseDetails.usableResources.spellSlots?.filter(spell => spell.level == SpellLevel.L3)[0].current,
        // spellSlotsL4: pcData.baseDetails.usableResources.spellSlots?.filter(spell => spell.level == SpellLevel.L4)[0].current,
        // spellSlotsL5: pcData.baseDetails.usableResources.spellSlots?.filter(spell => spell.level == SpellLevel.L5)[0].current,
        // features: limitedUseFeatures.map(feature => ({
        //     name: feature.name,
        //     currentUses: feature.currentUses
        // }))
    }
    const [formData, setFormData] = useState(defaultFormData);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setFormData((prevFormData) => ({...prevFormData, [name]: value}));
    }

    const handleSubmit = async (event: any) => {
        event.preventDefault();
        const updates = formatFormData(formData);
        await updateDataByPcId(db, 'pcBaseDetails', pcData.baseDetails.pcId, updates);
        queryClient.invalidateQueries();
    }

    return (
        <>
            <Navbar/>

            <h1>Tracker</h1>

            <form onSubmit={handleSubmit}>
                <div>
                    <button type="submit" id="tracker-save-button" className="btn btn-success">Save</button>
                    <Card>
                        <h3>Hit Points</h3>
                        <input
                            type="number" 
                            id="hitPointsCurrent" 
                            name="hitPointsCurrent" 
                            value={formData.hitPointsCurrent} 
                            min="0" 
                            max={pcData.baseDetails.usableResources.hitPoints.max} 
                            onChange={handleChange}
                        /> / {pcData.baseDetails.usableResources.hitPoints.max}                        
                        <br/>
                        <label htmlFor="hitPointsTemporary">Temporary Hit Points</label>
                        <br/>
                        <input
                            type="number"
                            id="hitPointsTemporary"
                            name="hitPointsTemporary"
                            min="0"
                            max="99" 
                            value={formData.hitPointsTemporary}
                            onChange={handleChange}
                        />
                    </Card>

                    <Card>
                        <label htmlFor="inspiration">Inspiration</label>
                        <input
                            type="number"
                            id="inspiration"
                            name="inspiration"
                            value={formData.inspiration}
                            onChange={handleChange}
                        />
                    </Card>

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
                        <ItemUseToggle 
                            itemLabel="Hit Dice"
                            formDataName="hitDiceCurrent"
                            maxUses={pcData.baseDetails.usableResources.hitDice.max}
                            currentUses={formData.hitDiceCurrent}
                            onChange={handleChange}
                        />
                    </Card>

                    <Card>
                        <h3>Death Saves</h3>
                        <h4>Successes</h4>
                        <ItemUseToggle
                            itemLabel="Death Save Successes"
                            formDataName="deathSavesSuccesses"
                            maxUses={pcData.baseDetails.usableResources.deathSaves.max}
                            currentUses={formData.deathSavesSuccesses}
                            onChange={handleChange}
                        />
                        <h4>Failures</h4>
                        <ItemUseToggle
                            itemLabel="Death Save Failures"
                            formDataName="deathSavesFailures"
                            maxUses={pcData.baseDetails.usableResources.deathSaves.max}
                            currentUses={formData.deathSavesFailures}
                            onChange={handleChange}
                        />
                    </Card>

                    <Card>
                        <h3>Gold</h3>
                        <input
                            type="number"
                            id="gold"
                            name="gold"
                            value={formData.gold}
                            onChange={handleChange}
                        />
                    </Card>
                </div>               
            </form>

            <Footer/>

        </>
    )
}

export default Tracker;
