import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/navbar.css";
import { useAuth } from "./AuthContext";
import PersonIcon from "@mui/icons-material/Person";

function CoachNavbar() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    logout();
    navigate("/login", { replace: true });
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };

  return (
    <nav className="navbar coach-navbar">
      <div className="navbar-container">
        {/* Logo */}
        <div className="logo">
          <Link to="/coach/home" onClick={closeMenu}>
            CourtVision
          </Link>
        </div>

        {/* Mobile Menu Icon */}
        <div className="mobile-menu-btn" onClick={toggleMenu}>
          <div className={`menu-icon ${menuOpen ? "open" : ""}`}>
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>

        {/* Nav Links */}
        <div className={`nav-links ${menuOpen ? "active" : ""}`}>
          <Link to="/coach/home" className="nav-item" onClick={closeMenu}>
            Home
          </Link>
          <Link to="/coach/ranking" className="nav-item" onClick={closeMenu}>
            Player Ranking
          </Link>
          <Link to="/coach/requests" className="nav-item" onClick={closeMenu}>
            Requests
          </Link>

          {/* Mobile user actions */}
          <div className="mobile-user-actions">
            <Link to="/coach/profile" className="nav-item" onClick={closeMenu}>
              Profile
            </Link>
            <button onClick={handleLogout} className="logout-btn">
              Logout
            </button>
          </div>
        </div>

        {/* Desktop user profile */}
        <div className="user-profile">
          <Link to="/coach/profile" className="profile-icon">
            <PersonIcon />
          </Link>
          <button onClick={handleLogout} className="logout-btn">
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}

export default CoachNavbar;
