import { NavLink } from "react-router-dom";
import { logoutUser } from "@services/firebaseAuth/logoutUser";
import { useState } from "react";
import { getUserRole } from "@services/firestore/getUserRole";
import { UserRole } from "@services/firestore/enum/UserRole";
import { getAuth } from "@firebase/auth";

interface Props {
    isSelectedPc: boolean;
    userRole?: UserRole;
}

function Navbar ({isSelectedPc, userRole=undefined}: Props) {
    const [isNavCollapsed, setIsNavCollapsed] = useState(true);
    const handleNavbarCollapse = () => {
        setIsNavCollapsed(!isNavCollapsed);
    }
    const [knownUserRole, setKnownUserRole] = useState(userRole);
    const currentUser = getAuth().currentUser;
    const checkUserRole = async () => {
        if (knownUserRole == undefined) {
            if (currentUser) {
                const retrievedRole = await getUserRole(currentUser.uid);
                setKnownUserRole(retrievedRole);
                return retrievedRole;
            } else {
                throw Error('No current user found');
            }
        } else {
            return userRole;
        }
    }
    checkUserRole();

    return (
        <>
        <a id="top"></a>
        <nav className="navbar navbar-expand-sm bg-dark border-bottom border-body" data-bs-theme="dark">
            <div className="container-fluid">
                <button className="navbar-toggler" type="button" onClick={handleNavbarCollapse}>
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className={`${isNavCollapsed ? "collapse": ""} navbar-collapse`}>
                    <img src="/images/logo-1.png" width="100px"/>
                    <ul className="navbar-nav mr-auto">
                        {
                            isSelectedPc &&
                            <>
                            <li className="nav-item">
                                <h3><NavLink className="nav-link" to="/overview">Overview</NavLink></h3>
                            </li>
                            <li className="nav-item">
                                <h3><NavLink className="nav-link" to="/add">Add Items</NavLink></h3>
                            </li>
                            <li className="nav-item">
                                <h3><NavLink className="nav-link" to="/stats">Ability Scores</NavLink></h3>
                            </li>
                            <li className="nav-item">
                                <h3><NavLink className="nav-link" to="/tracker">Tracker</NavLink></h3>
                            </li>
                            <li className="nav-item">
                                <h3><NavLink className="nav-link" to="/details">Details</NavLink></h3>
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
                                {currentUser?.displayName && ` as ${currentUser?.displayName}` }
                                {(currentUser && userRole === 'ADMIN') && " | ADMIN ROLE"}
                                {(currentUser && userRole === 'READ_ALL') && " | READ_ALL ROLE"}
                            </p>
                            {currentUser &&
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
