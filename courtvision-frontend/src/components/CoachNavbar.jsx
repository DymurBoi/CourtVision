import { Link } from "react-router-dom";
import "../styles/navbar.css";

function CoachNavbar() {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="logo">
          <Link to="/coach/home">CourtVision</Link>
        </div>
        <div className="nav-links">
          <Link to="/coach/team" className="nav-item">Teams</Link>
          <Link to="/coach/matches" className="nav-item">Matches</Link>
          <Link to="/coach/requests" className="nav-item">Requests</Link>
        </div>
        <div className="user-profile">
          <Link to="/coach/profile" className="profile-icon">
            Profile
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default CoachNavbar;

