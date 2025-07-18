import Navbar from "@components/Navbar";
import Card from "@components/cards/Card";
import Refresh from "@components/Refresh";
import { 
    buildFeatureCurrentUsesKey, 
    buildSpellSlotsCurrentKey, 
    formatBaseDetailsUpdates, 
    formatFeaturesUpdates, 
    formatSpellSlotsUpdates,
    formatSummonablesUpdates,
    getDefaultSpellSaveDC,
    removeWhiteSpaceAndConvertToLowerCase, 
} from "@components/utils";
import { useEffect, useState} from "react";
import { updateById, updateDataByPcId } from "@services/firestore/crud/update";
import ItemUseToggle from "@components/ItemUseToggle";
import { BaseDetails, PlayerCharacter } from "@models/playerCharacter/PlayerCharacter";
import { QueryClient } from "@tanstack/react-query";
import { CollectionName } from "@services/firestore/enum/CollectionName";
import { determineAttackBonus, emptyRichTextContent, formatBonus, formatWeaponDisplayTitle, getDefaultFormData, getLimitedUseFeatures, getSummonableIconName, getSummonedItem, SAVE_CHANGES_ERROR, triggerSuccessAlert } from "../utils";
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
import ConfirmDismissSummonModal from "@components/modals/ConfirmDismissSummonModal";
import { useSearchParams } from "react-router-dom";
import SummonableActionModal from "@components/modals/SummonableActionModal";
import SummonableDrawer from "@components/modals/SummonableDrawer";
import { Weapon } from "@models/playerCharacter/Weapon";
import { SpellLevel } from "@models/playerCharacter/Spell";
import GenericModal from "@components/modals/GenericModal";
import SpellSaveDCPopoverContent from "@components/popovers/SpellSaveDCPopoverContent";
import TitleButtonRow from "@components/TitleButtonRow";
import PoolDisplay from "@components/PoolDisplay";
import HPDisplay from "@components/HPDisplay";
import ResourceUseModal from "@components/modals/ResourceUseModal";
import { SentryLogger } from "@services/sentry/logger";

interface Props {
    pcData: PlayerCharacter;
    queryClient: QueryClient;
    pcList: BaseDetails[];
    selectedPc: {pcId: string | null, setSelectedPcId: (pcId: string) => void}
    userRole: UserRole | undefined;
    logger: SentryLogger;
}

function Tracker({pcData, queryClient, pcList, selectedPc, userRole, logger}: Props) {   
    const conModifier = pcData.abilityScores.data.constitution.modifier;
   
    const [showSuccessAlert, setShowSuccessAlert] = useState(false);

    const [searchParams] = useSearchParams();

    const [disableBackdrop, setDisableBackdrop] = useState(false);

    const [summonableAction, setSummonableAction] = useState('');
    
    const [formData, setFormData] = useState(getDefaultFormData(pcData));
    const [weaponFormData, setWeaponFormData] = useState(pcData.baseDetails.weapons);
    const [limitedUseFeatures, setLimitedUseFeatures] = useState(getLimitedUseFeatures(pcData));
    const [hpModalAction, setHPModalAction] = useState('');
    const [goldModalAction, setGoldModalAction] = useState('');
    const [resourceUseModalData, setResourceUseModalData] = useState({
        title: '',
        action: '' as any,
        feature: {
            id: '',
            data: {
                currentUses: 0,
                maxUses: 0,
                pcId: pcData.baseDetails.pcId,
                description: '',
                source: '',
                name: ''
            }
        }
    });
    const [summonedItem, setSummonedItem] = useState(getSummonedItem(pcData));
    const [selectedSpellSlotLevel, setSelectedSpellSlotLevel] = useState(SpellLevel.L1);

    const [descriptionModalData, setDescriptionModalData] = useState({
        title: '',
        content: emptyRichTextContent
    });

    useEffect(() => {
        setLimitedUseFeatures(getLimitedUseFeatures(pcData));
        setFormData(getDefaultFormData(pcData));
        setSummonedItem(getSummonedItem(pcData));
    }, [pcData]);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setFormData((prevFormData: any) => ({...prevFormData, [name]: value}));
    }

    const handleSubmitWeaponEquip = async (event: any, weaponFormData: Weapon[]) => {
        event.preventDefault();

        try {
            await updateDataByPcId(CollectionName.PC_BASE_DETAILS, pcData.baseDetails.pcId, { weapons: weaponFormData });
        } catch (e: any) {
            logger.logError(e);
            alert(SAVE_CHANGES_ERROR);
            return;
        }
        queryClient.refetchQueries({ queryKey: ['pcData', pcData.baseDetails.pcId]});
        setFormData(getDefaultFormData(pcData));
        triggerSuccessAlert(setShowSuccessAlert);
    };

    const handleSubmitSpellSlotUpdate = async (event: any, spellSlotFormData: any) => {
        event.preventDefault();
        const spellSlotsUpdate = formatSpellSlotsUpdates(spellSlotFormData)[0];
        try {
            await updateById(CollectionName.SPELL_SLOTS, spellSlotsUpdate.docId, spellSlotsUpdate.updates);
        } catch (e: any) {
            logger.logError(e);
            alert(SAVE_CHANGES_ERROR);
            return;
        }
        queryClient.refetchQueries({ queryKey: ['pcData', pcData.baseDetails.pcId]});
        setFormData(getDefaultFormData(pcData));
        triggerSuccessAlert(setShowSuccessAlert);
    }

    const handleSubmit = async (event: any, explicitFormData?: any) => {
        event.preventDefault();
        const baseDetailsUpdates = formatBaseDetailsUpdates(explicitFormData ?? formData);
        const featuresUpdates = formatFeaturesUpdates(explicitFormData ?? formData);
        const summonablesUpdates = formatSummonablesUpdates(explicitFormData ?? formData);
        const spellSlotsUpdate = formatSpellSlotsUpdates(explicitFormData ?? formData);

        try {
            await Promise.all([
                updateDataByPcId(CollectionName.PC_BASE_DETAILS, pcData.baseDetails.pcId, baseDetailsUpdates),
                ...featuresUpdates.map(f => updateById(CollectionName.FEATURES, f.docId, f.updates)),
                ...spellSlotsUpdate.map(s => updateById(CollectionName.SPELL_SLOTS, s.docId, s.updates)),
                ...summonablesUpdates.map(s => updateById(CollectionName.SUMMONABLES, s.docId, s.updates))
            ]).then();
        } catch (e: any) {
            logger.logError(e);
            alert(SAVE_CHANGES_ERROR);
            return;
        }
        queryClient.refetchQueries({ queryKey: ['pcData', pcData.baseDetails.pcId]});
        setFormData(getDefaultFormData(pcData));
        triggerSuccessAlert(setShowSuccessAlert);
    }

    return (
        <div className={`tracker-body${disableBackdrop ? '-disable-scroll' : ''}`}>
        {
            (summonedItem.data.summoned && disableBackdrop) &&
            <div className="overlay-backdrop"/>
        }

        <div className="main-body">
            {
                summonedItem.data.summoned &&
                <SummonableDrawer
                    pcData={pcData}
                    setFormData={setFormData}
                    summonable={summonedItem}
                    searchParams={searchParams}
                    setSummonableAction={setSummonableAction}
                    setDisableBackdrop={setDisableBackdrop}
                    disableBackdrop={disableBackdrop}
                />
            }
            
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
            <ConfirmDismissSummonModal
                summonable={summonedItem}
                handleDismiss={() => {
                    setDisableBackdrop(false);
                    updateById(CollectionName.SUMMONABLES, summonedItem.id, {summoned: false});
                    queryClient.refetchQueries({ queryKey: ['pcData', pcData.baseDetails.pcId]});
                    setFormData(getDefaultFormData(pcData));
                    setSummonedItem(getSummonedItem(pcData));
                    triggerSuccessAlert(setShowSuccessAlert);
                }}
            />
            <SummonableActionModal
                action={summonableAction}
                summonable={summonedItem}
                setShowSuccessAlert={setShowSuccessAlert}
                queryClient={queryClient}
                searchParams={searchParams}
                setDisableBackdrop={setDisableBackdrop}
                pcId={pcData.baseDetails.pcId}
                logger={logger}
            />
            <GenericModal
                modalName="description"
                title={descriptionModalData.title}
                onClose={() => setDescriptionModalData({title: '', content: emptyRichTextContent})}
                modalBody={<div dangerouslySetInnerHTML={{__html: descriptionModalData.content}}/>}
            />
            <ResourceUseModal
                handleSubmit={handleSubmit}
                formData={formData}
                modalData={resourceUseModalData}
            />
            <GenericModal
                modalName="resetDeathSaves"
                title="Reset Death Saves?"
                modalFooter={
                    <>
                    <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                    <button
                        type="button"
                        className="btn btn-success"
                        onClick={() => {
                            const max = pcData.baseDetails.usableResources.deathSaves.max;
                            updateDataByPcId(CollectionName.PC_BASE_DETAILS, pcData.baseDetails.pcId, {
                                'usableResources.deathSaves.failuresRemaining': max,
                                'usableResources.deathSaves.successesRemaining': max
                            });
                            queryClient.refetchQueries({ queryKey: ['pcData', pcData.baseDetails.pcId]});
                            setFormData(getDefaultFormData(pcData));
                            triggerSuccessAlert(setShowSuccessAlert);
                        }}
                        data-bs-dismiss="modal"
                    >
                        Reset
                    </button>
                    </>
                }
                modalBody={<p>This will clear all successes and failures.</p>}
                modalFooterAsButton={false}
            />

            <form onSubmit={handleSubmit}>
                <div>
                    {showSuccessAlert && <SuccessAlert/>}
                    <Card>
                        <HPDisplay
                            pcData={pcData}
                            setHPModalAction={setHPModalAction}
                            setFormData={setFormData}
                        />
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
                                                <div>
                                                    Temporary HP:
                                                    <ul>
                                                        <li>Lasts until depleted or until after the next long rest, unless there is a specified duration</li>
                                                        <li>Cannot be replenished with healing</li>
                                                        <li>Can only be used from one source at a time</li>
                                                    </ul>
                                               </div>                                        
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
                        <div className="container-fluid">
                            <div className="row center">
                            <div className="col">
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
                            </div>
                            {
                                pcData.baseDetails.defaultSpellCastingAbility &&
                                <div className="col">
                                    <h5>Spell Save DC</h5>
                                    <Popover
                                        popoverBody={
                                            <SpellSaveDCPopoverContent
                                                proficiencyBonus={pcData.baseDetails.proficiencyBonus}
                                                defaultSpellCastingAbility={pcData.baseDetails.defaultSpellCastingAbility}
                                                abilityScores={pcData.abilityScores}
                                            />
                                        }
                                    >
                                        <h4>{getDefaultSpellSaveDC(pcData.baseDetails.proficiencyBonus, pcData.baseDetails.defaultSpellCastingAbility, pcData.abilityScores)}</h4>
                                    </Popover>
                                </div>
                            }                            
                            </div>
                        </div>                            
                    </Card>                   

                    {
                        (
                            (pcData.spellSlots && pcData.spellSlots.filter(slot => slot.data.max > 0).length > 0) ||
                            (pcData.baseDetails.spells && pcData.baseDetails.spells.length > 0)
                        ) &&
                        <SpellsTrackerComponent
                            pcData={pcData}
                            handleSubmit={handleSubmitSpellSlotUpdate}
                            spellSlotLevel={{
                                selected: selectedSpellSlotLevel,
                                setSelected: setSelectedSpellSlotLevel
                            }}
                        />
                    }
                
                    {
                        (pcData.baseDetails.weapons && pcData.baseDetails.weapons.length > 0) &&
                        <Card>
                            <h3 className="section-header">Weapons</h3>
                            {
                                pcData.baseDetails.weapons.sort((a,b) => {
                                    const aCompName = formatWeaponDisplayTitle(a.type, a.name);
                                    const bCompName = formatWeaponDisplayTitle(b.type, b.name);
                                    if (a.equipped && !b.equipped) return -1;
                                    if (b.equipped && !a.equipped) return 1;
                                    if (aCompName < bCompName) return -1;
                                    return 1;
                                }).map((weapon, i) => (
                                    <Card key={i}>
                                        <div className={`center-table ${weapon.equipped ? "weapon-equipped" : ""}`}>
                                        <div className="container-fluid left-justify" key={i}>
                                            <div className="row">
                                                <div className="col">
                                                    <button
                                                        type="button"
                                                        className="text-link invisible-btn spell-display-name"
                                                        data-bs-toggle="modal"
                                                        data-bs-target="#descriptionModal"
                                                        disabled={!weapon.description || weapon.description == emptyRichTextContent}
                                                        onClick={() => {
                                                                setDescriptionModalData({
                                                                title: formatWeaponDisplayTitle(weapon.type, weapon.name),
                                                                content: weapon.description ?? emptyRichTextContent
                                                            });
                                                        }}
                                                    >
                                                        <h4>{formatWeaponDisplayTitle(weapon.type, weapon.name)}</h4>
                                                    </button>
                                                </div>
                                                {/* EQUIP/UNEQUIP TOGGLE */}
                                                <div className="col-auto">
                                                    <input
                                                        className="inline"
                                                        type="checkbox"
                                                        checked={weaponFormData.find(w => w.id == weapon.id)?.equipped ? true : false}
                                                        onChange={(event) => {
                                                            const newValue = !weaponFormData.find(w => w.id == weapon.id)?.equipped;
                                                            setWeaponFormData(weaponFormData.map(w => {
                                                                if (w.id == weapon.id) return { ...w, equipped: newValue }
                                                                else return w;
                                                            }));
                                                            handleSubmitWeaponEquip(event, weaponFormData.map(w => {
                                                                if (w.id == weapon.id) return { ...w, equipped: newValue }
                                                                else return w;
                                                            }));
                                                        }}
                                                    />
                                                    <p className="inline small-text">EQUIPPED</p>
                                                </div>
                                            </div>
                                            {
                                                weapon.equipped &&
                                                <>
                                                    <div className="row display-item-row">
                                                    <div className="col-5">
                                                        Attack Bonus: 
                                                    </div>
                                                    <div className="col-7">
                                                        <Popover
                                                            popoverBody={<WeaponContentPopover weapon={weapon} pcData={pcData} attribute="attack bonus"/>}
                                                            fitContent={true}
                                                        >
                                                            <span><b>{formatBonus(determineAttackBonus(weapon, pcData) + pcData.baseDetails.proficiencyBonus + (weapon.bonus ?? 0))}</b></span>
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
                                                                <span><b>{weapon.damage} {formatBonus(determineAttackBonus(weapon, pcData) + (weapon.bonus ?? 0), false)}</b> {weapon.damageType.toLowerCase()}</span>
                                                            </Popover>
                                                        </div>
                                                    </div>
                                                </>
                                            }                                            
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
                                    <Card key={feature.id} customClass="small-padding">
                                        <div className="container-fluid light-gray-bg small-padding no-margin">
                                            <div className="row">
                                                <div className="col left-justify">
                                                    <button
                                                        type="button"
                                                        className="text-link invisible-btn spell-display-name"
                                                        data-bs-toggle="modal"
                                                        data-bs-target="#descriptionModal"
                                                        disabled={!feature.data.description || feature.data.description == emptyRichTextContent}
                                                        onClick={() => {
                                                                setDescriptionModalData({
                                                                title: feature.data.name,
                                                                content: feature.data.description
                                                            });
                                                        }}
                                                    >
                                                        <h4>{feature.data.name}</h4>
                                                    </button>
                                                </div>
                                                <div className="col-auto">
                                                    <Refresh refreshRestType={feature.data.refresh!}/>
                                                </div>
                                            </div>                                            
                                        </div>

                                        {
                                            feature.data.displayAsPool &&
                                            <PoolDisplay
                                                feature={feature}
                                                setResourceUseModalData={setResourceUseModalData}
                                            />
                                        }
                                        {
                                            !feature.data.displayAsPool &&
                                            <ItemUseToggle
                                                itemLabel={removeWhiteSpaceAndConvertToLowerCase(feature.data.name)}
                                                formDataName={buildFeatureCurrentUsesKey(feature)}
                                                maxUses={feature.data.maxUses!}
                                                currentUses={formData[buildFeatureCurrentUsesKey(feature)]}
                                                formData={formData}
                                                handleSubmit={handleSubmit}
                                            />   
                                        }
                                                                          
                                    </Card>
                                ))
                            }
                        </Card>
                    }

                    {
                        (pcData.summonables && pcData.summonables.length > 0) &&
                        <Card>
                            <h3 className="section-header">Summonables</h3>
                            {
                                pcData.summonables.sort((a,b) => {
                                    const aComparable = a.data.name ?? a.data.type;
                                    const bComparable = b.data.name ?? b.data.type;
                                    if (aComparable < bComparable) return -1;
                                    return 1;
                                }).map(s => (
                                    <Card key={s.id}>
                                        <button
                                            type="button"
                                            className="text-link invisible-btn spell-display-name"
                                            data-bs-toggle="modal"
                                            data-bs-target="#descriptionModal"
                                            disabled={!s.data.description || s.data.description == emptyRichTextContent}
                                            onClick={() => {
                                                    setDescriptionModalData({
                                                    title: s.data.name ? `${s.data.name} (${s.data.type})` : s.data.type,
                                                    content: s.data.description
                                                });
                                            }}
                                        >
                                            <h4>{s.data.name ? `${s.data.name} (${s.data.type})` : s.data.type}</h4>
                                        </button>
                                        {
                                            s.data.source.type == 'spell' &&
                                            <p className="center">Must use the {s.data.source.name} spell in order to summon.</p>
                                        }
                                        {
                                            (s.data.source.type == 'feature' && pcData.features.filter(f => f.data.name === s.data.source.name)[0].data.maxUses) &&
                                            <p className="center">Must use the {s.data.source.name} feature under the Abilities section in order to summon.</p>
                                        }
                                        <button
                                            className={`btn btn-${(summonedItem.id == s.id && summonedItem.data.summoned) ? 'success' : 'info'}`}
                                            type="button"
                                            data-bs-toggle="modal"
                                            data-bs-target="#summonableActionModal"
                                            onClick={() => {                                                
                                                setSummonedItem(s);
                                                setSummonableAction('summon');
                                            }}
                                            disabled={s.data.summoned === true || summonedItem.data.summoned === true}
                                        >
                                            {
                                            s.data.summoned === true ? "Summoned" :
                                            "Summon"
                                            }
                                        </button>
                                        {
                                            (summonedItem.id !== s.id && summonedItem.data.summoned === true) &&
                                            <p className="center update-form-description">Cannot summon until the currently summoned item is dismissed</p>
                                        }
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
                        <TitleButtonRow
                            text="Death Saves"
                            formatAsHeader={true}
                            matchSectionHeaderFormat={true}
                            buttons={
                                <button
                                    type="button"
                                    className="btn btn-success"
                                    data-bs-toggle="modal"
                                    data-bs-target="#resetDeathSavesModal"
                                    disabled={
                                        pcData.baseDetails.usableResources.deathSaves.failuresRemaining == 
                                            pcData.baseDetails.usableResources.deathSaves.max &&
                                        pcData.baseDetails.usableResources.deathSaves.successesRemaining ==
                                            pcData.baseDetails.usableResources.deathSaves.max
                                    }
                                >
                                    Reset
                                </button>                                
                            }
                            customColor="dark-purple"
                            centered={true}
                        />
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
                                                ...(pcData.baseDetails.class.toUpperCase() === 'WARLOCK' && {...pcData.spellSlots?.reduce((obj, item) => Object.assign(obj, { [buildSpellSlotsCurrentKey(item)]: item.data.max }), {})}),
                                            });
                                        }}
                                    >
                                        <p className="center"><img src="images/icons/short-rest.png" width="30px"/>Short Rest</p>
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
                                        <p className="center"><img src="images/icons/long-rest.png" width="30px"/>Long Rest</p>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </Card>                
                </div>                          
            </form>

            {
                (summonedItem.data.summoned && !disableBackdrop) &&
                <div className="col-auto drawer-handle">
                    <button className="btn drawer-handle-btn" type="button" data-bs-toggle="collapse" data-bs-target="#collapseExample" aria-expanded="false" aria-controls="collapseExample"
                    onClick={() => {
                        setDisableBackdrop(!disableBackdrop);
                    }}>
                        <a href="#top">
                            { !disableBackdrop && 
                            <img
                                alt="open summoned item"
                                src={`/images/icons/${getSummonableIconName(summonedItem)}.png`}
                                width="40px"/>
                            }
                        </a>
                    </button>
                </div>                
            }

            <AboutFooter/>
        </div>
        <QuickNav/>
        </div>
    )
}

export default Tracker;