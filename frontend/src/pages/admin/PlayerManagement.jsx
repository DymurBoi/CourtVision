"use client";

import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Snackbar, Alert } from "@mui/material";
import "../../styles/admin/UserManagement.css";
import axios from "axios";
import { API_BASE_URL } from "../../utils/axiosConfig";

function PlayerManagement() {
  const location = useLocation();
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [loading, setLoading] = useState(true);

  // Snackbar state
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const showSnackbar = (message, severity = "success") => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  //Fetch players on mount
  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const [playersRes] = await Promise.all([
          axios.get(`${API_BASE_URL}/players/get/all`),
        ]);

        const players = playersRes.data.map((player) => ({
          id: player.playerId,
          firstName: player.fname,
          lastName: player.lname,
          email: player.email,
          status: "active",
          createdAt: player.birthDate,
          type: "player",
        }));

        setUsers([...players]);

        // Apply filter from URL params
        const params = new URLSearchParams(location.search);
        const typeParam = params.get("type");
        if (typeParam) {
          setFilterType(typeParam);
        }
      } catch (error) {
        console.error("❌ Failed to load users:", error);
        showSnackbar("Unable to fetch players. Check backend connection.", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [location]);

  // Apply filters when data changes
  useEffect(() => {
    let result = [...users];

    if (filterType !== "all") {
      result = result.filter((user) => user.type === filterType);
    }

    if (filterStatus !== "all") {
      result = result.filter((user) => user.status === filterStatus);
    }

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (user) =>
          user.firstName.toLowerCase().includes(term) ||
          user.lastName.toLowerCase().includes(term) ||
          user.email.toLowerCase().includes(term)
      );
    }

    setFilteredUsers(result);
  }, [users, searchTerm, filterType, filterStatus]);

  //Delete player (local state only)
  const handleDeleteUser = (userId) => {
    if (window.confirm("Are you sure you want to delete this player?")) {
      setUsers(users.filter((user) => user.id !== userId));
      showSnackbar("Player deleted successfully!", "success");
    }
  };

  return (
    <main className="admin-content">
      <div className="admin-header">
        <h1>Player Management</h1>
      </div>

      <div className="user-management-controls">
        <div className="search-filter-container">
          <div className="search-container">
            <input
              type="text"
              placeholder="Search players..."
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
      </div>

      <div className="users-table-container">
        {loading ? (
          <p className="loading">Loading players...</p>
        ) : (
          <table className="users-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Type</th>
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
                      <button
                        className="delete-button"
                        onClick={() => handleDeleteUser(user.id)}
                      >
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
        )}
      </div>

      {/*Snackbar for alerts */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </main>
  );
}

export default PlayerManagement;
