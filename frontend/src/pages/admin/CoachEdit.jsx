"use client";

import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import AdminNavbar from "../../components/AdminNavbar";
import "../../styles/admin/UserForm.css";
import { api } from "../../utils/axiosConfig";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";

const Alert = (props) => <MuiAlert elevation={6} variant="filled" {...props} />;

function CoachEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  // Snackbar state
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const [formData, setFormData] = useState({
    fname: "",
    lname: "",
    email: "",
    password: "",
    birthDate: "",
  });

  // Fetch coach details
  useEffect(() => {
    const fetchCoach = async () => {
      try {
        const res = await api.get(`/coaches/get/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        });

        const coach = res.data;

        setFormData({
          fname: coach.fname || "",
          lname: coach.lname || "",
          email: coach.email || "",
          password: "",
          birthDate: coach.birthDate || "",
        });
      } catch (error) {
        console.error("Failed to load coach:", error);
        setSnackbar({
          open: true,
          message: "Unable to fetch coach data.",
          severity: "error",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchCoach();
  }, [id]);

  const handleSnackbarClose = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await api.put(`/coaches/put/${id}`, formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });

      setSnackbar({
        open: true,
        message: "Coach updated successfully.",
        severity: "success",
      });

      // Redirect after short delay
      setTimeout(() => navigate(`/admin/coaches`), 1500);
    } catch (error) {
      console.error("Failed to update coach:", error);
      setSnackbar({
        open: true,
        message: "Update failed. Please check your inputs.",
        severity: "error",
      });
    }
  };

  if (loading) {
    return <div className="loading">Loading coach data...</div>;
  }

  return (
    <div className="admin-layout">
      <AdminNavbar />
      <main className="admin-content">
        <div className="admin-header">
          <h1>Edit Coach</h1>
          <p>Update coach information</p>
        </div>

        <div className="user-form-container">
          <form onSubmit={handleSubmit} className="user-form">
            <div className="form-section">
              <h2>Basic Information</h2>

              <div className="form-row">
                <div className="form-group">
                  <label>First Name</label>
                  <input
                    type="text"
                    name="fname"
                    value={formData.fname}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Last Name</label>
                  <input
                    type="text"
                    name="lname"
                    value={formData.lname}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Password</label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Leave blank to keep current password"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Birth Date</label>
                  <input
                    type="date"
                    name="birthDate"
                    value={formData.birthDate}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>

            <div className="form-actions">
              <button type="submit" className="save-button">
                Save Changes
              </button>
              <Link to={`/admin/coaches`} className="cancel-button">
                Cancel
              </Link>
            </div>
          </form>
        </div>
      </main>

      {/* Snackbar for success/error alerts */}
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
    </div>
  );
}

export default CoachEdit;
