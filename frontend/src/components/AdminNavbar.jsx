import { Link, useNavigate } from "react-router-dom";
import "../styles/admin/AdminNavbar.css";
import { useAuth } from "./AuthContext";

function AdminNavbar() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/admin/login", { replace: true });
  };

  return (
    <nav className="admin-navbar">
      <div className="admin-navbar-container">
        <div className="admin-logo">
          <Link to="/admin/dashboard">CourtVision Admin</Link>
        </div>
        <div className="admin-nav-links">
          <Link to="/admin/users" className="admin-nav-item">Users</Link>
          <Link to="/admin/coaches" className="admin-nav-item">Coach</Link>
          <Link to="/admin/teams" className="admin-nav-item">Teams</Link>
           <div className="admin-user-actions">
          <button onClick={handleLogout} className="admin-logout-btn">Logout</button>
        </div>
        </div>
       
      </div>
    </nav>
  );
}

export default AdminNavbar;
