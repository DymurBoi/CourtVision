import { Link, useNavigate } from "react-router-dom";
import "../styles/admin/AdminNavbar.css";
import { useAuth } from "./AuthContext";
import { useState } from "react";

function AdminNavbar() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    logout();
    navigate("/admin/login", { replace: true });
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };

  return (
    <nav className="admin-navbar">
      <div className="admin-navbar-container">
        <div className="admin-logo">
          <Link to="/admin/dashboard" onClick={closeMenu}>
            CourtVision Admin
          </Link>
        </div>

        {/* Mobile menu button */}
        <div className="admin-mobile-menu-btn" onClick={toggleMenu}>
          <div className={`menu-icon ${menuOpen ? "open" : ""}`}>
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>

        {/* Navigation links */}
        <div className={`admin-nav-links ${menuOpen ? "active" : ""}`}>
          <Link to="/admin/users" className="admin-nav-item" onClick={closeMenu}>
            Players
          </Link>
          <Link to="/admin/coaches" className="admin-nav-item" onClick={closeMenu}>
            Coach
          </Link>
          <Link to="/admin/teams" className="admin-nav-item" onClick={closeMenu}>
            Teams
          </Link>
          <div className="admin-user-actions">
            <button onClick={handleLogout} className="admin-logout-btn">
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default AdminNavbar;
