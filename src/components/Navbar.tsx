import { auth } from "../firebase";
import { NavLink } from "react-router-dom";
import { logoutUser } from "@services/firebaseAuth/logoutUser";

function Navbar () {
    return (
        <>
            <a id="top"></a>
            <nav className="navbar navbar-expand-sm bg-dark border-bottom border-body" data-bs-theme="dark">
                <div className="container-fluid">
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarNav">
                        <ul className="navbar-nav">
                            <li className="nav-item">
                                <h3><NavLink className="nav-link" to="/home">Home</NavLink></h3>
                            </li>
                            <li className="nav-item">
                                <h3><NavLink className="nav-link" to="/stats">Stats</NavLink></h3>
                            </li>
                            <li className="nav-item">
                                <h3><NavLink className="nav-link" to="/tracker">Tracker</NavLink></h3>
                            </li>
                            <li className="nav-item">
                                <h3><NavLink className="nav-link" to="/details">Details</NavLink></h3>
                            </li>
                        </ul>
                    </div>
                    <span className="navbar-text">
                        Logged in{auth.currentUser?.displayName && ` as ${auth.currentUser?.displayName}` }
                    </span>
                    <span className="navbar-text">
                        {auth.currentUser &&
                            <a className="btn btn-secondary" href="/" onClick={() => logoutUser()}>Log Out</a>
                        }
                    </span>
                </div>
            </nav>
        </>
    )
}

export default Navbar;
