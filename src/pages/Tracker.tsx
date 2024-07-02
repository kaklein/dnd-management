/**
 * Will contain:
 * - All dynamic fields that may change during a session.
 * - E.g. HP, spells slots, features used per long/short rest, etc.
 */

import Navbar from "../components/Navbar";

function Tracker() {
    return (
        <>
            <Navbar/>
            <h1>Tracker.</h1>
        </>
    )
}

export default Tracker;
