import { auth } from "../firebase";
import { NavLink } from "react-router-dom";
import { logoutUser } from "@services/firebaseAuth/logoutUser";
import { useState } from "react";

interface Props {
    isSelectedPc: boolean;
}

function Navbar ({isSelectedPc}: Props) {
    const [isNavCollapsed, setIsNavCollapsed] = useState(true);
    const handleNavbarCollapse = () => {
        setIsNavCollapsed(!isNavCollapsed);
    }
    return (
        <>
        <a id="top"></a>
        <nav className="navbar navbar-expand-sm bg-dark border-bottom border-body" data-bs-theme="dark">
            <div className="container-fluid">
                <button className="navbar-toggler" type="button" onClick={handleNavbarCollapse}>
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className={`${isNavCollapsed ? "collapse": ""} navbar-collapse`}>
                    <img src="/public/images/logo-1.png" width="100px"/>
                    <ul className="navbar-nav mr-auto">
                        {
                            isSelectedPc &&
                            <>
                            <li className="nav-item">
                            <h3><NavLink className="nav-link" to="/overview">Overview</NavLink></h3>
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
                            <li className="nav-item">
                                <h3><NavLink className="nav-link" to="/update">Update</NavLink></h3>
                            </li>
                            </>
                        }  
                    </ul>
                 </div>
                 <div className={`${isNavCollapsed ? "collapse": ""} navbar-collapse ml-auto w-100 justify-content-end`}>   
                    <ul className="navbar-nav mr-auto">
                        <li className="nav-item navbar-text">
                            <p>
                                Logged in
                                {auth.currentUser?.displayName && ` as ${auth.currentUser?.displayName}` }
                                {localStorage.getItem('userRole') === 'ADMIN' && " | ADMIN ROLE"}
                                {localStorage.getItem('userRole') === 'READ_ALL' && " | READ_ALL ROLE"}
                            </p>
                            {auth.currentUser &&
                                <a className="btn btn-secondary" href="/" onClick={() => logoutUser()}>Log Out</a>
                            }
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
        </>
    )
}

export default Navbar;
