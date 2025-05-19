import { Link, useNavigate } from "react-router-dom"
import "../styles/navbar.css"
import { useAuth } from "./AuthContext"
import PersonIcon from '@mui/icons-material/Person';
function PlayerNavbar() {
  const { logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate("/login", { replace: true })
  }

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
            <PersonIcon/>
          </Link>
          <button onClick={handleLogout} className="logout-btn">
            Logout
          </button>
        </div>
      </div>
    </nav>
  )
}

export default PlayerNavbar
