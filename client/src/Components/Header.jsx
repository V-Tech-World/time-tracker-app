import { Link } from 'react-router-dom';

function Header() {
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">Task Tracker</Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav">
            <li className="nav-item">
              <Link className="nav-link" to="/">Tasks</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/activity-summary">Activity Summary</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/task-chart">Task Chart</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/settings">Settings</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/info">Info</Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Header;
