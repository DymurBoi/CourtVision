"use client";

import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "../../styles/admin/UserManagement.css";
import axios from "axios";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

const Alert = (props) => <MuiAlert elevation={6} variant="filled" {...props} />;

function CoachManagement() {
  const location = useLocation();
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");

  // Snackbar State
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  // Dialog (Confirm Delete)
  const [openDialog, setOpenDialog] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  // Fetch coaches on mount
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const [coachesRes] = await Promise.all([
<<<<<<< Updated upstream
          axios.get("http://localhost:8080/api/coaches/get/all"),
        ]);
=======
        
          axios.get("http://13.239.65.62:8080/api/coaches/get/all")
        ])
>>>>>>> Stashed changes

        const coaches = coachesRes.data
          .filter((coach) => !coach.isAdmin) // skip admins
          .map((coach) => ({
            id: coach.coachId,
            firstName: coach.fname,
            lastName: coach.lname,
            email: coach.email,
            status: "active",
            createdAt: coach.birthDate,
            type: "coach",
          }));

        setUsers([...coaches]);

        // Filter from URL params
        const params = new URLSearchParams(location.search);
        const typeParam = params.get("type");
        if (typeParam) {
          setFilterType(typeParam);
        }
      } catch (error) {
        console.error("Failed to load users:", error);
        setSnackbar({
          open: true,
          message: "Unable to fetch users. Please check the backend connection.",
          severity: "error",
        });
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

  // Open confirm dialog
  const confirmDelete = (userId) => {
    setUserToDelete(userId);
    setOpenDialog(true);
  };

  // Cancel delete
  const handleDialogClose = () => {
    setOpenDialog(false);
    setUserToDelete(null);
  };

  // Confirm delete
  const handleDeleteConfirm = async () => {
    if (!userToDelete) return;

    try {
      // Example delete endpoint
      await axios.delete(`http://localhost:8080/api/coaches/delete/${userToDelete}`);

      setUsers((prev) => prev.filter((user) => user.id !== userToDelete));

      setSnackbar({
        open: true,
        message: "Coach deleted successfully.",
        severity: "success",
      });
    } catch (error) {
      console.error("Delete failed:", error);
      setSnackbar({
        open: true,
        message: "Failed to delete coach. Please try again.",
        severity: "error",
      });
    } finally {
      setOpenDialog(false);
      setUserToDelete(null);
    }
  };

  const handleSnackbarClose = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

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
              placeholder="Search coaches..."
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

        <button
          className="create-coach-button"
          onClick={() => navigate("/admin/users/new-coach")}
        >
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
                    <span className={`user-status ${user.status}`}>
                      {user.status}
                    </span>
                  </td>
                  <td>{user.createdAt}</td>
                  <td className="action-buttons">
                    <Link
                      to={`/admin/coach/${user.id}/edit`}
                      className="view-button"
                    >
                      Edit
                    </Link>
                    <Link
                      to={`/admin/coach/${user.id}`}
                      className="edit-button"
                    >
                      View
                    </Link>
                    <button
                      className="delete-button"
                      onClick={() => confirmDelete(user.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="no-results">
                  No coaches found matching your criteria.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Snackbar Alert */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>

      {/* Confirm Delete Dialog */}
      <Dialog open={openDialog} onClose={handleDialogClose}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this coach? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleDeleteConfirm} color="error" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </main>
  );
}

export default CoachManagement;
