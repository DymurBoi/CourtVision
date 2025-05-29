import { Link, useNavigate } from "react-router-dom"
import "../styles/navbar.css"
import { useAuth } from "./AuthContext"
import PersonIcon from '@mui/icons-material/Person';

function CoachNavbar() {
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
          <Link to="/coach/home">CourtVision</Link>
        </div>
        <div className="nav-links">
          <Link to="/coach/matches" className="nav-item">
            Matches
          </Link>
          <Link to="/coach/requests" className="nav-item">
            Requests
          </Link>
        </div>
        <div className="user-profile">
          <Link to="/coach/profile" className="profile-icon">
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

export default CoachNavbar
