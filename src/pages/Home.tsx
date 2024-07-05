import Navbar from "../components/Navbar";
import { OsoniaSilverhand as pc } from "../data/playerCharacters/OsoniaSilverhand";
import ImageCard from "../components/cards/ImageCard";
import Footer from "../components/Footer";
import { doc, getDoc } from "firebase/firestore";
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import { formatDataAsTable } from "../components/utils";
const config = require('../data/config.json');

function Home() {
    const loadData = () => {
        console.log('Loading data');
        const getPCData = async () => {
            try {
                console.log('Getting base character details.');
                // Get base character details
                const docRef = doc(db, "pcBaseDetails", config.pcId);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    console.log("Document data:", docSnap.data());
                } else {
                    console.log("No such document!");
                    return {};
                }

                // Get ability scores
                console.log('getting ability scores.');
                const asQuery = query(collection(db, "abilityScores"), where("pcId", "==", config.pcId));
                const asQuerySnapshot = await getDocs(asQuery);
                asQuerySnapshot.forEach((doc) => {
                    console.log(doc.id, " => ", doc.data());
                });

                // Format
                return {...docSnap.data, ...asQuerySnapshot}
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
            <p>Please Work :)</p>
            <div>
                {formatDataAsTable(data)}
            </div>
            <ImageCard title={pcFullName} description={pcDescription} imagePath={pcImagePath} data={listCardObject}/>
            <Footer/>
        </>
    )
}

export default Home;
