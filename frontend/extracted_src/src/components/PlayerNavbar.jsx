import { Link } from "react-router-dom"
import "../styles/navbar.css"

function PlayerNavbar() {
  console.log("Rendering PlayerNavbar")
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="logo">
          <Link to="/player/home">CourtVision</Link>
        </div>
        <div className="nav-links">
          <Link to="/player/stats" className="nav-item">
            My Stats
          </Link>
          <Link to="/player/matches" className="nav-item">
            Matches
          </Link>
        </div>
        <div className="user-profile">
          <Link to="/player/profile" className="profile-icon">
            Profile
          </Link>
        </div>
      </div>
    </nav>
  )
}

export default PlayerNavbar
