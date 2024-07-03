import {NavLink} from "react-router-dom";

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
                </div>
            </nav>
        </>
    )
}

export default Navbar;
