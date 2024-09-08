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

interface Props {
    pcData: PlayerCharacter;
    pcList: BaseDetails[];
    selectedPc: {pcId: string | null, setSelectedPcId: (pcId: string) => void}
    userRole: UserRole | undefined;
}

function Overview({pcData, pcList, selectedPc, userRole}: Props) {
    const navigate = useNavigate();
    const pcImagePath = pcData.baseDetails.imagePaths?.avatar;
    const pcFullName = `${pcData.baseDetails.name.firstName} ${pcData.baseDetails.name.lastName}`
    const listCardObject = {
        class: pcData.baseDetails.class,
        subclass: pcData.baseDetails.subclass,
        race: pcData.baseDetails.race,
        background: pcData.baseDetails.background,
        alignment: pcData.baseDetails.alignment,
        level: pcData.baseDetails.level,
        ...(pcData.baseDetails.xp && {XP: pcData.baseDetails.xp}),
        ['Player Name']: pcData.baseDetails.playerName,
    };
    const [editable, setEditable] = useState(false);
    const [showPCDelete, setShowPCDelete] = useState('');
    const handleDeleteCharacter = async () => {
        await deletePC(pcData.baseDetails.pcId);
        localStorage.removeItem('selectedPcId');
        navigate(`/home?deleted=${pcData.baseDetails.name.firstName}_${pcData.baseDetails.name.lastName}`);
        location.reload();
    }

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
                        buttons={
                            editable &&
                            <DeleteItemButton
                                editable={editable}
                                handleDelete={() => setShowPCDelete(`${pcData.baseDetails.name.firstName} ${pcData.baseDetails.name.lastName}`)}
                                customDeleteText="Delete Character"
                            />
                        }
                    />
                    <p className="card-text center">{pcData.baseDetails.description ?? ''}</p>
                    {formatDataAsTable(listCardObject)}
              </div>
            </Card>
            <div className="div-button">
                <Button buttonType={ButtonType.DANGER} text={editable ? "Lock" : "Unlock"} onClick={() => {setEditable(!editable)}}/>
            </div>
        </div>
        
        <QuickNav/>
        </>
    )
}

export default Overview;
