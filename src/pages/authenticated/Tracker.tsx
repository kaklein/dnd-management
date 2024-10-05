import Navbar from "@components/Navbar";
import Card from "@components/cards/Card";
import Refresh from "@components/Refresh";
import { 
    buildFeatureCurrentUsesKey, 
    buildSpellSlotsCurrentKey, 
    formatBaseDetailsUpdates, 
    formatFeaturesUpdates, 
    formatSpellSlotsUpdates,
    removeWhiteSpaceAndConvertToLowerCase 
} from "@components/utils";
import { useEffect, useState} from "react";
import { HashLink as Link } from 'react-router-hash-link';
import { updateById, updateDataByPcId } from "@services/firestore/crud/update";
import ItemUseToggle from "@components/ItemUseToggle";
import { BaseDetails, PlayerCharacter } from "@models/playerCharacter/PlayerCharacter";
import { QueryClient } from "@tanstack/react-query";
import { CollectionName } from "@services/firestore/enum/CollectionName";
import { determineAttackBonus, formatBonus, formatWeaponDisplayTitle, getDefaultFormData, getHPRange, getLimitedUseFeatures, triggerSuccessAlert } from "../utils";
import PageHeaderBarPC from "@components/headerBars/PageHeaderBarPC";
import QuickNav from "@components/QuickNav";
import SuccessAlert from "@components/alerts/SuccessAlert";
import { UserRole } from "@services/firestore/enum/UserRole";
import HPModal from "@components/modals/HPModal";
import GoldModal from "@components/modals/GoldModal";
import Popover from "@components/modals/Popover";
import WeaponContentPopover from "@components/popovers/WeaponPopoverContent";
import AboutFooter from "@components/AboutFooter";
import SpellsTrackerComponent from "@components/SpellsTrackerComponent";
import { RestType } from "@models/enum/RestType";

interface Props {
    pcData: PlayerCharacter;
    queryClient: QueryClient;
    pcList: BaseDetails[];
    selectedPc: {pcId: string | null, setSelectedPcId: (pcId: string) => void}
    userRole: UserRole | undefined;
}

function Tracker({pcData, queryClient, pcList, selectedPc, userRole}: Props) {
    const conModifier = pcData.abilityScores.data.constitution.modifier;
   
    const [showSuccessAlert, setShowSuccessAlert] = useState(false);
    
    const [formData, setFormData] = useState(getDefaultFormData(pcData));
    const [limitedUseFeatures, setLimitedUseFeatures] = useState(getLimitedUseFeatures(pcData));
    const [hpModalAction, setHPModalAction] = useState('');
    const [goldModalAction, setGoldModalAction] = useState('');

    useEffect(() => {
        setLimitedUseFeatures(getLimitedUseFeatures(pcData));
        setFormData(getDefaultFormData(pcData));
    }, [pcData]);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setFormData((prevFormData: any) => ({...prevFormData, [name]: value}));
    }

    const handleSubmit = async (event: any, explicitFormData?: any) => {
        event.preventDefault();
        const baseDetailsUpdates = formatBaseDetailsUpdates(explicitFormData ?? formData);
        const featuresUpdates = formatFeaturesUpdates(explicitFormData ?? formData);
        const spellSlotsUpdate = formatSpellSlotsUpdates(explicitFormData ?? formData);

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
        setFormData(getDefaultFormData(pcData));
        triggerSuccessAlert(setShowSuccessAlert);
    }

    return (
        <>
        <div className="main-body">
            <Navbar isSelectedPc={!!selectedPc.pcId} userRole={userRole}/>

            <PageHeaderBarPC 
                pcName={`${pcData.baseDetails.name.firstName} ${pcData.baseDetails.name.lastName}`}
                pageName="Tracker"
                pcList={pcList}
                selectedPc={selectedPc}
            />

            <HPModal
                handleChange={handleChange}
                handleSubmit={handleSubmit}
                setFormData={setFormData}
                action={hpModalAction}
                pcData={pcData}
                limitedUseFeatures={limitedUseFeatures}
            />
            <GoldModal
                handleChange={handleChange}
                handleSubmit={handleSubmit}
                setFormData={setFormData}
                action={goldModalAction}
                currentGold={pcData.baseDetails.usableResources.gold}
            />

            <form onSubmit={handleSubmit}>
                <div>
                    {showSuccessAlert && <SuccessAlert/>}
                    <Card>
                        <h3 className="section-header">Hit Points</h3>
                        <div className="hp container-fluid">
                            <div className="row">
                                <div className="col-6 hp-col">
                                    <div className={`hp-display hp-display-${getHPRange(pcData.baseDetails.usableResources.hitPoints.current, pcData.baseDetails.usableResources.hitPoints.max)}`}>
                                        {pcData.baseDetails.usableResources.hitPoints.current} / {pcData.baseDetails.usableResources.hitPoints.max}
                                    </div>                                   
                                </div>
                                <div className="col-6 hp-col">
                                    <button
                                        type="button"
                                        className="btn btn-danger"
                                        data-bs-toggle="modal"
                                        data-bs-target="#hpModal"
                                        onClick={() => { setHPModalAction('takeDamage') }}
                                        disabled={pcData.baseDetails.usableResources.hitPoints.current == 0}
                                    >
                                        Take Damage
                                    </button>
                                    <button
                                        type="button"
                                        className="btn btn-success"
                                        data-bs-toggle="modal"
                                        data-bs-target="#hpModal"
                                        onClick={() => { setHPModalAction('gainHP') }}
                                        disabled={pcData.baseDetails.usableResources.hitPoints.current == pcData.baseDetails.usableResources.hitPoints.max}
                                    >
                                        Gain HP
                                    </button>
                                    <button
                                        type="button"
                                        className="btn btn-info"
                                        data-bs-toggle="modal"
                                        data-bs-target="#hpModal"
                                        onClick={() => { 
                                            setHPModalAction('refillHP');
                                            setFormData({
                                                ...getDefaultFormData(pcData),
                                                hitPointsCurrent: pcData.baseDetails.usableResources.hitPoints.max,
                                            });
                                        }}
                                        disabled={pcData.baseDetails.usableResources.hitPoints.current == pcData.baseDetails.usableResources.hitPoints.max}
                                    >
                                        Refill
                                    </button>
                                </div>
                            </div>                  
                        </div>
                    </Card>            
                    <Card>
                    <div className="container-fluid">
                        <div className="row">
                            <div className="col-6">
                                <Card customClass="bg-light">
                                    <Popover
                                        popoverBody={
                                            <div>
                                                <p>
                                                    If {pcData.baseDetails.name.firstName} has Temporary HP,
                                                    any damage taken will be subtracted from Temporary HP first.
                                                </p>
                                                <p>
                                                    Temporary HP:
                                                    <ul>
                                                        <li>Lasts until depleted or until after the next long rest, unless there is a specified duration</li>
                                                        <li>Cannot be replenished with healing</li>
                                                        <li>Can only be used from one source at a time</li>
                                                    </ul>
                                               </p>                                        
                                            </div>
                                        }
                                    >
                                        <>
                                        <h5>Temp HP</h5>
                                        <h4 className={`number-display ${pcData.baseDetails.usableResources.hitPoints.temporary > 0 ? 'hp-display-temp-number' : undefined}`}>{`${(pcData.baseDetails.usableResources.hitPoints.temporary > 0) ? '+' : ''}${pcData.baseDetails.usableResources.hitPoints.temporary}`}</h4>
                                        </>
                                    </Popover> 
                                    <button
                                        type="button"
                                        className="btn btn-secondary no-margin"
                                        data-bs-toggle="modal"
                                        data-bs-target="#hpModal"
                                        onClick={() => { setHPModalAction('editTempHP') }}
                                    >
                                        Edit
                                    </button>
                                </Card>
                            </div>
                            <div className="col-6">
                                <Card customClass="bg-light">
                                    <h5>AC</h5>                                    
                                    <h4 className="number-display">{pcData.baseDetails.armorClass}</h4>
                                    <button
                                        type="button"
                                        className="btn btn-secondary no-margin"
                                        data-bs-toggle="modal"
                                        data-bs-target="#hpModal"
                                        onClick={() => { setHPModalAction('editAC') }}
                                    >
                                        Edit
                                    </button>                                                                          
                                </Card>
                            </div>                                                       
                        </div>                    
                    </div>
                    </Card> 
                    <Card>
                        <h5>Initiative</h5>
                            <Popover
                                popoverBody={
                                    <div>
                                        <b>{pcData.abilityScores.data.dexterity.modifier > 0 && '+'}{pcData.abilityScores.data.dexterity.modifier}</b> from DEX modifier
                                    </div>
                                }
                            >
                                <h4>{pcData.abilityScores.data.dexterity.modifier > 0 && '+'}{pcData.abilityScores.data.dexterity.modifier}</h4>
                            </Popover>        
                    </Card>                   

                    {
                        (
                            (pcData.spellSlots && pcData.spellSlots.filter(slot => slot.data.max > 0).length > 0) ||
                            (pcData.baseDetails.spells && pcData.baseDetails.spells.length > 0)
                        ) &&
                        <SpellsTrackerComponent
                            pcData={pcData}
                            formData={formData}
                            handleSubmit={handleSubmit}
                        />
                    }
                
                    {
                        (pcData.baseDetails.weapons && pcData.baseDetails.weapons.length > 0) &&
                        <Card>
                            <h3 className="section-header">Weapons</h3>
                            {
                                pcData.baseDetails.weapons.map((weapon, i) => (
                                    <Card key={i}>
                                        <div className="center-table">
                                        <div className="container-fluid left-justify" key={i}>
                                            <div className="row">
                                                <Link className="text-link center" to={'/details?weapons=true#' + weapon.id}><h4>{formatWeaponDisplayTitle(weapon.type, weapon.name)}</h4></Link>
                                            </div>
                                            <div className="row display-item-row">
                                                <div className="col-5">
                                                    Attack Bonus: 
                                                </div>
                                                <div className="col-7">
                                                    <Popover
                                                        popoverBody={<WeaponContentPopover weapon={weapon} pcData={pcData} attribute="attack bonus"/>}
                                                        fitContent={true}
                                                    >
                                                        <span><b>{formatBonus(determineAttackBonus(weapon, pcData) + pcData.baseDetails.proficiencyBonus)}</b></span>
                                                    </Popover>
                                                </div>
                                            </div>
                                            <div className="row display-item-row">
                                                <div className="col-5">
                                                    Damage:
                                                </div>
                                                <div className="col-7">
                                                    <Popover
                                                        popoverBody={<WeaponContentPopover weapon={weapon} pcData={pcData} attribute="damage"/>}
                                                        fitContent={true}
                                                    >
                                                        <span><b>{weapon.damage} {formatBonus(determineAttackBonus(weapon, pcData), false)}</b> {weapon.damageType.toLowerCase()}</span>
                                                    </Popover>
                                                </div>
                                            </div>
                                        </div>
                                        </div>
                                    </Card>
                                ))
                            }
                        </Card>
                    }

                    {
                        (limitedUseFeatures && limitedUseFeatures.length > 0) &&
                        <Card>
                            <h3 className="section-header">Abilities</h3>
                            {
                                limitedUseFeatures.map(feature => (
                                    <Card key={feature.id}>
                                        <Link className="text-link" to={'/details?features=true#' + removeWhiteSpaceAndConvertToLowerCase(feature.data.name)}><h4>{feature.data.name}</h4></Link>
                                        <ItemUseToggle
                                            itemLabel={removeWhiteSpaceAndConvertToLowerCase(feature.data.name)}
                                            formDataName={buildFeatureCurrentUsesKey(feature)}
                                            maxUses={feature.data.maxUses!}
                                            currentUses={formData[buildFeatureCurrentUsesKey(feature)]}
                                            formData={formData}
                                            handleSubmit={handleSubmit}
                                        />
                                        <Refresh refreshRestType={feature.data.refresh!}/>
                                    </Card>
                                ))
                            }
                        </Card>
                    }
                    
                    <Card>
                        <h3 className="section-header">Hit Dice</h3>
                        <Popover
                            popoverBody={
                                <p><b>{conModifier > 0 ? '+' : undefined}{conModifier}</b> from CON modifier</p>
                                                           
                            }
                        >
                            <p className="center">{pcData.baseDetails.usableResources.hitDice.type} {conModifier > 0 ? `+${conModifier}` : conModifier < 0 ? `${conModifier} (minimum of 0)` : undefined}</p>
                        </Popover>
                        <ItemUseToggle
                            itemLabel="Hit Dice"
                            formDataName="hitDiceCurrent"
                            maxUses={pcData.baseDetails.usableResources.hitDice.max}
                            currentUses={formData.hitDiceCurrent}
                            formData={formData}
                            handleSubmit={handleSubmit}
                        />
                    </Card>

                    <Card>
                        <h3 className="section-header">Death Saves</h3>
                        <h4 className="text-green">Successes</h4>
                        <ItemUseToggle
                            itemLabel="Death Save Successes"
                            formDataName="deathSavesSuccesses"
                            maxUses={pcData.baseDetails.usableResources.deathSaves.max}
                            currentUses={formData.deathSavesSuccesses}
                            formData={formData}
                            handleSubmit={handleSubmit}
                        />
                        <h4 className="text-red">Failures</h4>
                        <ItemUseToggle
                            itemLabel="Death Save Failures"
                            formDataName="deathSavesFailures"
                            maxUses={pcData.baseDetails.usableResources.deathSaves.max}
                            currentUses={formData.deathSavesFailures}
                            formData={formData}
                            handleSubmit={handleSubmit}                           
                        />
                    </Card>

                    <Card>
                        <h3 className="section-header">Gold</h3>
                        <Card>
                        <div className="gold container-fluid">
                            <div className="row">
                                <div className="col-6 hp-col">
                                    <div className={`gold-display ${pcData.baseDetails.usableResources.gold === 0 ? "gold-display-none" : undefined}`}>
                                        {pcData.baseDetails.usableResources.gold.toLocaleString()}
                                    </div>
                                </div>
                                <div className="col-6 hp-col">
                                    <button
                                        type="button"
                                        className="btn btn-success"
                                        data-bs-toggle="modal"
                                        data-bs-target="#goldModal"
                                        onClick={() => { setGoldModalAction('gain') }}
                                    >
                                        Gain Gold
                                    </button>
                                    <button
                                        type="button"
                                        className="btn btn-danger"
                                        data-bs-toggle="modal"
                                        data-bs-target="#goldModal"
                                        onClick={() => { setGoldModalAction('spend') }}
                                        disabled={pcData.baseDetails.usableResources.gold == 0}
                                    >
                                        Spend Gold
                                    </button>

                                </div>
                            </div>
                        </div>
                        </Card> 
                    </Card>

                    <Card>
                        <h3 className="section-header">Inspiration</h3>
                        <Card customClass="bg-light">
                            <div className="container-fluid">
                                <div className="row">
                                    <div className="col-6">
                                        <Popover
                                            popoverBody={
                                                <div>
                                                    <p>Use inspiration to gain advantage on one attack roll, saving throw, or ability check.</p>
                                                </div>
                                            }
                                        >
                                            <div className={`insp-display ${pcData.baseDetails.usableResources.inspiration < 1 ? 'insp-display-none' : undefined}`}>
                                                {pcData.baseDetails.usableResources.inspiration}
                                            </div>
                                        </Popover> 
                                    </div>
                                    <div className="col-6">
                                        <button
                                            type="button"
                                            className="btn btn-success btn-insp"
                                            data-bs-toggle="modal"
                                            data-bs-target="#hpModal"
                                            onClick={() => { 
                                                setHPModalAction('addInspiration') 
                                                setFormData({
                                                    ...getDefaultFormData(pcData),
                                                    inspiration: pcData.baseDetails.usableResources.inspiration + 1,
                                                });
                                            }}
                                            disabled={pcData.baseDetails.usableResources.inspiration >= 5}                         
                                        >
                                            Gain Inspiration
                                        </button>
                                        <button
                                            type="button"
                                            className="btn btn-danger btn-insp"
                                            data-bs-toggle="modal"
                                            data-bs-target="#hpModal"
                                            onClick={() => { 
                                                setHPModalAction('useInspiration') 
                                                setFormData({
                                                    ...getDefaultFormData(pcData),
                                                    inspiration: pcData.baseDetails.usableResources.inspiration - 1,
                                                });
                                            }}
                                            disabled={pcData.baseDetails.usableResources.inspiration < 1}
                                        >
                                            Use Inspiration
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </Card>                                                              
                    </Card>
                    <Card customClass="card-no-outline">
                        <div className="container-fluid container-rest">
                            <div className="row">
                                <div className="col-6">
                                    <button
                                        type="button"
                                        className="btn btn-dark btn-rest"
                                        data-bs-toggle="modal"
                                        data-bs-target="#hpModal"
                                        onClick={() => { 
                                            setHPModalAction('shortRest') 
                                            setFormData({
                                                ...getDefaultFormData(pcData),
                                                ...limitedUseFeatures.filter(f => f.data.refresh == RestType.SHORT).reduce((obj, item) => Object.assign(obj, { [buildFeatureCurrentUsesKey(item)]: item.data.maxUses }), {}),
                                                deathSavesSuccesses: 3,
                                                deathSavesFailures: 3,
                                                // TODO: only do default spell slots if isWarlock is true...
                                                ...(pcData.baseDetails.class.toUpperCase() === 'WARLOCK' && {...pcData.spellSlots?.reduce((obj, item) => Object.assign(obj, { [buildSpellSlotsCurrentKey(item)]: item.data.max }), {})}),
                                            });
                                        }}
                                    >
                                        <h5><img src="images/icons/short-rest.png" width="30px"/>Short Rest</h5>
                                    </button>                        
                                </div>
                                <div className="col-6">
                                    <button
                                        type="button"
                                        className="btn btn-dark btn-rest"
                                        data-bs-toggle="modal"
                                        data-bs-target="#hpModal"
                                        onClick={() => { 
                                            setHPModalAction('longRest') 
                                            setFormData({
                                                ...getDefaultFormData(pcData),
                                                hitPointsCurrent: pcData.baseDetails.usableResources.hitPoints.max,
                                                hitPointsTemporary: 0,
                                                ...pcData.spellSlots?.reduce((obj, item) => Object.assign(obj, { [buildSpellSlotsCurrentKey(item)]: item.data.max }), {}),
                                                ...limitedUseFeatures.reduce((obj, item) => Object.assign(obj, { [buildFeatureCurrentUsesKey(item)]: item.data.maxUses }), {}),
                                                deathSavesSuccesses: 3,
                                                deathSavesFailures: 3,
                                                hitDiceCurrent: pcData.baseDetails.usableResources.hitDice.max
                                            });
                                        }}
                                    >
                                        <h5><img src="images/icons/long-rest.png" width="30px"/>Long Rest</h5>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </Card>                    
                </div>                          
            </form>

            <AboutFooter/>
        </div>
        <QuickNav/>
        </>
    )
}

export default Tracker;