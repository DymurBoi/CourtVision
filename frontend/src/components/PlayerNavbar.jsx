import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/navbar.css";
import { useAuth } from "./AuthContext";
import PersonIcon from "@mui/icons-material/Person";

function PlayerNavbar() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
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
    <nav className="navbar player-navbar">
      <div className="navbar-container">
        {/* Logo */}
        <div className="logo">
          <Link to="/player/home" onClick={closeMenu}>
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
          <Link to="/player/stats" className="nav-item" onClick={closeMenu}>
            My Stats
          </Link>
          <Link to="/player/matches" className="nav-item" onClick={closeMenu}>
            Matches
          </Link>
           <Link to="/player/player-ranking" className="nav-item" onClick={closeMenu}>
            Player Rankings
          </Link>

          {/* On mobile, show profile and logout in dropdown too */}
          <div className="mobile-user-actions">
            <Link
              to="/player/profile"
              className="nav-item"
              onClick={closeMenu}
            >
              Profile
            </Link>
            <button onClick={handleLogout} className="logout-btn">
              Logout
            </button>
          </div>
        </div>

        {/* Desktop User Profile */}
        <div className="user-profile">
          <Link to="/player/profile" className="profile-icon">
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

export default PlayerNavbar;
