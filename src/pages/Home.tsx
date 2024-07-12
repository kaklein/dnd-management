import Navbar from "@components/Navbar";
import ImageCard from "@components/cards/ImageCard";
import Footer from "@components/Footer";
import { PlayerCharacter } from "@models/playerCharacter/PlayerCharacter";
import PageHeaderBar from "@components/PageHeaderBar";

interface Props {
    pcData: PlayerCharacter
}

function Home({pcData}: Props) {
    const pcImagePath = `/images/playerCharacters/${pcData.baseDetails.name.firstName.toLowerCase()}_${pcData.baseDetails.name.lastName.toLowerCase()}.png`;
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
            <Navbar/>
            <PageHeaderBar 
                pcName={`${pcData.baseDetails.name.firstName} ${pcData.baseDetails.name.lastName}`}
                pageName="Overview"
            />
            <ImageCard title={pcFullName} description={pcData.baseDetails.description ?? ''} imagePath={pcImagePath} data={listCardObject}/>
            <Footer/>
        </>
    )
}

export default Home;
