import './App.css'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Stats from "./pages/Stats";
import Tracker from "./pages/Tracker";
import Details from "./pages/Details";
import { doc, getDoc } from "firebase/firestore";
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from './firebase';


// Hardcoding specific PC id for now since it will mainly be used for a single character.
// TODO - implement a search function before loading data so that different PCs can be displayed
const PC_ID="kvneaiw2pulEBICGf6Dm";

function App() {
    const getPCData = async (pcId: string) => {
        // Get base character details
        const docRef = doc(db, "pcBaseDetails", pcId);
        const docSnap = await getDoc(docRef);
    
        if (docSnap.exists()) {
            console.log("Document data:", docSnap.data());
        } else {
            console.log("No such document!");
            return;
        }
    
        // Get ability scores
        const asQuery = query(collection(db, "abilityScores"), where("pcId", "==", pcId));
        const asQuerySnapshot = await getDocs(asQuery);
        asQuerySnapshot.forEach((doc) => {
            console.log(doc.id, " => ", doc.data());
        });
    }
    // Load data
    getPCData(PC_ID);

    // Load pages
    return (
        <>
            <BrowserRouter>
                <Routes>
                    <Route index element={<Home/>}/>
                    <Route path="/home" element={<Home/>}/>
                    <Route path="/stats" element={<Stats/>}/>
                    <Route path="/tracker" element={<Tracker/>}/>
                    <Route path="/details" element={<Details/>}/>
                </Routes>
            </BrowserRouter>
        </>
    )
}

export default App
