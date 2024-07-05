import Navbar from "../components/Navbar";
import { OsoniaSilverhand as pc } from "../data/playerCharacters/OsoniaSilverhand";
import ImageCard from "../components/cards/ImageCard";
import Footer from "../components/Footer";

function Home(data: any) {
    const pcImagePath = `../src/assets/images/${pc.name.firstName.toLowerCase()}_${pc.name.lastName.toLowerCase()}.png`;
    const pcFullName = `${pc.name.firstName} ${pc.name.lastName}`
    const pcDescription = 'The blacksmith fighter who just wants to help people by getting as strong as possible.';
    const listCardObject = {
        class: pc.class,
        subclass: pc.subclass,
        race: pc.race,
        background: pc.background,
        alignment: pc.alignment,
        level: pc.level,
        ...(pc.xp && {XP: pc.xp}),
        ['Player Name']: pc.playerName,
    };

    return (
        <>
            <Navbar/>
            <p>{JSON.stringify(data)}</p>
            <ImageCard title={pcFullName} description={pcDescription} imagePath={pcImagePath} data={listCardObject}/>
            <Footer/>
        </>
    )
}

export default Home;
