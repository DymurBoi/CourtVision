"use client"

import { useState, useEffect } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import "../../styles/admin/UserManagement.css"
import axios from "axios"

function CoachManagement() {
  const location = useLocation()
  const navigate = useNavigate()

  const [users, setUsers] = useState([])
  const [filteredUsers, setFilteredUsers] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState("all")
  const [filterStatus, setFilterStatus] = useState("all")

  // 🟢 Fetch coaches on mount
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const [coachesRes] = await Promise.all([
        
          axios.get("http://localhost:8080/api/coaches/get/all")
        ])

        const coaches = coachesRes.data
          .filter(coach => !coach.isAdmin) // skip admins
          .map((coach) => ({
            id: coach.coachId,
            firstName: coach.fname,
            lastName: coach.lname,
            email: coach.email,
            team: coach.teams?.[0]?.teamName || "Unassigned",
            status: "active",
            createdAt: coach.birthDate,
            type: "coach"
          }))

        setUsers([...coaches])

        // Filter from URL params
        const params = new URLSearchParams(location.search)
        const typeParam = params.get("type")
        if (typeParam) {
          setFilterType(typeParam)
        }

      } catch (error) {
        console.error("Failed to load users:", error)
        alert("Unable to fetch users. Check backend.")
      }
    }

    fetchUsers()
  }, [location])

  // 🔁 Apply filters when data changes
  useEffect(() => {
    let result = [...users]

    if (filterType !== "all") {
      result = result.filter(user => user.type === filterType)
    }

    if (filterStatus !== "all") {
      result = result.filter(user => user.status === filterStatus)
    }

    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      result = result.filter(
        user =>
          user.firstName.toLowerCase().includes(term) ||
          user.lastName.toLowerCase().includes(term) ||
          user.email.toLowerCase().includes(term) ||
          user.team.toLowerCase().includes(term)
      )
    }

    setFilteredUsers(result)
  }, [users, searchTerm, filterType, filterStatus])

  // 🧹 Delete user (local state only for now)
  const handleDeleteUser = (userId) => {
    if (window.confirm("Are you sure you want to delete this coach?")) {
      setUsers(users.filter(user => user.id !== userId))
    }
  }

  return (
    <main className="admin-content">
      <div className="admin-header">
        <h1>Coach Management</h1>
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
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </div>
        </div>

        <button className="create-coach-button" onClick={() => navigate("/admin/users/new-coach")}>
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
                  <td>{user.firstName} {user.lastName}</td>
                  <td>{user.email}</td>
                  <td><span className={`user-type ${user.type}`}>{user.type}</span></td>
                  <td>{user.team}</td>
                  <td><span className={`user-status ${user.status}`}>{user.status}</span></td>
                  <td>{user.createdAt}</td>
                  <td className="action-buttons">
                    <Link to={`/admin/coach/${user.id}/edit`} className="view-button">Edit</Link>
                    <Link to={`/admin/coach/${user.id}`} className="edit-button">View</Link>
                    <button className="delete-button" onClick={() => handleDeleteUser(user.id)}>Delete</button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="no-results">No users found matching your criteria.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </main>
  )
}

export default CoachManagement;