"use client";

import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  FormControl,
  InputLabel,
  OutlinedInput,
  InputAdornment,
  IconButton,
  FormHelperText,
  Snackbar,
  Alert as MuiAlert,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import "../../styles/admin/UserForm.css";
import axios from "axios";
import { API_BASE_URL } from "../../utils/axiosConfig";

const Alert = (props) => <MuiAlert elevation={6} variant="filled" {...props} />;

function CreateCoach() {
  const navigate = useNavigate();

  // 🔹 Form state
  const [formData, setFormData] = useState({
    fname: "",
    lname: "",
    email: "",
    password: "",
    confirmPassword: "",
    birthDate: "",
  });

  // UI + validation states
  const [showPassword, setShowPassword] = useState(false);
  const [confirmShowPassword, setConfirmShowPassword] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [birthDateError, setBirthDateError] = useState("");

  //Snackbar state
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  //Handlers
  const handleClickShowPassword = () => setShowPassword((prev) => !prev);
  const handleConfirmClickShowPassword = () =>
    setConfirmShowPassword((prev) => !prev);

  const handleSnackbarClose = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  //Real-time validation
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    if (name === "confirmPassword" || name === "password") {
      if (
        (name === "confirmPassword" && value !== formData.password) ||
        (name === "password" &&
          formData.confirmPassword &&
          value !== formData.confirmPassword)
      ) {
        setPasswordError("Passwords do not match");
      } else {
        setPasswordError("");
      }
    }

    if (name === "birthDate") {
      const selectedYear = new Date(value).getFullYear();
      const currentYear = new Date().getFullYear();
      if (selectedYear >= currentYear) {
        setBirthDateError("Birth year cannot be this year or in the future");
      } else {
        setBirthDateError("");
      }
    }
  };

  // 🧾 Form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    const pwdRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;

    if (!pwdRegex.test(formData.password)) {
      setPasswordError("Password must be at least 8 chars and include uppercase, lowercase, number and special character");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setPasswordError("Passwords do not match");
      return;
    }

    try {
      const response = await axios.post(`${API_BASE_URL}/coaches/post`, formData);

      console.log("Coach created:", response.data);

      setSnackbar({
        open: true,
        message: "Coach created successfully!",
        severity: "success",
      });

      //Navigate after short delay
      setTimeout(() => navigate("/admin/users?type=coach"), 1500);
    } catch (error) {
      console.error("Error creating coach:", error);
      setSnackbar({
        open: true,
        message: "Failed to create coach. Please check your input.",
        severity: "error",
      });
    }
  };

  return (
    <div className="admin-layout">
      <main className="admin-content">
        <div className="admin-header">
          <h1>Create Coach Account</h1>
          <p>Add a new coach to the system</p>
        </div>

        <div className="user-form-container">
          <form onSubmit={handleSubmit} className="user-form">
            <div className="form-section">
              <h2>Basic Information</h2>

              {/* First Name */}
              <div className="form-input-wrapper">
                <FormControl fullWidth variant="outlined" required>
                  <InputLabel htmlFor="fname">First Name</InputLabel>
                  <OutlinedInput
                    id="fname"
                    name="fname"
                    type="text"
                    value={formData.fname}
                    onChange={handleChange}
                    sx={{ bgcolor: "#fff" }}
                  />
                </FormControl>
              </div>

              {/* Last Name */}
              <div className="form-input-wrapper">
                <FormControl fullWidth variant="outlined" required>
                  <InputLabel htmlFor="lname">Last Name</InputLabel>
                  <OutlinedInput
                    id="lname"
                    name="lname"
                    type="text"
                    value={formData.lname}
                    onChange={handleChange}
                    sx={{ bgcolor: "#fff" }}
                  />
                </FormControl>
              </div>

              {/* Email */}
              <div className="form-input-wrapper">
                <FormControl fullWidth variant="outlined" required>
                  <InputLabel htmlFor="email">Email</InputLabel>
                  <OutlinedInput
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    sx={{ bgcolor: "#fff" }}
                  />
                </FormControl>
              </div>

              {/* Password */}
              <div className="form-input-wrapper">
                <FormControl fullWidth variant="outlined" required error={Boolean(passwordError)}>
                  <InputLabel htmlFor="password">Password</InputLabel>
                  <OutlinedInput
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={handleChange}
                    sx={{ bgcolor: "#fff" }}
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton
                          onClick={handleClickShowPassword}
                          edge="end"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    }
                  />
                  {passwordError && (
                    <FormHelperText>{passwordError}</FormHelperText>
                  )}
                </FormControl>
              </div>

              {/* Confirm Password */}
              <div className="form-input-wrapper">
                <FormControl
                  fullWidth
                  variant="outlined"
                  required
                  error={Boolean(passwordError)}
                >
                  <InputLabel htmlFor="confirmPassword">
                    Confirm Password
                  </InputLabel>
                  <OutlinedInput
                    id="confirmPassword"
                    name="confirmPassword"
                    type={confirmShowPassword ? "text" : "password"}
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    sx={{ bgcolor: "#fff" }}
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton
                          onClick={handleConfirmClickShowPassword}
                          edge="end"
                        >
                          {confirmShowPassword ? (
                            <VisibilityOff />
                          ) : (
                            <Visibility />
                          )}
                        </IconButton>
                      </InputAdornment>
                    }
                  />
                  {passwordError && (
                    <FormHelperText>{passwordError}</FormHelperText>
                  )}
                </FormControl>
              </div>

              {/* Birth Date */}
              <div className="form-input-wrapper">
                <FormControl
                  fullWidth
                  variant="outlined"
                  required
                  error={Boolean(birthDateError)}
                >
                  <InputLabel shrink htmlFor="birthDate">
                    Birth Date
                  </InputLabel>
                  <OutlinedInput
                    id="birthDate"
                    type="date"
                    name="birthDate"
                    value={formData.birthDate}
                    onChange={handleChange}
                    sx={{ bgcolor: "#F5F5F5" }}
                  />
                  {birthDateError && (
                    <FormHelperText>{birthDateError}</FormHelperText>
                  )}
                </FormControl>
              </div>
            </div>

            {/*  Buttons */}
            <div className="form-actions">
              <button type="submit" className="save-button">
                Create Coach
              </button>
              <Link to="/admin/users" className="cancel-button">
                Cancel
              </Link>
            </div>
          </form>
        </div>
      </main>

      {/* Snackbar Notification */}
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

export default CreateCoach;
