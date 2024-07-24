import Navbar from "@components/Navbar";
import Footer from "@components/Footer";
import Card from "@components/cards/Card";
import { formatDataAsTable, orderAndFormatWeaponElements, removeWhiteSpaceAndConvertToLowerCase } from "@components/utils";
import { Spell } from "@models/playerCharacter/Spell";
import { BaseDetails, PlayerCharacter } from "@models/playerCharacter/PlayerCharacter";
import PageHeaderBarPC from "@components/headerBars/PageHeaderBarPC";
import Button, { ButtonType } from "@components/Button";
import { useState } from "react";
import { deleteItemById, deleteItemFromArrayById, deleteItemFromStringArray } from "@services/firestore/crud/delete";
import { CollectionName } from "@services/firestore/enum/CollectionName";
import Alert from "@components/Alert";
import { QueryClient } from "@tanstack/react-query";
import ConfirmDelete from "@components/ConfirmDelete";
import { ShowConfirmDeleteData } from "@models/ShowConfirmDeleteData";
import { TitleButtonRow } from "@components/TitleButtonRow";

interface Props {
    pcData: PlayerCharacter;
    pcList: BaseDetails[];
    selectedPc: {pcId: string | null, setSelectedPcId: (pcId: string) => void};
    queryClient: QueryClient;
}

function Details({pcData, pcList, selectedPc, queryClient}: Props) {
    const [showSuccessAlert, setShowSuccessAlert] = useState(false);
    const triggerSuccessAlert = () => {
        setShowSuccessAlert(true);
        setTimeout(() => {
            setShowSuccessAlert(false);
        }, 2000);
    };

    const [editable, setEditable] = useState(false);
    const handleDeleteFeature = async (featureId: string) => {
        await deleteItemById(CollectionName.FEATURES, featureId);
        queryClient.invalidateQueries();
        triggerSuccessAlert();
    }
    const handleDeleteObjectArrayItem = async (arrayName: string, item: any, existingItems: any[]) => {
        await deleteItemFromArrayById(CollectionName.PC_BASE_DETAILS, pcData.baseDetails.pcId, arrayName, existingItems, item);
        queryClient.invalidateQueries();
        triggerSuccessAlert();
    }
    const handleDeleteStringArrayItem = async (arrayName: string, item: string) => {
        await deleteItemFromStringArray(CollectionName.PC_BASE_DETAILS, pcData.baseDetails.pcId, arrayName, item);
        queryClient.invalidateQueries();
        triggerSuccessAlert();
    }

    const emptyShowConfirmDeleteData: ShowConfirmDeleteData = {
        displayName: '',
        featureId: '',
        objectArrayFieldName: '',
        objectArrayExistingItems: [],
        objectArrayFullItem: {},
        stringArrayItemName: '',
        stringArrayFieldName: ''
    };
    const [showConfirmDelete, setShowConfirmDelete] = useState({show: false, data: emptyShowConfirmDeleteData});

    const mapSpells = (
        spells: Spell[], 
        editable: boolean, 
    ) => {    
        return (
            spells.sort((a, b) => {
                if (a.level < b.level) return -2;
                if (a.name < b.name) return -1;
                return 1;
            }).map((spell, i) => (
                <Card key={i}>
                    <a id={removeWhiteSpaceAndConvertToLowerCase(spell.name)}></a>
                    <TitleButtonRow
                        text={spell.name}
                        button={editable ? 
                            <Button buttonType={ButtonType.DANGER} text="DELETE" onClick={() => setShowConfirmDelete({
                                show: true,
                                data: {
                                    ...emptyShowConfirmDeleteData,
                                    displayName: spell.name,
                                    objectArrayFieldName: 'spells',
                                    objectArrayFullItem: spell,
                                    objectArrayExistingItems: spells                           
                                }
                            })}/>
                            :
                            undefined
                        }
                    />                        
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

    return (
        <>
            <Navbar isSelectedPc={!!selectedPc.pcId}/>

            <PageHeaderBarPC 
                pcName={`${pcData.baseDetails.name.firstName} ${pcData.baseDetails.name.lastName}`}
                pageName="Details"
                pcList={pcList}
                selectedPc={selectedPc}
            />

            {
                showConfirmDelete.show &&
                <ConfirmDelete
                    show={showConfirmDelete.show}
                    setShow={setShowConfirmDelete}
                    clearedData={emptyShowConfirmDeleteData}
                    itemName={showConfirmDelete.data.displayName}
                    handleCancel={() => {setShowConfirmDelete({show: false, data: emptyShowConfirmDeleteData})}}
                    handleDelete={() => {
                        if(showConfirmDelete.data.featureId) {
                            handleDeleteFeature(showConfirmDelete.data.featureId);
                        } else if (showConfirmDelete.data.objectArrayFieldName) {
                            handleDeleteObjectArrayItem(showConfirmDelete.data.objectArrayFieldName, showConfirmDelete.data.objectArrayFullItem, showConfirmDelete.data.objectArrayExistingItems);
                        } else if (showConfirmDelete.data.stringArrayFieldName) {
                            handleDeleteStringArrayItem(showConfirmDelete.data.stringArrayFieldName, showConfirmDelete.data.stringArrayItemName);
                        } else {
                            console.error('Unprocessable data in state object.');
                            alert('Error deleting item. Please refresh the page and try again.');
                        }
                        setShowConfirmDelete({show: false, data: emptyShowConfirmDeleteData});
                    }}
                />
            }

            <div className="div-button">
                <Button buttonType={ButtonType.DANGER} text={editable ? "Lock" : "Unlock"} onClick={() => {setEditable(!editable)}}/>
            </div>
            {showSuccessAlert && <Alert alertText="Delete successful." className="successful-alert" iconFile="/images/icons/success-icon.png"/>}

            {
                pcData.baseDetails.spells &&
                <Card>
                    <h3>Spells</h3>
                    {mapSpells(pcData.baseDetails.spells, editable)}
                </Card>
            }

            {
                (pcData.features && pcData.features.length > 0) &&
                <Card>
                    <h3>Features</h3>
                    {
                    pcData.features.sort((a,b) => {
                        if (a.data.name < b.data.name) return -1;
                        return 1;
                    }).map(feature => (
                        <Card key={feature.id}>
                            <a id={removeWhiteSpaceAndConvertToLowerCase(feature.data.name)}></a>
                            <TitleButtonRow
                                text={feature.data.name}
                                button={
                                    editable ?
                                    <Button buttonType={ButtonType.DANGER} text="DELETE" onClick={() => setShowConfirmDelete({
                                        show: true,
                                        data: {
                                            ...emptyShowConfirmDeleteData,
                                            featureId: feature.id,
                                            displayName: feature.data.name,                              
                                        }
                                    })}/>
                                    : undefined
                                }
                            />
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
                    pcData.baseDetails.weapons.sort((a,b) => {
                        if (a.name < b.name) return -1;
                        return 1;
                    }).map((weapon, i) => (
                        <Card key={i}>
                            <a id={removeWhiteSpaceAndConvertToLowerCase(weapon.name)}></a>
                            <TitleButtonRow
                                text={weapon.name}
                                button={
                                    editable ?
                                    <Button buttonType={ButtonType.DANGER} text="DELETE" onClick={() => setShowConfirmDelete({
                                        show: true,
                                        data: {
                                            ...emptyShowConfirmDeleteData,
                                            displayName: weapon.name,
                                            objectArrayFieldName: 'weapons',
                                            objectArrayFullItem: weapon,
                                            objectArrayExistingItems: pcData.baseDetails.weapons                            
                                        }
                                    })}/>
                                    : undefined
                                }
                            />
                            {formatDataAsTable(orderAndFormatWeaponElements(weapon, pcData))}
                        </Card>
                    ))
                }
            </Card>

            <Card>
                <h3>Equipment</h3>
                {
                    pcData.baseDetails.equipment.sort((a, b) => {
                        if (a.type < b.type) return -1;
                        return 1;
                    }).map((item, i) =>
                        <Card key={i}>
                            <TitleButtonRow
                                text={item.type}
                                button={
                                    editable ?
                                    <Button buttonType={ButtonType.DANGER} text="DELETE" onClick={() => setShowConfirmDelete({
                                        show: true,
                                        data: {
                                            ...emptyShowConfirmDeleteData,
                                            displayName: item.type,
                                            objectArrayFieldName: 'equipment',
                                            objectArrayExistingItems: pcData.baseDetails.equipment,
                                            objectArrayFullItem: item                            
                                        }
                                    })}/>
                                    : undefined
                                }
                            />
                            {item.description && <p><i>{item.description}</i></p>}
                        </Card>
                    )
                }
            </Card>

            <Card>
                <h3>Languages</h3>
                {
                    pcData.baseDetails.languages.sort().map((language, i) => (
                        <Card key={i}>
                        <TitleButtonRow
                            text={language}
                            formatAsHeader={false}
                            button={
                                editable ?
                                <Button buttonType={ButtonType.DANGER} text="DELETE" onClick={() => setShowConfirmDelete({
                                    show: true,
                                    data: {
                                        ...emptyShowConfirmDeleteData,
                                        stringArrayFieldName: 'languages',
                                        stringArrayItemName: language,
                                        displayName: language                           
                                    }
                                })}/>
                                : undefined
                            }
                        />
                        </Card>
                    ))
                }
            </Card>

            <Card>
                <h3>Proficiencies</h3>
                {
                    pcData.baseDetails.proficiencies.sort().map((proficiency, i) => (
                        <Card key={i}>
                            <TitleButtonRow
                                text={proficiency}
                                formatAsHeader={false}
                                button={
                                    editable ?
                                    <Button buttonType={ButtonType.DANGER} text="DELETE" onClick={() => setShowConfirmDelete({
                                        show: true,
                                        data: {
                                            ...emptyShowConfirmDeleteData,
                                            stringArrayFieldName: 'proficiencies',
                                            stringArrayItemName: proficiency,
                                            displayName: proficiency                          
                                        }
                                    })}/>
                                    : undefined
                                }
                            />
                        </Card>
                    ))
                }
            </Card>

            <Card>
                <h3>Notes</h3>
                {pcData.baseDetails.notes &&
                    pcData.baseDetails.notes.sort().map((note, i) => (
                        <Card key={i}>
                            <TitleButtonRow
                                text={String(i + 1)}
                                button={
                                    editable ?
                                    <Button buttonType={ButtonType.DANGER} text="DELETE" onClick={() => setShowConfirmDelete({
                                        show: true,
                                        data: {
                                            ...emptyShowConfirmDeleteData,
                                            stringArrayFieldName: 'notes',
                                            stringArrayItemName: note,
                                            displayName: `Note ${i + 1}`,                         
                                        }
                                    })}/>
                                    : undefined
                                }
                            />
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
