import Navbar from "@components/Navbar";
import Card from "@components/cards/Card";
import Refresh from "@components/Refresh";
import Footer from "@components/Footer";
import { 
    buildFeatureCurrentUsesKey, 
    buildSpellSlotsCurrentKey, 
    formatBaseDetailsUpdates, 
    formatFeaturesUpdates, 
    formatSpellSlotsUpdates,
    formatDataAsTable,
    getFeatureFormData, 
    getSpellSlotFormData, 
    removeWhiteSpaceAndConvertToLowerCase 
} from "@components/utils";
import { useEffect, useState} from "react";
import { HashLink as Link } from 'react-router-hash-link';
import { updateById, updateDataByPcId } from "@services/firestore/crud/update";
import ItemUseToggle from "@components/ItemUseToggle";
import { BaseDetails, PlayerCharacter } from "@models/playerCharacter/PlayerCharacter";
import { QueryClient } from "@tanstack/react-query";
import Alert from "@components/Alert";
import { CollectionName } from "@services/firestore/enum/CollectionName";
import { determineAttackBonus, formatBonus } from "../utils";
import PageHeaderBarPC from "@components/headerBars/PageHeaderBarPC";
import Button, { ButtonType } from "@components/Button";

interface Props {
    pcData: PlayerCharacter;
    queryClient: QueryClient;
    pcList: BaseDetails[];
    selectedPc: {pcId: string | null, setSelectedPcId: (pcId: string) => void}
}

function Tracker({pcData, queryClient, pcList, selectedPc}: Props) {
    const [showSuccessAlert, setShowSuccessAlert] = useState(false);
    const triggerSuccessAlert = () => {
        setShowSuccessAlert(true);
        setTimeout(() => {
            setShowSuccessAlert(false);
        }, 2000);
    };
    
    const getLimitedUseFeatures = (pcData: PlayerCharacter) => {
        return pcData.features.filter(feature => feature.data.maxUses);
    }

    const getDefaultFormData = (pcData: PlayerCharacter) => {
        return {
            hitPointsCurrent: pcData.baseDetails.usableResources.hitPoints.current,
            hitPointsTemporary: pcData.baseDetails.usableResources.hitPoints.temporary,
            hitDiceCurrent: pcData.baseDetails.usableResources.hitDice.current,
            deathSavesSuccesses: pcData.baseDetails.usableResources.deathSaves.successesRemaining,
            deathSavesFailures: pcData.baseDetails.usableResources.deathSaves.failuresRemaining,
            gold: pcData.baseDetails.usableResources.gold,
            inspiration: pcData.baseDetails.usableResources.inspiration,
            ...getSpellSlotFormData(pcData.spellSlots ?? []),
            ...getFeatureFormData(getLimitedUseFeatures(pcData))
        }
    }
    const [formData, setFormData] = useState(getDefaultFormData(pcData));
    const [limitedUseFeatures, setLimitedUseFeatures] = useState(getLimitedUseFeatures(pcData));

    useEffect(() => {
        setLimitedUseFeatures(getLimitedUseFeatures(pcData));
        setFormData(getDefaultFormData(pcData));
    }, [pcData]);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setFormData((prevFormData: any) => ({...prevFormData, [name]: value}));
    }

    const handleSubmit = async (event: any) => {
        event.preventDefault();
        const baseDetailsUpdates = formatBaseDetailsUpdates(formData);
        const featuresUpdates = formatFeaturesUpdates(formData);
        const spellSlotsUpdate = formatSpellSlotsUpdates(formData);

        try {
            await Promise.all([
                updateDataByPcId(CollectionName.PC_BASE_DETAILS, pcData.baseDetails.pcId, baseDetailsUpdates),
                ...featuresUpdates.map(f => updateById(CollectionName.FEATURES, f.docId, f.updates)),
                ...spellSlotsUpdate.map(s => updateById(CollectionName.SPELL_SLOTS, s.docId, s.updates))
            ]).then();
        } catch (e: any) {
            console.error(e);
            alert('We encountered an error saving your changes. Please refresh the page and try again.');
            return;
        }
        queryClient.invalidateQueries();
        triggerSuccessAlert();
    }

    return (
        <>
            <Navbar isSelectedPc={!!selectedPc.pcId}/>

            <PageHeaderBarPC 
                pcName={`${pcData.baseDetails.name.firstName} ${pcData.baseDetails.name.lastName}`}
                pageName="Tracker"
                pcList={pcList}
                selectedPc={selectedPc}
            />

            <form onSubmit={handleSubmit}>
                <div>
                    <Button
                        text="Save"
                        buttonType={ButtonType.SUCCESS}
                        type="submit"
                        customClass="tracker-save-button"
                        onClick={() => {}}
                    />
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

                    {
                        (pcData.spellSlots && pcData.spellSlots.filter(slot => slot.data.max > 0).length > 0) &&
                        <Card>
                            <h3>Spell Slots</h3>
                            {
                                pcData.spellSlots.filter(slot => slot.data.max > 0).map(spellSlot => (
                                    <Card key={spellSlot.id}>
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
                        </Card>
                    }   

                    {
                        (pcData.baseDetails.spells && pcData.baseDetails.spells.length > 0)  &&
                        <Card>
                            <h3>Available Spells</h3>
                            {
                                pcData.baseDetails.spells!.sort((a,b) => {
                                    if (a.level < b.level) return -1;
                                    return 1;
                                }).map((spell, i) => (
                                    <p key={i}>
                                        {spell.level}: 
                                        <Link className="text-link" to={'/details#' + removeWhiteSpaceAndConvertToLowerCase(spell.name)}>{spell.name}</Link>
                                         | Attack Bonus +{pcData.abilityScores[spell.spellCastingAbility].modifier + pcData.baseDetails.proficiencyBonus}
                                    </p>
                                ))
                            }
                        </Card>
                    }
                
                    <Card>
                        <h3>Weapons</h3>
                        {
                            pcData.baseDetails.weapons.map((weapon, i) => (
                                <Card key={i}>
                                    <Link className="text-link" to={'/details#' + removeWhiteSpaceAndConvertToLowerCase(weapon.name)}><h4>{weapon.name} ({weapon.type})</h4></Link>
                                    {
                                        formatDataAsTable({
                                            ['Attack Bonus']: `${formatBonus(determineAttackBonus(weapon, pcData) + pcData.baseDetails.proficiencyBonus)}`,
                                            Damage: `${weapon.damage} ${formatBonus(determineAttackBonus(weapon, pcData), false)} ${weapon.damageType.toLowerCase()}`
                                        })
                                    }
                                </Card>
                            ))
                        }
                    </Card>

                    <Card>
                        <h3>Abilities</h3>
                        {
                            limitedUseFeatures.map(feature => (
                                <Card key={feature.id}>
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