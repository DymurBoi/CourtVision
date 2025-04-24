"use client"

import { useState, useEffect } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import AdminNavbar from "../../components/AdminNavbar"
import "../../styles/admin/UserManagement.css"

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
  },
  {
    id: 2,
    firstName: "Jane",
    lastName: "Smith",
    email: "jane.smith@example.com",
    type: "player",
    team: "CIT-U High School Team",
    status: "active",
    createdAt: "2023-02-10",
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
  },
  {
    id: 4,
    firstName: "Sarah",
    lastName: "Johnson",
    email: "sarah.johnson@example.com",
    type: "coach",
    team: "CIT-U High School Team",
    status: "active",
    createdAt: "2022-12-18",
  },
  {
    id: 5,
    firstName: "Robert",
    lastName: "Davis",
    email: "robert.davis@example.com",
    type: "coach",
    team: "CIT-U Elementary Team",
    status: "active",
    createdAt: "2023-01-22",
  },
  {
    id: 6,
    firstName: "Emily",
    lastName: "Wilson",
    email: "emily.wilson@example.com",
    type: "player",
    team: "CIT-U College Team",
    status: "inactive",
    createdAt: "2023-03-05",
  },
  {
    id: 7,
    firstName: "David",
    lastName: "Brown",
    email: "david.brown@example.com",
    type: "player",
    team: "CIT-U High School Team",
    status: "active",
    createdAt: "2023-02-28",
  },
  {
    id: 8,
    firstName: "Jessica",
    lastName: "Miller",
    email: "jessica.miller@example.com",
    type: "player",
    team: "CIT-U College Team",
    status: "active",
    createdAt: "2023-03-12",
  },
  {
    id: 9,
    firstName: "Daniel",
    lastName: "Garcia",
    email: "daniel.garcia@example.com",
    type: "player",
    team: "CIT-U Elementary Team",
    status: "active",
    createdAt: "2023-03-18",
  },
  {
    id: 10,
    firstName: "Sophia",
    lastName: "Martinez",
    email: "sophia.martinez@example.com",
    type: "player",
    team: "CIT-U High School Team",
    status: "pending",
    createdAt: "2023-04-02",
  },
]

function UserManagement() {
  const location = useLocation()
  const navigate = useNavigate()
  const [users, setUsers] = useState([])
  const [filteredUsers, setFilteredUsers] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState("all")
  const [filterStatus, setFilterStatus] = useState("all")

  useEffect(() => {
    // Initialize users data
    setUsers(usersData)

    // Check if there's a type filter in the URL
    const params = new URLSearchParams(location.search)
    const typeParam = params.get("type")
    if (typeParam) {
      setFilterType(typeParam)
    }
  }, [location])

  useEffect(() => {
    // Apply filters
    let result = users

    // Filter by type
    if (filterType !== "all") {
      result = result.filter((user) => user.type === filterType)
    }

    // Filter by status
    if (filterStatus !== "all") {
      result = result.filter((user) => user.status === filterStatus)
    }

    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      result = result.filter(
        (user) =>
          user.firstName.toLowerCase().includes(term) ||
          user.lastName.toLowerCase().includes(term) ||
          user.email.toLowerCase().includes(term) ||
          user.team.toLowerCase().includes(term),
      )
    }

    setFilteredUsers(result)
  }, [users, filterType, filterStatus, searchTerm])

  const handleDeleteUser = (userId) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      setUsers(users.filter((user) => user.id !== userId))
    }
  }

  const handleCreateCoach = () => {
    navigate("/admin/users/new-coach")
  }

  return (
    <div className="admin-layout">
      <AdminNavbar />
      <main className="admin-content">
        <div className="admin-header">
          <h1>User Management</h1>
        </div>

        <div className="user-management-controls">
          <div className="search-filter-container">
            <div className="search-container">
              <input
                type="text"
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="search-icon"
              >
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            </div>

            <div className="filter-container">
              <div className="filter-group">
                <label htmlFor="type-filter">Type:</label>
                <select
                  id="type-filter"
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="filter-select"
                >
                  <option value="all">All Users</option>
                  <option value="player">Players</option>
                  <option value="coach">Coaches</option>
                </select>
              </div>

              <div className="filter-group">
                <label htmlFor="status-filter">Status:</label>
                <select
                  id="status-filter"
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="filter-select"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="pending">Pending</option>
                </select>
              </div>
            </div>
          </div>

          <button className="create-coach-button" onClick={handleCreateCoach}>
            Create Coach Account
          </button>
        </div>

        <div className="users-table-container">
          <table className="users-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Type</th>
                <th>Team</th>
                <th>Status</th>
                <th>Created</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <tr key={user.id}>
                    <td>
                      {user.firstName} {user.lastName}
                    </td>
                    <td>{user.email}</td>
                    <td>
                      <span className={`user-type ${user.type}`}>{user.type}</span>
                    </td>
                    <td>{user.team}</td>
                    <td>
                      <span className={`user-status ${user.status}`}>{user.status}</span>
                    </td>
                    <td>{user.createdAt}</td>
                    <td className="action-buttons">
                      <Link to={`/admin/users/${user.id}`} className="view-button">
                        View
                      </Link>
                      <Link to={`/admin/users/${user.id}/edit`} className="edit-button">
                        Edit
                      </Link>
                      <button className="delete-button" onClick={() => handleDeleteUser(user.id)}>
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="no-results">
                    No users found matching your criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  )
}

export default UserManagement
