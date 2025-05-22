"use client";

import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { useAuth } from "../../components/AuthContext";
import AdminNavbar from "../../components/AdminNavbar";
import "../../styles/admin/AdminDashboard.css";

function AdminDashboard() {
  const { token, user, loading } = useAuth();
  const [adminId, setAdminId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (loading) return;

    if (!token || user?.role !== "admin") {
      navigate("/admin/login", { replace: true });
      return;
    }

    try {
      const decoded = jwtDecode(token);
      setAdminId(decoded.sub);
      console.log("✅ Admin ID from token:", decoded.sub);
    } catch (err) {
      console.error("❌ Invalid token:", err);
      navigate("/admin/login", { replace: true });
    }
  }, [token, user, loading, navigate]);

  if (loading) {
    return <div className="auth-loading">Loading dashboard...</div>;
  }

  const stats = {
    totalUsers: 45,
    players: 38,
    coaches: 7,
    teams: 3,
    matches: 8,
    pendingRequests: 5,
  };

  return (
    <div className="admin-layout">
      <AdminNavbar />
      <main className="admin-content">
        <div className="admin-header">
          <div className="header-content">
            <h1>Admin Dashboard</h1>
            <p>Welcome to the CourtVision admin panel</p>
          </div>
          <div className="header-actions">
            <Link to="/admin/users/new-coach" className="primary-action-button">
              <svg xmlns="http://www.w3.org/2000/svg" className="action-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="8.5" cy="7" r="4" />
                <line x1="20" y1="8" x2="20" y2="14" />
                <line x1="23" y1="11" x2="17" y2="11" />
              </svg>
              Create Coach Account
            </Link>
          </div>
        </div>

        <div className="dashboard-overview">
          <h2 className="section-title">Overview</h2>
          <div className="stats-grid">
            {Object.entries(stats).map(([key, value]) => (
              <div className="stat-card" key={key}>
                <div className="stat-info">
                  <h3>{key.replace(/([A-Z])/g, " $1").replace(/^./, str => str.toUpperCase())}</h3>
                  <p className="stat-value">{value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

export default AdminDashboard;
