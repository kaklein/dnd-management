import Navbar from "@components/Navbar";
import Card from "@components/cards/Card";
import { capitalize, formatDataAsTable, orderAndFormatWeaponElements, removeWhiteSpaceAndConvertToLowerCase } from "@components/utils";
import { Spell } from "@models/playerCharacter/Spell";
import { BaseDetails, PlayerCharacter } from "@models/playerCharacter/PlayerCharacter";
import PageHeaderBarPC from "@components/headerBars/PageHeaderBarPC";
import Button, { ButtonType } from "@components/Button";
import { useState } from "react";
import { deleteItemById, deleteItemFromArrayById, deleteItemFromStringArray } from "@services/firestore/crud/delete";
import { CollectionName } from "@services/firestore/enum/CollectionName";
import { QueryClient } from "@tanstack/react-query";
import ConfirmDelete from "@components/modals/ConfirmDelete";
import { TitleButtonRow } from "@components/TitleButtonRow";
import DeleteItemButton from "@components/DeleteItemButton";
import QuickNav from "@components/QuickNav";
import { formatWeaponDisplayTitle, handleSubmitEdit, pcHasDetailsPageItems, triggerSuccessAlert } from "@pages/utils";
import SuccessAlert from "@components/alerts/SuccessAlert";
import EditItemButton from "@components/EditItemButton";
import EditModal from "@components/modals/EditModal";
import { buildEmptyShowSectionData, emptyEditModalData, emptyShowConfirmDeleteData, emptyShowSectionData } from "@data/emptyFormData";
import { UserRole } from "@services/firestore/enum/UserRole";
import { useNavigate, useSearchParams } from "react-router-dom";
import FormHeader from "@components/updateForms/FormHeader";
import AboutFooter from "@components/AboutFooter";
import { DamageType } from "@models/enum/DamageType";

interface Props {
    pcData: PlayerCharacter;
    pcList: BaseDetails[];
    selectedPc: {pcId: string | null, setSelectedPcId: (pcId: string) => void};
    queryClient: QueryClient;
    userRole: UserRole | undefined;
}

function Details({pcData, pcList, selectedPc, queryClient, userRole}: Props) {
    const hasItems = pcHasDetailsPageItems(pcData);
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const [showSection, setShowSection] = useState(buildEmptyShowSectionData(searchParams));

    const [showSuccessAlert, setShowSuccessAlert] = useState(false);

    const [editable, setEditable] = useState(false);
    const handleDeleteFeature = async (featureId: string) => {
        await deleteItemById(CollectionName.FEATURES, featureId);
        queryClient.refetchQueries({ queryKey: ['pcData', pcData.baseDetails.pcId]});
        triggerSuccessAlert(setShowSuccessAlert);
    }
    const handleDeleteSummonable = async (summonableId: string) => {
        await deleteItemById(CollectionName.SUMMONABLES, summonableId);
        queryClient.refetchQueries({ queryKey: ['pcData', pcData.baseDetails.pcId]});
        triggerSuccessAlert(setShowSuccessAlert);
    }
    const handleDeleteObjectArrayItem = async (arrayName: string, item: any, existingItems: any[]) => {
        await deleteItemFromArrayById(CollectionName.PC_BASE_DETAILS, pcData.baseDetails.pcId, arrayName, existingItems, item);
        queryClient.refetchQueries({ queryKey: ['pcData', pcData.baseDetails.pcId]});
        triggerSuccessAlert(setShowSuccessAlert);
    }
    const handleDeleteStringArrayItem = async (arrayName: string, item: string) => {
        await deleteItemFromStringArray(CollectionName.PC_BASE_DETAILS, pcData.baseDetails.pcId, arrayName, item);
        queryClient.refetchQueries({ queryKey: ['pcData', pcData.baseDetails.pcId]});
        triggerSuccessAlert(setShowSuccessAlert);
    }

    const handleChange = (
        event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>, 
        setFunction: (prevFormData: any) => void
    ) => {
    const { name, value } = event.target;
    setFunction((prevFormData: any) => ({...prevFormData, [name]: value}));
    };

    const [showConfirmDelete, setShowConfirmDelete] = useState({show: false, data: emptyShowConfirmDeleteData});
    const [editModalFormData, setEditModalFormData] = useState(emptyEditModalData)

    const mapSpells = (
        spells: Spell[], 
        editable: boolean, 
    ) => {    
        return (
            spells.sort((a, b) => {
                if (a.level < b.level) return -1;
                if (a.level > b.level) return 1;
                if (a.name < b.name) return -1;
                return 1;
            }).map((spell, i) => (
                <Card key={i}>
                    <a id={spell.id}></a>
                    <TitleButtonRow
                        text={spell.name}
                        buttons={
                            <>
                            <DeleteItemButton
                                editable={editable}
                                handleDelete={() => setShowConfirmDelete({
                                    show: true,
                                    data: {
                                        ...emptyShowConfirmDeleteData,
                                        displayName: spell.name,
                                        objectArrayFieldName: 'spells',
                                        objectArrayFullItem: spell,
                                        objectArrayExistingItems: spells                        
                                    }
                                })}
                            />
                            <EditItemButton
                                editable={editable}
                                handleEdit={() => {
                                    setEditModalFormData({
                                        ...emptyEditModalData,
                                        formType: 'spell',
                                        spellId: spell.id,
                                        displayName: spell.name,
                                        name: spell.name,
                                        description: spell.description,
                                        damage: spell.damage ?? '',
                                        damageType: spell.damageType ?? '',
                                        sourceUrl: spell.sourceUrl ?? '',
                                        level: spell.level,
                                        spellCastingAbility: spell.spellCastingAbility
                                    })
                                }}
                            />
                            </>
                        }
                    />
                    <div className="content">                   
                        <p><b>Description: </b>{spell.description}</p>
        
                        <p><b>Type: </b>{spell.level}</p>
        
                        {spell.damage &&
                            <p><b>{spell.damageType == DamageType.HEALING ? 'Effect:' : 'Damage:'} </b>{spell.damage} {spell.damageType}</p>
                        }
        
                        {spell.saveDC &&
                            <p><b>Spell Save DC: </b>{spell.saveDC}</p>
                        }
        
                        {spell.spellCastingAbility &&
                            <p><b>Spellcasting ability: </b>{spell.spellCastingAbility}</p>
                        }
        
                        {spell.sourceUrl &&
                            <p><b>Source URL: </b><a href={spell.sourceUrl} target="_blank">{spell.sourceUrl}</a></p>
                        }
                    </div>
                </Card>
            ))
        )
    }

    return (
        <>
        <div className="main-body main-body-short">
            <Navbar isSelectedPc={!!selectedPc.pcId} userRole={userRole}/>

            <PageHeaderBarPC 
                pcName={`${pcData.baseDetails.name.firstName} ${pcData.baseDetails.name.lastName}`}
                pageName="Details"
                pcList={pcList}
                selectedPc={selectedPc}
            />


            <ConfirmDelete
                itemName={showConfirmDelete.data.displayName}
                handleCancel={() => {setShowConfirmDelete({show: false, data: emptyShowConfirmDeleteData})}}
                handleDelete={() => {
                    if (showConfirmDelete.data.featureId) {
                        handleDeleteFeature(showConfirmDelete.data.featureId);
                    } else if (showConfirmDelete.data.objectArrayFieldName) {
                        handleDeleteObjectArrayItem(showConfirmDelete.data.objectArrayFieldName, showConfirmDelete.data.objectArrayFullItem, showConfirmDelete.data.objectArrayExistingItems);
                    } else if (showConfirmDelete.data.stringArrayFieldName) {
                        handleDeleteStringArrayItem(showConfirmDelete.data.stringArrayFieldName, showConfirmDelete.data.stringArrayItemName);
                    } else if (showConfirmDelete.data.summonableId) {
                        handleDeleteSummonable(showConfirmDelete.data.summonableId);
                    } else {
                        console.error('Unprocessable data in state object.');
                        alert('Error deleting item. Please refresh the page and try again.');
                    }
                    setShowConfirmDelete({show: false, data: emptyShowConfirmDeleteData});
                }}
            />
            <EditModal
                formType={editModalFormData.formType}
                formData={editModalFormData}
                handleChange={handleChange}
                handleSubmit={async (event: any) => {
                    try {
                        await handleSubmitEdit(event, editModalFormData, pcData);
                        queryClient.refetchQueries({ queryKey: ['pcData', pcData.baseDetails.pcId]});
                        setEditModalFormData(emptyEditModalData);
                        triggerSuccessAlert(setShowSuccessAlert);
                    } catch (e) {
                        console.error(`Error submitting changes: ${e}`);
                        alert('Failed to save changes. Please refresh the page and try again');
                    }
                }}
                setFormData={setEditModalFormData}
                handleCancel={() => { setEditModalFormData(emptyEditModalData)}}
                pcData={pcData}
            />

            {showSuccessAlert && <SuccessAlert/>}

            {
                (pcData.baseDetails.spells && pcData.baseDetails.spells.length > 0) &&
                <Card>
                    <FormHeader
                        anchorTag="spells"
                        formTitle="Spells"
                        onClick={() => {
                            setShowSection({...emptyShowSectionData, spells: !showSection.spells});
                            setSearchParams();
                        }}
                        showForm={showSection.spells}
                    />
                    {
                        showSection.spells &&
                        mapSpells(pcData.baseDetails.spells, editable)
                    }
                </Card>
            }

            {
                (pcData.baseDetails.weapons && pcData.baseDetails.weapons.length > 0) &&
                <Card>
                <FormHeader
                    anchorTag="weapons"
                    formTitle="Weapons"
                    onClick={() => {
                        setShowSection({...emptyShowSectionData, weapons: !showSection.weapons});
                        setSearchParams();
                    }}
                    showForm={showSection.weapons}
                />
                {
                    showSection.weapons &&
                    pcData.baseDetails.weapons.sort((a,b) => {
                        const compA = a.name ?? a.type;
                        const compB = b.name ?? b.type;
                        if (compA < compB) return -1;
                        return 1;
                    }).map((weapon, i) => (
                        <Card key={i}>
                            <a id={weapon.id}></a>
                            <TitleButtonRow
                                text={formatWeaponDisplayTitle(weapon.type, weapon.name)}
                                buttons={
                                    <>
                                    <DeleteItemButton
                                        editable={editable}
                                        handleDelete={() => setShowConfirmDelete({
                                            show: true,
                                            data: {
                                                ...emptyShowConfirmDeleteData,
                                                displayName: formatWeaponDisplayTitle(weapon.type, weapon.name),
                                                objectArrayFieldName: 'weapons',
                                                objectArrayFullItem: weapon,
                                                objectArrayExistingItems: pcData.baseDetails.weapons                            
                                            }
                                        })}
                                    />
                                    <EditItemButton
                                        editable={editable}
                                        handleEdit={() => {
                                            setEditModalFormData({
                                                ...emptyEditModalData,
                                                formType: 'weapon',
                                                weaponId: weapon.id,
                                                displayName: formatWeaponDisplayTitle(weapon.type, weapon.name),
                                                name: weapon.name ?? '',
                                                description: weapon.description ?? '',
                                                damage: weapon.damage,
                                                damageType: weapon.damageType,
                                                type: weapon.type,
                                                modifierProperty: weapon.modifierProperty,
                                                magic: weapon.magic ? "true" : "false",
                                            })
                                        }}
                                    />    
                                    </>                               
                                }
                            />
                            {formatDataAsTable(orderAndFormatWeaponElements(weapon, pcData))}
                        </Card>
                    ))
                }
                </Card>
            }

            {
                (pcData.features && pcData.features.length > 0) &&
                <Card>
                    <FormHeader
                        anchorTag="features"
                        formTitle="Features"
                        onClick={() => {
                            setShowSection({...emptyShowSectionData, features: !showSection.features});
                            setSearchParams();
                        }}
                        showForm={showSection.features}
                    />
                    {
                        showSection.features &&
                        pcData.features.sort((a,b) => {
                            if (a.data.name < b.data.name) return -1;
                            return 1;
                        }).map(feature => (
                            <Card key={feature.id}>
                                <a id={removeWhiteSpaceAndConvertToLowerCase(feature.data.name)}></a>
                                <TitleButtonRow
                                    text={feature.data.name}
                                    buttons={
                                        <>
                                        <DeleteItemButton
                                            editable={editable}
                                            handleDelete={() => setShowConfirmDelete({
                                                show: true,
                                                data: {
                                                    ...emptyShowConfirmDeleteData,
                                                    featureId: feature.id,
                                                    displayName: feature.data.name
                                                }
                                            })}
                                        />
                                        <EditItemButton
                                            editable={editable}
                                            handleEdit={() => {
                                                setEditModalFormData({
                                                    ...emptyEditModalData,
                                                    formType: 'feature',
                                                    displayName: feature.data.name,
                                                    name: feature.data.name,
                                                    description: feature.data.description,
                                                    damage: feature.data.damage ?? '',
                                                    damageType: feature.data.damageType ?? '',
                                                    sourceUrl: feature.data.sourceUrl ?? '',
                                                    featureId: feature.id,
                                                    source: feature.data.source,
                                                    maxUses: feature.data.maxUses ? String(feature.data.maxUses) : '',
                                                    refresh: feature.data.refresh ?? '',
                                                    saveDC: feature.data.saveDC ? String(feature.data.saveDC) : ''
                                                })
                                            }}
                                        />
                                        </>
                                    }
                                />
                                <div className="content">
                                    <p><b>Description: </b>{feature.data.description}</p>
                                    <p><b>Source: </b>{feature.data.source}</p>
                                    { feature.data.damage && <p><b>Damage: </b>{feature.data.damage} {feature.data.damageType}</p>}
                                    { feature.data.saveDC && <p><b>Spell Save DC: </b>{feature.data.saveDC}</p>}
                                    { feature.data.sourceUrl && <p><b>Source URL: </b><a href={feature.data.sourceUrl} target="_blank">{feature.data.sourceUrl}</a></p>}
                                </div>                            
                            </Card>
                        ))
                    }
                </Card>
            }

            {
                (pcData.summonables && pcData.summonables.length > 0) &&
                <Card>
                    <FormHeader
                        anchorTag="summonables"
                        formTitle="Summonables"
                        onClick={() => {
                            setShowSection({...emptyShowSectionData, summonables: !showSection.summonables});
                            setSearchParams();
                        }}
                        showForm={showSection.summonables}
                    />
                    {
                        showSection.summonables &&
                        pcData.summonables?.sort((a,b) => {
                            const aComparable = a.data.name ?? a.data.type;
                            const bComparable = b.data.name ?? b.data.type;
                            if (aComparable < bComparable) return -1;
                            return 1;
                        }).map(s => (
                            <Card key={s.id}>
                                <a id={s.id}></a>
                                <TitleButtonRow
                                    text={s.data.name ? `${s.data.name} (${s.data.type})` : s.data.type}
                                    buttons={
                                        <>
                                        <DeleteItemButton
                                            editable={editable}
                                            handleDelete={() => setShowConfirmDelete({
                                                show: true,
                                                data: {
                                                    ...emptyShowConfirmDeleteData,
                                                    summonableId: s.id,
                                                    displayName: s.data.name ? `${s.data.name} (${s.data.type})` : s.data.type
                                                }
                                            })}
                                        />
                                        <EditItemButton
                                            editable={editable}
                                            handleEdit={() => {
                                                setEditModalFormData({
                                                    ...emptyEditModalData,
                                                    formType: 'summonable',
                                                    displayName: s.data.name ? `${s.data.name} (${s.data.type})` : s.data.type,
                                                    summonableId: s.id,
                                                    type: s.data.type,
                                                    name: s.data.name ?? '',
                                                    description: s.data.description,
                                                    sourceType: s.data.source.type,
                                                    sourceName: s.data.source.name,
                                                    hitPointMaximum: String(s.data.hitPoints.max),
                                                    hitPointsCurrent: String(s.data.hitPoints.current),
                                                    armorClass: String(s.data.armorClass),
                                                    summoned: s.data.summoned ? "true" : "false"
                                                })
                                            }}
                                        />
                                        </>
                                    }
                                />
                                <div className="content">
                                    <p><b>Description: </b>{s.data.description}</p>
                                    <p><b>Source: </b>{s.data.source.name} ({capitalize(s.data.source.type)})</p>
                                    <p><b>Max HP: </b>{s.data.hitPoints.max}</p>
                                    <p><b>Armor Class: </b>{s.data.armorClass}</p>
                                </div>                            
                            </Card>
                        ))
                    }
                </Card>
            }
            
            {
                (pcData.baseDetails.equipment && pcData.baseDetails.equipment.length > 0) &&
                <Card>
                <FormHeader
                    anchorTag="equipment"
                    formTitle="Equipment"
                    onClick={() => {
                        setShowSection({...emptyShowSectionData, equipment: !showSection.equipment});
                        setSearchParams();
                    }}
                    showForm={showSection.equipment}
                />
                {
                    showSection.equipment &&
                    pcData.baseDetails.equipment.sort((a, b) => {
                        if (a.type < b.type) return -1;
                        return 1;
                    }).map((item, i) =>
                        <Card key={i}>
                            <TitleButtonRow
                                text={item.type}
                                buttons={
                                    <>
                                    <DeleteItemButton
                                        editable={editable}
                                        handleDelete={() => setShowConfirmDelete({
                                            show: true,
                                            data: {
                                                ...emptyShowConfirmDeleteData,
                                                displayName: item.type,
                                                objectArrayFieldName: 'equipment',
                                                objectArrayExistingItems: pcData.baseDetails.equipment,
                                                objectArrayFullItem: item                            
                                            }
                                        })}
                                    />
                                    <EditItemButton
                                        editable={editable}
                                        handleEdit={() => {
                                            setEditModalFormData({
                                                ...emptyEditModalData,
                                                formType: 'equipment',
                                                equipmentId: item.id,
                                                displayName: item.type,
                                                type: item.type,
                                                description: item.description ?? '',
                                            })
                                        }}
                                    />
                                    </>
                                }
                            />
                            <div className="content">
                                {item.description && <p><i>{item.description}</i></p>}
                            </div>
                        </Card>
                    )
                }
                </Card>
            }
            
            {
                (pcData.baseDetails.languages && pcData.baseDetails.languages.length > 0) &&
                <Card>
                <FormHeader
                    anchorTag="languages"
                    formTitle="Languages"
                    onClick={() => {
                        setShowSection({...emptyShowSectionData, languages: !showSection.languages});
                        setSearchParams();
                    }}
                    showForm={showSection.languages}
                />
                {
                    showSection.languages &&
                    pcData.baseDetails.languages.sort().map((language, i) => (
                        <Card key={i}>
                        <TitleButtonRow
                            text={language}
                            formatAsHeader={false}
                            buttons={
                                <>
                                <DeleteItemButton
                                    editable={editable}
                                    handleDelete={() => setShowConfirmDelete({
                                        show: true,
                                        data: {
                                            ...emptyShowConfirmDeleteData,
                                            stringArrayFieldName: 'languages',
                                            stringArrayItemName: language,
                                            displayName: language                       
                                        }
                                    })}
                                />
                                <EditItemButton
                                        editable={editable}
                                        handleEdit={() => {
                                            setEditModalFormData({
                                                ...emptyEditModalData,
                                                formType: 'language',
                                                displayName: language,
                                                stringArrayFieldName: 'languages',
                                                language: language,
                                                originalItem: language
                                            })
                                        }}
                                    />
                                </>
                            }
                        />
                        </Card>
                    ))
                }
                </Card>
            }
            
            {
                (pcData.baseDetails.proficiencies && pcData.baseDetails.proficiencies.length > 0) &&
                <Card>
                <FormHeader
                    anchorTag="proficiencies"
                    formTitle="Proficiencies"
                    onClick={() => {
                        setShowSection({...emptyShowSectionData, proficiencies: !showSection.proficiencies});
                        setSearchParams();
                    }}
                    showForm={showSection.proficiencies}
                />
                {
                    showSection.proficiencies &&
                    pcData.baseDetails.proficiencies.sort().map((proficiency, i) => (
                        <Card key={i}>
                            <TitleButtonRow
                                text={proficiency}
                                formatAsHeader={false}
                                buttons={
                                    <>
                                    <DeleteItemButton
                                        editable={editable}
                                        handleDelete={() => setShowConfirmDelete({
                                            show: true,
                                            data: {
                                                ...emptyShowConfirmDeleteData,
                                                stringArrayFieldName: 'proficiencies',
                                                stringArrayItemName: proficiency,
                                                displayName: proficiency                          
                                            }
                                        })}
                                    />
                                    <EditItemButton
                                        editable={editable}
                                        handleEdit={() => {
                                            setEditModalFormData({
                                                ...emptyEditModalData,
                                                formType: 'proficiency',
                                                displayName: proficiency,
                                                stringArrayFieldName: 'proficiencies',
                                                proficiency: proficiency,
                                                originalItem: proficiency
                                            })
                                        }}
                                    />
                                    </>
                                }
                            />
                        </Card>
                    ))
                }
                </Card>
            }
            
            {
                (pcData.baseDetails.notes && pcData.baseDetails.notes.length > 0) &&
                <Card>
                <FormHeader
                    anchorTag="notes"
                    formTitle="Notes"
                    onClick={() => {
                        setShowSection({...emptyShowSectionData, notes: !showSection.notes});
                        setSearchParams();
                    }}
                    showForm={showSection.notes}
                />
                {
                    showSection.notes &&
                    pcData.baseDetails.notes.sort().map((note, i) => (
                        <Card key={i}>
                            <TitleButtonRow
                                text={String(i + 1)}
                                buttons={
                                    <>
                                    <DeleteItemButton
                                        editable={editable}
                                        handleDelete={() => setShowConfirmDelete({
                                            show: true,
                                            data: {
                                                ...emptyShowConfirmDeleteData,
                                                stringArrayFieldName: 'notes',
                                                stringArrayItemName: note,
                                                displayName: `Note ${i + 1}`,                           
                                            }
                                        })}
                                    />
                                    <EditItemButton
                                        editable={editable}
                                        handleEdit={() => {
                                            setEditModalFormData({
                                                ...emptyEditModalData,
                                                formType: 'note',
                                                displayName: `Note ${i + 1}`,
                                                stringArrayFieldName: 'notes',
                                                note: note,
                                                originalItem: note,
                                                useTextArea: true
                                            })
                                        }}
                                    />
                                    </>
                                }
                            />
                            <div className="content">
                                <p>{note}</p>
                            </div>
                        </Card>
                    ))
                }
                </Card>
            }
            
            {
                hasItems &&
                <div className="div-button">
                    <Button customClass="float-right" buttonType={ButtonType.DANGER} text={editable ? "Lock" : "Unlock"} onClick={() => {setEditable(!editable)}}/>
                </div>
            }
            {
                !hasItems &&
                <Card>
                    {pcData.baseDetails.name.firstName} {pcData.baseDetails.name.lastName} is looking a little empty-handed.
                    Want to give them some stuff?
                    <Button
                        buttonType={ButtonType.INFO}
                        text="Add Items"
                        onClick={() => {navigate('/add')}}
                    />
                </Card>
            }
            <AboutFooter/>
        </div>
        <QuickNav/>
        </>
    )
}

export default Details;
