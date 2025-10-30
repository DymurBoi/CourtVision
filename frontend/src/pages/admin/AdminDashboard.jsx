"use client";

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AdminNavbar from "../../components/AdminNavbar";
import { api } from "../../utils/axiosConfig";
import "../../styles/admin/AdminDashboard.css";

function AdminDashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    players: 0,
    coaches: 0,
    teams: 0,
  });

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const [playersRes, coachesRes, teamsRes] = await Promise.all([
          api.get("/players/get/all"),
          api.get("/coaches/get/all"),
          api.get("/teams/get/all"),
        ]);

        const players = playersRes.data;
        const coaches = coachesRes.data.filter((coach) => !coach.isAdmin);
        const teams = teamsRes.data;

        setStats({
          players: players.length,
          coaches: coaches.length,
          totalUsers: players.length + coaches.length,
          teams: teams.length,
        });
      } catch (err) {
        console.error("❌ Failed to fetch dashboard stats:", err);
        alert("Failed to load dashboard statistics.");
      }
    };

    fetchCounts();
  }, []);

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
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="action-icon">
                <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                <circle cx="8.5" cy="7" r="4"></circle>
                <line x1="20" y1="8" x2="20" y2="14"></line>
                <line x1="23" y1="11" x2="17" y2="11"></line>
              </svg>
              Create Coach Account
            </Link>
          </div>
        </div>

        <div className="dashboard-overview">
          <h2 className="section-title">Overview</h2>
          <div className="stats-grid">
            <StatCard title="Total Users" value={stats.totalUsers} iconClass="users-icon" />
            <StatCard title="Players" value={stats.players} iconClass="players-icon" />
            <StatCard title="Coaches" value={stats.coaches} iconClass="coaches-icon" />
            <StatCard title="Teams" value={stats.teams} iconClass="teams-icon" />
          </div>
        </div>

        {/* ✅ RECENT ACTIVITY */}
        <div className="dashboard-sections">
        </div>
      </main>
    </div>
  );
}

function StatCard({ title, value, iconClass }) {
  return (
    <div className="stat-card">
      <div className={`stat-icon ${iconClass}`}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
          <circle cx="9" cy="7" r="4"></circle>
          <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
          <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
        </svg>
      </div>
      <div className="stat-info">
        <h3>{title}</h3>
        <p className="stat-value">{value}</p>
      </div>
    </div>
  );
}

export default AdminDashboard;
