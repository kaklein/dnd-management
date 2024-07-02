import {Link} from "react-router-dom";

function Navbar () {
    return (
        <nav className="navbar bg-dark border-bottom border-body" data-bs-theme="dark">
            <div className="container-fluid">
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav">
                        <li className="nav-item">
                            <h3><Link className="nav-link" to="/home">Home</Link></h3>
                        </li>
                        <li className="nav-item">
                            <h3><Link className="nav-link" to="/stats">Stats</Link></h3>
                        </li>
                        <li className="nav-item">
                            <h3><Link className="nav-link" to="/tracker">Tracker</Link></h3>
                        </li>
                        <li className="nav-item">
                            <h3><Link className="nav-link" to="/details">Details</Link></h3>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    )
}

export default Navbar;
