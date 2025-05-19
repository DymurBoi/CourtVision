"use client"

import { useState, useEffect } from "react"
import { useParams, Link, useNavigate } from "react-router-dom"
import AdminNavbar from "../../components/AdminNavbar"
import "../../styles/admin/UserDetails.css"

// Sample user data
const usersData = [
  {
    id: 1,
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@example.com",
    type: "player",
    team: "CIT-U College Team",
    status: "active",
    createdAt: "2023-01-15",
    birthDate: "1998-05-20",
    jerseyNumber: 23,
    position: "Point Guard",
    height: 185,
    weight: 78,
    stats: {
      gamesPlayed: 15,
      pointsPerGame: 18.5,
      assistsPerGame: 5.2,
      reboundsPerGame: 3.8,
    },
  },
  {
    id: 3,
    firstName: "Michael",
    lastName: "Thompson",
    email: "michael.thompson@example.com",
    type: "coach",
    team: "CIT-U College Team",
    status: "active",
    createdAt: "2022-11-05",
    experience: "12 years",
    specialization: "Offensive strategies",
    achievements: ["Regional Championship 2021", "City League Champions 2022"],
  },
]

function UserDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate API call to fetch user details
    const fetchUser = () => {
      setLoading(true)
      // Find user by ID
      const foundUser = usersData.find((u) => u.id === Number(id))

      if (foundUser) {
        setUser(foundUser)
      }
      setLoading(false)
    }

    fetchUser()
  }, [id])

  const handleDeleteUser = () => {
    if (window.confirm("Are you sure you want to delete this user? This action cannot be undone.")) {
      // In a real app, this would make an API call to delete the user
      console.log("Deleting user:", user.id)
      navigate("/admin/users")
    }
  }

  if (loading) {
    return (
      <div className="admin-layout">
        <AdminNavbar />
        <main className="admin-content">
          <div className="loading">Loading user details...</div>
        </main>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="admin-layout">
        <AdminNavbar />
        <main className="admin-content">
          <div className="not-found">
            User not found. The user may have been deleted or you don't have permission to view it.
          </div>
          <Link to="/admin/users" className="back-link">
            Back to User Management
          </Link>
        </main>
      </div>
    )
  }

  return (
    <div className="admin-layout">
      <AdminNavbar />
      <main className="admin-content">
        <div className="user-details-header">
          <div>
            <h1>
              {user.firstName} {user.lastName}
            </h1>
            <span className={`user-type ${user.type}`}>{user.type}</span>
            <span className={`user-status ${user.status}`}>{user.status}</span>
          </div>
          <div className="user-actions">
            <Link to={`/admin/users/${user.id}/edit`} className="edit-user-button">
              Edit User
            </Link>
            <button className="delete-user-button" onClick={handleDeleteUser}>
              Delete User
            </button>
          </div>
        </div>

        <div className="user-details-content">
          <div className="user-details-card">
            <h2>Basic Information</h2>
            <div className="details-grid">
              <div className="detail-item">
                <span className="detail-label">Full Name</span>
                <span className="detail-value">
                  {user.firstName} {user.lastName}
                </span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Email</span>
                <span className="detail-value">{user.email}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">User Type</span>
                <span className="detail-value capitalize">{user.type}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Team</span>
                <span className="detail-value">{user.team}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Status</span>
                <span className="detail-value capitalize">{user.status}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Created On</span>
                <span className="detail-value">{user.createdAt}</span>
              </div>
              {user.type === "player" && (
                <>
                  <div className="detail-item">
                    <span className="detail-label">Birth Date</span>
                    <span className="detail-value">{user.birthDate}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Jersey Number</span>
                    <span className="detail-value">#{user.jerseyNumber}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Position</span>
                    <span className="detail-value">{user.position}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Height</span>
                    <span className="detail-value">{user.height} cm</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Weight</span>
                    <span className="detail-value">{user.weight} kg</span>
                  </div>
                </>
              )}
              {user.type === "coach" && (
                <>
                  <div className="detail-item">
                    <span className="detail-label">Experience</span>
                    <span className="detail-value">{user.experience}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Specialization</span>
                    <span className="detail-value">{user.specialization}</span>
                  </div>
                </>
              )}
            </div>
          </div>

          {user.type === "player" && (
            <div className="user-details-card">
              <h2>Player Statistics</h2>
              <div className="stats-grid">
                <div className="stat-item">
                  <span className="stat-value">{user.stats.gamesPlayed}</span>
                  <span className="stat-label">Games Played</span>
                </div>
                <div className="stat-item">
                  <span className="stat-value">{user.stats.pointsPerGame}</span>
                  <span className="stat-label">Points Per Game</span>
                </div>
                <div className="stat-item">
                  <span className="stat-value">{user.stats.assistsPerGame}</span>
                  <span className="stat-label">Assists Per Game</span>
                </div>
                <div className="stat-item">
                  <span className="stat-value">{user.stats.reboundsPerGame}</span>
                  <span className="stat-label">Rebounds Per Game</span>
                </div>
              </div>
            </div>
          )}

          {user.type === "coach" && (
            <div className="user-details-card">
              <h2>Coach Achievements</h2>
              <ul className="achievements-list">
                {user.achievements.map((achievement, index) => (
                  <li key={index}>{achievement}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="back-navigation">
          <Link to="/admin/users" className="back-link">
            Back to User Management
          </Link>
        </div>
      </main>
    </div>
  )
}

export default UserDetails
