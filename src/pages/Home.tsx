/**
Will contain:
- Character image
- Character name
- Basic info (race, class, subclass, etc.)
- Brief description
 */
import Navbar from "../components/Navbar";
import { OsoniaSilverhand as pc } from "../data/playerCharacters/OsoniaSilverhand";
import ImageCard from "../components/cards/ImageCard";

function Home() {
    const pcImagePath = `../src/assets/images/${pc.name.firstName.toLowerCase()}_${pc.name.lastName.toLowerCase()}.png`;
    const pcFullName = `${pc.name.firstName} ${pc.name.lastName}`
    const pcDescription = 'The blacksmith fighter who just wants to help people by getting as strong as possible.';
    const listCardObject = {
        class: pc.class,
        subclass: pc.subclass,
        race: pc.race,
        background: pc.background,
        level: pc.level,
        alignment: pc.alignment,
        ['Player Name']: pc.playerName,
    };

    return (
        <>
            <Navbar/>
            <ImageCard title={pcFullName} description={pcDescription} imagePath={pcImagePath} data={listCardObject}/>
        </>
    )
}

export default Home;
