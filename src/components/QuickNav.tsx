import { Link } from "react-router-dom";

function QuickNav () {
  return (
    <div className="container-fluid quick-nav-bar">
      <div className="row">
        <div className="col-auto quick-nav-item">
          <Link to="/stats" onClick={() => window.scrollTo(0,0)}>
            <div className="quick-nav-item-button">
              <p>Ability Scores</p>
            </div>
          </Link>
        </div>
        <div className="col-auto quick-nav-item">
          <Link to="/tracker" onClick={() => window.scrollTo(0,0)}>
            <div className="quick-nav-item-button">
              <p>Tracker</p>
            </div>
          </Link>
        </div>
        <div className="col-auto quick-nav-item">
          <Link to="/details" onClick={() => window.scrollTo(0,0)}>
            <div className="quick-nav-item-button">
              <p>Details</p>
            </div>
          </Link>
        </div>        
      </div>
    </div>
  )
}

export default QuickNav;