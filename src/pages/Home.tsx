import Navbar from "../components/Navbar";
import { OsoniaSilverhand as pc } from "../data/playerCharacters/OsoniaSilverhand";
import ImageCard from "../components/cards/ImageCard";
import Footer from "../components/Footer";
import { db } from '../firebase';
import * as config from '../data/config.json';

function Home() {
    const loadData = () => {
        console.log('Loading data');
        const getPCData = async () => {
            try {
                console.log('Getting base character details.');
                // Get base character details
                // const docRef = doc(db, "pcBaseDetails", config.pcId);
                const docRef = db.collection('pcBaseDetails').doc(config.pcId);
                const docSnap = await docRef.get();
                if (docSnap.data()) {
                    console.log("Document data:", docSnap.data());
                } else {
                    console.log("No such document!");
                    return {};
                }

                // Get ability scores
                console.log('getting ability scores.');
                const queryRef = db.collection('abilityScores').where("pcId", "==", config.pcId);
                const querySnapshot = await queryRef.get();
                querySnapshot.forEach((doc) => {
                    console.log(doc.id, " => ", doc.data());
                });

                // Format
                return {...docSnap.data, ...querySnapshot}
            } catch (e) {
                throw Error(JSON.stringify(e));
            }
        };
        return getPCData();
    };
    const data = loadData();

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
