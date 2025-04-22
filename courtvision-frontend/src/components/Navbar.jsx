import { useState } from "react"
import { Link } from "react-router-dom"
import "../styles/navbar.css"

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)

  const toggleMenu = () => {
    setMenuOpen(!menuOpen)
  }

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="logo">
          <Link to="/">CourtVision</Link>
        </div>

        <div className={`nav-links ${menuOpen ? "active" : ""}`}>
          <Link to="/teams" className="nav-item" onClick={() => setMenuOpen(false)}>
            Teams
          </Link>
          <Link to="/matches" className="nav-item" onClick={() => setMenuOpen(false)}>
            Matches
          </Link>
          <Link to="/requests" className="nav-item" onClick={() => setMenuOpen(false)}>
            Requests
          </Link>
        </div>

        <div className="user-profile">
          <Link to="/profile" className="profile-icon">
            <span>JD</span>
          </Link>
        </div>

        <div className="mobile-menu-btn" onClick={toggleMenu}>
          <div className={`menu-icon ${menuOpen ? "open" : ""}`}>
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar

