import './App.css'
import * as React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Stats from "./pages/Stats";
import Tracker from "./pages/Tracker";
import Details from "./pages/Details";

function App() {
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
