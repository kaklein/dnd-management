import Navbar from "@components/Navbar";
import ImageCard from "@components/cards/ImageCard";
import Footer from "@components/Footer";
import { BaseDetails, PlayerCharacter } from "@models/playerCharacter/PlayerCharacter";
import PageHeaderBarPC from "@components/headerBars/PageHeaderBarPC";

interface Props {
    pcData: PlayerCharacter;
    pcList: BaseDetails[];
    selectedPc: {pcId: string | null, setSelectedPcId: (pcId: string) => void}
}

function Overview({pcData, pcList, selectedPc}: Props) {
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
            <Navbar isSelectedPc={!!selectedPc.pcId}/>
            <PageHeaderBarPC
                pcName={`${pcData.baseDetails.name.firstName} ${pcData.baseDetails.name.lastName}`}
                pcList={pcList}
                pageName="Overview"
                selectedPc={selectedPc}
            />
            <ImageCard title={pcFullName} description={pcData.baseDetails.description ?? ''} imagePath={pcImagePath && `/images/playerCharacters/${pcImagePath}`} data={listCardObject}/>
            <Footer/>
        </>
    )
}

export default Overview;
