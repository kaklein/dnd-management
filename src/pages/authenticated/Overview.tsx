import Navbar from "@components/Navbar";
import ImageCard from "@components/cards/ImageCard";
import { BaseDetails, PlayerCharacter } from "@models/playerCharacter/PlayerCharacter";
import PageHeaderBarPC from "@components/headerBars/PageHeaderBarPC";
import QuickNav from "@components/QuickNav";
import { UserRole } from "@services/firestore/enum/UserRole";

interface Props {
    pcData: PlayerCharacter;
    pcList: BaseDetails[];
    selectedPc: {pcId: string | null, setSelectedPcId: (pcId: string) => void}
    userRole: UserRole | undefined;
}

function Overview({pcData, pcList, selectedPc, userRole}: Props) {
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

    return (
        <>
        <div className="main-body">
            <Navbar isSelectedPc={!!selectedPc.pcId} userRole={userRole}/>
            <PageHeaderBarPC
                pcName={`${pcData.baseDetails.name.firstName} ${pcData.baseDetails.name.lastName}`}
                pcList={pcList}
                pageName="Overview"
                selectedPc={selectedPc}
            />
            <ImageCard title={pcFullName} description={pcData.baseDetails.description ?? ''} imagePath={pcImagePath && `/images/playerCharacters/${pcImagePath}`} data={listCardObject}/>
        </div>
        <QuickNav/>
        </>
    )
}

export default Overview;
