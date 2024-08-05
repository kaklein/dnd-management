import { Link } from "react-router-dom";

function QuickNav () {
  return (
    <div className="container-fluid quick-nav-bar">
      <div className="row">
        <div className="col-auto quick-nav-item">
          <Link to="/stats" onClick={() => window.scrollTo(0,0)}>
            <img src="/images/icons/quickNav/stats.png" alt="stats link"/>
          </Link>
        </div>
        <div className="col-auto quick-nav-item">
          <Link to="/tracker" onClick={() => window.scrollTo(0,0)}>
            <img src="/images/icons/quickNav/tracker.png" alt="tracker link"/>
          </Link>
        </div>
        <div className="col-auto quick-nav-item">
          <Link to="/details" onClick={() => window.scrollTo(0,0)}>
            <img src="/images/icons/quickNav/details.png" alt="details link"/>
          </Link>
        </div>
        <div className="col-auto quick-nav-item">
          <a className="btn-text" href="#top">
            <img src="/images/icons/back-to-top.png" alt="back to top link"/>
          </a>
        </div>
      </div>
    </div>
  )
}

export default QuickNav;