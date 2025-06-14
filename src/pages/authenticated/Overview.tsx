import Navbar from "@components/Navbar";
import { BaseDetails, PlayerCharacter } from "@models/playerCharacter/PlayerCharacter";
import PageHeaderBarPC from "@components/headerBars/PageHeaderBarPC";
import QuickNav from "@components/QuickNav";
import { UserRole } from "@services/firestore/enum/UserRole";
import { useState } from "react";
import Card from "@components/cards/Card";
import { capitalize, formatDataAsTable } from "@components/utils";
import DeleteItemButton from "@components/DeleteItemButton";
import DeletePC from "@components/modals/DeletePC";
import { deletePC } from "@services/firestore/crud/delete";
import { useNavigate } from "react-router-dom";
import EditItemButton from "@components/EditItemButton";
import EditModal from "@components/modals/EditModal";
import { emptyEditModalData } from "@data/emptyFormData";
import { emptyRichTextContent, handleSubmitEdit, triggerSuccessAlert } from "@pages/utils";
import { QueryClient } from "@tanstack/react-query";
import SuccessAlert from "@components/alerts/SuccessAlert";
import AboutFooter from "@components/AboutFooter";
import { Alignment } from "@models/enum/Alignment";
import { SentryLogger } from "@services/sentry/logger";
import TestErrorButton from "@components/TestErrorButton";

interface Props {
    pcData: PlayerCharacter;
    pcList: BaseDetails[];
    selectedPc: {pcId: string | null, setSelectedPcId: (pcId: string) => void}
    userRole: UserRole | undefined;
    queryClient: QueryClient;
    imageUrl: string;
    logger: SentryLogger;
}

const getValidAlignment = (alignment: string): string => {
    if (Object.values(Alignment).includes(alignment as any)) return alignment;
    return Alignment.N_A;
}

function Overview({pcData, pcList, selectedPc, userRole, queryClient, imageUrl, logger}: Props) {
    const navigate = useNavigate();
    const pcFullName = `${pcData.baseDetails.name.firstName} ${pcData.baseDetails.name.lastName}`
    const listCardObject = {
        class: pcData.baseDetails.class,
        ['Hit Dice Type']: pcData.baseDetails.usableResources.hitDice.type,
        subclass: pcData.baseDetails.subclass,
        race: pcData.baseDetails.race,
        speed: pcData.baseDetails.speed,
        background: pcData.baseDetails.background,
        alignment: pcData.baseDetails.alignment,
        ...(pcData.baseDetails.defaultSpellCastingAbility && {['Spellcasting Ability']: capitalize(pcData.baseDetails.defaultSpellCastingAbility)})
    };
    const [showPCDelete, setShowPCDelete] = useState('');
    const handleDeleteCharacter = async () => {
        await deletePC(pcData.baseDetails.pcId, pcData.baseDetails.imagePath);
        localStorage.removeItem('selectedPcId');
        navigate(`/home?deleted=${pcData.baseDetails.name.firstName}_${pcData.baseDetails.name.lastName}`);
        location.reload();
    }
    const [editModalFormData, setEditModalFormData] = useState(emptyEditModalData);
    const [initialEditorContent, setInitialEditorContent] = useState(editModalFormData.description);
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
        />
        <EditModal
            formType={editModalFormData.formType}
            formData={editModalFormData}
            handleChange={handleChange}
            handleSubmit={async (event: any) => {
                try {
                    await handleSubmitEdit(event, editModalFormData, pcData, logger);
                    queryClient.refetchQueries({ queryKey: ['pcData', pcData.baseDetails.pcId]});
                    setEditModalFormData(emptyEditModalData);
                    triggerSuccessAlert(setShowSuccessAlert);
                } catch (e) {
                    logger.logError(`Error submitting changes: ${e}`);
                    alert('Failed to save changes. Please refresh the page and try again');
                }
            }}
            setFormData={setEditModalFormData}
            initialEditorContent={initialEditorContent}
            handleCancel={() => setEditModalFormData(emptyEditModalData)}
            pcData={pcData}
            imageUrl={imageUrl}
            logger={logger}
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
                <div className="card-body">
                    <h4 className="section-header-rounded">{pcFullName}</h4>
                    {
                    imageUrl && 
                    <div className="pc-image-container">
                        <img src={imageUrl} id="pc-image-display" className="card-img-top" alt={pcFullName}/>
                    </div>
                    }
                    <div className="overview-top">
                        <h5 className="left-justify">Level: {pcData.baseDetails.level}</h5>
                        {
                            (pcData.baseDetails.xp !== '' && pcData.baseDetails.xp != undefined && pcData.baseDetails.xp >= 0) && 
                            <h5 className="left-justify">XP: {pcData.baseDetails.xp}</h5>
                        }
                        <h5 className="left-justify">Max Hit Points: {pcData.baseDetails.usableResources.hitPoints.max}</h5>
                    </div>
                    
                    {
                        (pcData.baseDetails.description && pcData.baseDetails.description != emptyRichTextContent)  &&
                        <div className="long-text-display card-text bottom-border" dangerouslySetInnerHTML={{__html: pcData.baseDetails.description}}/>
                    }

                    {formatDataAsTable(listCardObject)}
              </div>
              <div className="container-fluid">
                <div className="row">
                    <div className="col"></div>
                    <div className="col-auto no-padding">
                        <DeleteItemButton
                            customClass="small-margin"
                            handleDelete={() => setShowPCDelete(`${pcData.baseDetails.name.firstName} ${pcData.baseDetails.name.lastName}`)}                                
                            iconAndText={true}
                        />
                    </div>
                    <div className="col-auto no-padding">
                        <EditItemButton
                            customClass="small-margin"
                            iconAndText={true}
                            handleEdit={() => {
                                setEditModalFormData({
                                    ...emptyEditModalData,
                                    formType: 'character',
                                    firstName: pcData.baseDetails.name.firstName,
                                    lastName: pcData.baseDetails.name.lastName,
                                    description: pcData.baseDetails.description ?? '',
                                    imagePath: pcData.baseDetails.imagePath ?? '',
                                    class: pcData.baseDetails.class,
                                    subclass: pcData.baseDetails.subclass ?? '',
                                    race: pcData.baseDetails.race,
                                    background: pcData.baseDetails.background,
                                    alignment: getValidAlignment(pcData.baseDetails.alignment),
                                    defaultSpellCastingAbility: pcData.baseDetails.defaultSpellCastingAbility ?? '',
                                    level: String(pcData.baseDetails.level),
                                    maxHP: String(pcData.baseDetails.usableResources.hitPoints.max),
                                    armorClass: String(pcData.baseDetails.armorClass),
                                    speed: String(pcData.baseDetails.speed),
                                    xp: String(pcData.baseDetails.xp ?? ''),
                                    hitDiceType: pcData.baseDetails.usableResources.hitDice.type,
                                });
                                setInitialEditorContent(pcData.baseDetails.description ?? emptyRichTextContent);
                            }}
                        />
                    </div>
                </div>
              </div>
            </Card>
            <TestErrorButton displayInStaging={true}/>
            <AboutFooter/>
        </div>
        
        <QuickNav/>
        </>
    )
}

export default Overview;
