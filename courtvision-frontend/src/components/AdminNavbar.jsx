"use client"

import { useState } from "react"
import { Link, useLocation } from "react-router-dom"
import "../styles/admin/AdminNavbar.css"

function AdminNavbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()

  const toggleMenu = () => {
    setMenuOpen(!menuOpen)
  }

  const isActive = (path) => {
    return location.pathname.startsWith(path) ? "active" : ""
  }

  return (
    <nav className="admin-navbar">
      <div className="admin-navbar-container">
        <div className="admin-logo">
          <Link to="/admin">
            <span className="logo-text">CourtVision</span>
            <span className="admin-badge">Admin</span>
          </Link>
        </div>

        <div className={`admin-nav-links ${menuOpen ? "active" : ""}`}>
          <Link
            to="/admin"
            className={`admin-nav-item ${isActive("/admin") && !isActive("/admin/users") ? "active" : ""}`}
            onClick={() => setMenuOpen(false)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="nav-icon"
            >
              <rect x="3" y="3" width="7" height="7"></rect>
              <rect x="14" y="3" width="7" height="7"></rect>
              <rect x="14" y="14" width="7" height="7"></rect>
              <rect x="3" y="14" width="7" height="7"></rect>
            </svg>
            Dashboard
          </Link>
          <Link
            to="/admin/users"
            className={`admin-nav-item ${isActive("/admin/users") ? "active" : ""}`}
            onClick={() => setMenuOpen(false)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="nav-icon"
            >
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
              <circle cx="9" cy="7" r="4"></circle>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
            </svg>
            Users
          </Link>
          <Link to="/teams" className="admin-nav-item" onClick={() => setMenuOpen(false)}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="nav-icon"
            >
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
              <circle cx="9" cy="7" r="4"></circle>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
            </svg>
            Teams
          </Link>
          <Link to="/matches" className="admin-nav-item" onClick={() => setMenuOpen(false)}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="nav-icon"
            >
              <circle cx="12" cy="12" r="10"></circle>
              <path d="M12 6v6l4 2"></path>
            </svg>
            Matches
          </Link>
          <Link to="/requests" className="admin-nav-item" onClick={() => setMenuOpen(false)}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="nav-icon"
            >
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
              <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
            </svg>
            Requests
          </Link>
        </div>

        <div className="admin-user-actions">
          <Link to="/" className="view-site-link">
            View Site
          </Link>
          <div className="admin-profile">
            <span className="admin-profile-icon">A</span>
          </div>
        </div>

        <div className="admin-mobile-menu-btn" onClick={toggleMenu}>
          <div className={`menu-icon ${menuOpen ? "open" : ""}`}>
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default AdminNavbar
