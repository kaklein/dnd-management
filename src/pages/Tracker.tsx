import Navbar from "@components/Navbar";
import Card from "@components/cards/Card";
import Refresh from "@components/Refresh";
import Footer from "@components/Footer";
import { buildFeatureCurrentUsesKey, buildSpellSlotsCurrentKey, formatBaseDetailsUpdates, formatFeaturesUpdates, formatSpellSlotsUpdates, getFeatureFormData, getSpellSlotFormData, removeWhiteSpaceAndConvertToLowerCase } from "@components/utils";
import { useState} from "react";
import { HashLink as Link } from 'react-router-hash-link';
import { updateById, updateDataByPcId } from "@services/firestore/crud/update";
import ItemUseToggle from "@components/ItemUseToggle";
import { PlayerCharacter } from "@models/playerCharacter/PlayerCharacter";
import { QueryClient } from "@tanstack/react-query";
import Alert from "@components/Alert";
import { CollectionName } from "@services/firestore/enum/CollectionName";

interface Props {
    pcData: PlayerCharacter;
    queryClient: QueryClient;
}

function Tracker({pcData, queryClient}: Props) {
    const [showSuccessAlert, setShowSuccessAlert] = useState(false);
    const triggerSuccessAlert = () => {
        setShowSuccessAlert(true);
        setTimeout(() => {
            setShowSuccessAlert(false);
        }, 2000);
    }
    
    const limitedUseFeatures = pcData.features.filter(feature => feature.data.maxUses);

    const defaultFormData = {
        hitPointsCurrent: pcData.baseDetails.usableResources.hitPoints.current,
        hitPointsTemporary: pcData.baseDetails.usableResources.hitPoints.temporary,
        hitDiceCurrent: pcData.baseDetails.usableResources.hitDice.current,
        deathSavesSuccesses: pcData.baseDetails.usableResources.deathSaves.successesRemaining,
        deathSavesFailures: pcData.baseDetails.usableResources.deathSaves.failuresRemaining,
        gold: pcData.baseDetails.usableResources.gold,
        inspiration: pcData.baseDetails.usableResources.inspiration,
        ...getSpellSlotFormData(pcData.spellSlots ?? []),
        ...getFeatureFormData(limitedUseFeatures)
    }
    const [formData, setFormData] = useState(defaultFormData);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setFormData((prevFormData: any) => ({...prevFormData, [name]: value}));
    }

    const handleSubmit = async (event: any) => {
        event.preventDefault();
        const baseDetailsUpdates = formatBaseDetailsUpdates(formData);
        const featuresUpdates = formatFeaturesUpdates(formData);
        const spellSlotsUpdate = formatSpellSlotsUpdates(formData);

        await Promise.all([
            updateDataByPcId(CollectionName.PC_BASE_DETAILS, pcData.baseDetails.pcId, baseDetailsUpdates),
            ...featuresUpdates.map(f => updateById(CollectionName.FEATURES, f.docId, f.updates)),
            ...spellSlotsUpdate.map(s => updateById(CollectionName.SPELL_SLOTS, s.docId, s.updates))
        ]).then();
        queryClient.invalidateQueries();
        triggerSuccessAlert();
    }

    return (
        <>
            <Navbar/>

            <h1 className="page-title">Tracker</h1>

            <form onSubmit={handleSubmit}>
                <div>
                    <button type="submit" id="tracker-save-button" className="btn btn-success">Save</button>
                    {showSuccessAlert && <Alert alertText="Save successful." className="successful-alert" iconFile="/images/icons/success-icon.png"/>}
                    <Card>
                        <h3>Hit Points</h3>
                        <div className="inline">
                            <input
                            className="number-input"
                            type="number" 
                            id="hitPointsCurrent" 
                            name="hitPointsCurrent" 
                            value={formData.hitPointsCurrent} 
                            min="0" 
                            max={pcData.baseDetails.usableResources.hitPoints.max} 
                            onChange={handleChange}
                            /> 
                            <p className="inline hp-total">&nbsp; / {pcData.baseDetails.usableResources.hitPoints.max}</p>
                        </div>              
                        <br/>
                        <label htmlFor="hitPointsTemporary">Temporary Hit Points</label>
                        <br/>
                        <input
                            className="number-input"
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
                            className="number-input"
                            type="number"
                            min="0"
                            max="10"
                            id="inspiration"
                            name="inspiration"
                            value={formData.inspiration}
                            onChange={handleChange}
                        />
                    </Card>

                    <Card>
                        <h3>Spell Slots</h3>
                        {
                            pcData.spellSlots?.map(spellSlot => (
                                <Card>
                                    <h3>{spellSlot.data.level}</h3>
                                    <ItemUseToggle
                                        itemLabel={removeWhiteSpaceAndConvertToLowerCase(spellSlot.data.level)}
                                        formDataName={buildSpellSlotsCurrentKey(spellSlot)}
                                        maxUses={spellSlot.data.max}
                                        currentUses={spellSlot.data.current}
                                        onChange={handleChange}
                                    />
                                </Card>
                            ))
                        }
                        <h4>Available Spells</h4>
                        {
                            pcData.baseDetails.spells!.map(spell => (
                                <p>{spell.level}: <Link className="text-link" to={'/details#' + removeWhiteSpaceAndConvertToLowerCase(spell.name)}>{spell.name}</Link></p>
                            ))
                        }
                    </Card>
                
                    <Card>
                        <h3>Weapons</h3>
                        {
                            pcData.baseDetails.weapons.map(weapon => (
                                <Card>
                                    <Link className="text-link" to={'/details#' + removeWhiteSpaceAndConvertToLowerCase(weapon.name)}><h4>{weapon.name} ({weapon.type})</h4></Link>
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
                                    <Link className="text-link" to={'/details#' + removeWhiteSpaceAndConvertToLowerCase(feature.data.name)}><h4>{feature.data.name}</h4></Link>
                                    <ItemUseToggle
                                        itemLabel={removeWhiteSpaceAndConvertToLowerCase(feature.data.name)}
                                        formDataName={buildFeatureCurrentUsesKey(feature)}
                                        maxUses={feature.data.maxUses!}
                                        currentUses={formData[buildFeatureCurrentUsesKey(feature)]}
                                        onChange={handleChange}
                                    />
                                    <Refresh refreshRestType={feature.data.refresh!}/>
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
                            className="number-input"
                            type="number"
                            id="gold"
                            name="gold"
                            min="0"
                            max="99999"
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
