import { Link } from "react-router-dom";
import "../styles/admin/AdminNavbar.css";

function AdminNavbar() {
  return (
    <nav className="admin-navbar">
      <div className="admin-navbar-container">
        <div className="admin-logo">
          <Link to="/admin/dashboard">CourtVision Admin</Link>
        </div>
        <div className="admin-nav-links">
          <Link to="/admin/users" className="admin-nav-item">Users</Link>
          <Link to="/admin/teams" className="admin-nav-item">Teams</Link>
          <Link to="/admin/matches" className="admin-nav-item">Matches</Link>
          <Link to="/admin/requests" className="admin-nav-item">Player Requests</Link>
        </div>
      </div>
    </nav>
  );
}

export default AdminNavbar;
