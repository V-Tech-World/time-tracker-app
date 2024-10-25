import { Link } from 'react-router-dom';
import '../css/header.css'; // Import custom CSS for additional styling

function Header() {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary shadow-sm">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">Task Tracker</Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link className="nav-link active" aria-current="page" to="/">Tasks</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/activity-summary">Activity Summary</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/task-chart">Task Chart</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/info">Info</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/settings">Settings</Link>
            </li>
          </ul>
          <form className="d-flex">
            <input
              className="form-control me-2"
              type="search"
              placeholder="Search tasks"
              aria-label="Search"
            />
            <button className="btn btn-outline-light" type="submit">Search</button>
          </form>
        </div>
      </div>
    </nav>
  );
}

export default Header;
