import Navbar from "@components/Navbar";
import { BaseDetails, PlayerCharacter } from "@models/playerCharacter/PlayerCharacter";
import PageHeaderBarPC from "@components/headerBars/PageHeaderBarPC";
import QuickNav from "@components/QuickNav";
import { UserRole } from "@services/firestore/enum/UserRole";
import Button, { ButtonType } from "@components/Button";
import { useState } from "react";
import Card from "@components/cards/Card";
import { formatDataAsTable } from "@components/utils";
import TitleButtonRow from "@components/TitleButtonRow";
import DeleteItemButton from "@components/DeleteItemButton";
import DeletePC from "@components/modals/DeletePC";
import { deletePC } from "@services/firestore/crud/delete";
import { useNavigate } from "react-router-dom";
import EditItemButton from "@components/EditItemButton";
import EditModal from "@components/modals/EditModal";
import { emptyEditModalData } from "@data/emptyFormData";
import { handleSubmitEdit, triggerSuccessAlert } from "@pages/utils";
import { QueryClient } from "@tanstack/react-query";
import SuccessAlert from "@components/alerts/SuccessAlert";
import AboutFooter from "@components/AboutFooter";

interface Props {
    pcData: PlayerCharacter;
    pcList: BaseDetails[];
    selectedPc: {pcId: string | null, setSelectedPcId: (pcId: string) => void}
    userRole: UserRole | undefined;
    queryClient: QueryClient;
}

function Overview({pcData, pcList, selectedPc, userRole, queryClient}: Props) {
    const navigate = useNavigate();
    const pcImagePath = pcData.baseDetails.imagePaths?.avatar;
    const pcFullName = `${pcData.baseDetails.name.firstName} ${pcData.baseDetails.name.lastName}`
    const listCardObject = {
        class: pcData.baseDetails.class,
        ['Hit Dice Type']: pcData.baseDetails.usableResources.hitDice.type,
        subclass: pcData.baseDetails.subclass,
        race: pcData.baseDetails.race,
        speed: pcData.baseDetails.speed,
        background: pcData.baseDetails.background,
        alignment: pcData.baseDetails.alignment,
    };
    const [editable, setEditable] = useState(false);
    const [showPCDelete, setShowPCDelete] = useState('');
    const handleDeleteCharacter = async () => {
        await deletePC(pcData.baseDetails.pcId);
        localStorage.removeItem('selectedPcId');
        navigate(`/home?deleted=${pcData.baseDetails.name.firstName}_${pcData.baseDetails.name.lastName}`);
        location.reload();
    }
    const [editModalFormData, setEditModalFormData] = useState(emptyEditModalData)
    const [showSuccessAlert, setShowSuccessAlert] = useState(false);
    const handleChange = (
        event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>, 
        setFunction: (prevFormData: any) => void
    ) => {
        const { name, value } = event.target;
        setFunction((prevFormData: any) => ({...prevFormData, [name]: value}));
    };

    return (
        <>
        <DeletePC
            pcName={showPCDelete}
            handleCancel={() => {
                setShowPCDelete('');
            }}
            handleDelete={handleDeleteCharacter}
            setEditable={setEditable}
        />
        <EditModal
            formType={editModalFormData.formType}
            formData={editModalFormData}
            handleChange={handleChange}
            handleSubmit={async (event: any) => {
                try {
                    await handleSubmitEdit(event, editModalFormData, pcData);
                    queryClient.invalidateQueries();
                    setEditable(false);
                    triggerSuccessAlert(setShowSuccessAlert);
                } catch (e) {
                    console.error(`Error submitting changes: ${e}`);
                    alert('Failed to save changes. Please refresh the page and try again');
                }
            }}
            setFormData={setEditModalFormData}
            handleCancel={() => setEditModalFormData(emptyEditModalData)}
            pcData={pcData}
        />
        {showSuccessAlert && <SuccessAlert/>}

        <div className="main-body">
            <Navbar isSelectedPc={!!selectedPc.pcId} userRole={userRole}/>
            <PageHeaderBarPC
                pcName={`${pcData.baseDetails.name.firstName} ${pcData.baseDetails.name.lastName}`}
                pcList={pcList}
                pageName="Overview"
                selectedPc={selectedPc}
            />
            <Card>
                {pcImagePath && <img src={`/images/playerCharacters/${pcImagePath}`} className="card-img-top" alt={pcFullName}/>}
                <div className="card-body">
                    <TitleButtonRow
                        text={pcFullName}
                        customColor="dark-purple"
                        buttons={
                            editable &&
                            <>
                            <DeleteItemButton
                                editable={editable}
                                handleDelete={() => setShowPCDelete(`${pcData.baseDetails.name.firstName} ${pcData.baseDetails.name.lastName}`)}
                                customDeleteText="Delete Character"
                            />
                            <EditItemButton
                                editable={editable}
                                handleEdit={() => {
                                    setEditModalFormData({
                                        ...emptyEditModalData,
                                        formType: 'character',
                                        description: pcData.baseDetails.description ?? '',
                                        class: pcData.baseDetails.class,
                                        subclass: pcData.baseDetails.subclass ?? '',
                                        race: pcData.baseDetails.race,
                                        background: pcData.baseDetails.background,
                                        alignment: pcData.baseDetails.alignment,
                                        level: String(pcData.baseDetails.level),
                                        maxHP: String(pcData.baseDetails.usableResources.hitPoints.max),
                                        armorClass: String(pcData.baseDetails.armorClass),
                                        speed: String(pcData.baseDetails.speed),
                                        xp: String(pcData.baseDetails.xp) ?? '',
                                        hitDiceType: pcData.baseDetails.usableResources.hitDice.type,
                                    });
                                }}
                            />
                            </>
                        }
                    />
                    <div className="overview-top">
                        <h5 className="left-justify">Level: {pcData.baseDetails.level}</h5>
                        {
                            (pcData.baseDetails.xp !== '' && pcData.baseDetails.xp != undefined && pcData.baseDetails.xp >= 0) && 
                            <h5 className="left-justify">XP: {pcData.baseDetails.xp}</h5>
                        }
                        <h5 className="left-justify">Max Hit Points: {pcData.baseDetails.usableResources.hitPoints.max}</h5>
                    </div>
                    
                    {
                        pcData.baseDetails.description &&
                        <p className="card-text bottom-border">{pcData.baseDetails.description}</p>                        
                    }

                    {formatDataAsTable(listCardObject)}
              </div>
            </Card>
            <div className="div-button">
                <Button customClass="float-right" buttonType={ButtonType.DANGER} text={editable ? "Lock" : "Unlock"} onClick={() => {setEditable(!editable)}}/>
            </div>
            <AboutFooter/>
        </div>
        
        <QuickNav/>
        </>
    )
}

export default Overview;
