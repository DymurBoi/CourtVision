"use client"

import { Link } from "react-router-dom"
import "../styles/Landing.css"

function Landing() {
  return (
    <div className="landing-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <div className="hero-logo">
            <h1>CourtVision</h1>
            <p className="tagline">Elevate Your Basketball Program</p>
          </div>
          <p className="hero-description">
            The complete management platform for basketball teams, coaches, and players. Track stats, manage rosters,
            and analyze performance all in one place.
          </p>
          <div className="hero-buttons">
            <Link to="/login" className="primary-button">
              Sign In
            </Link>
            <Link to="/register" className="secondary-button">
              Register as Player
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="section-header">
          <h2>Powerful Features</h2>
          <p>Everything you need to manage your basketball program</p>
        </div>

        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon team-icon">
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
            <h3>Team Management</h3>
            <p>
              Organize multiple teams, manage rosters, and track player information all in one centralized platform.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon stats-icon">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M18 20V10"></path>
                <path d="M12 20V4"></path>
                <path d="M6 20v-6"></path>
              </svg>
            </div>
            <h3>Advanced Statistics</h3>
            <p>Track comprehensive player and team statistics with detailed analytics and performance metrics.</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon game-icon">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10"></circle>
                <path d="M12 6v6l4 2"></path>
              </svg>
            </div>
            <h3>Game Management</h3>
            <p>Create, edit, and analyze games with detailed player statistics and performance tracking.</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon profile-icon">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
            </div>
            <h3>Player Profiles</h3>
            <p>Comprehensive player profiles with personal information, statistics, and performance history.</p>
          </div>
        </div>
      </section>

      {/* Teams Section */}
      <section className="teams-section">
        <div className="section-header">
          <h2>Our Teams</h2>
          <p>Manage multiple teams across different age groups and skill levels</p>
        </div>

        <div className="teams-showcase">
          <div className="team-showcase-card college">
            <div className="team-card-content">
              <h3>College Team</h3>
              <p>Our collegiate basketball team competing in university leagues and championships.</p>
              <Link to="/teams?id=1" className="team-link">
                View Team
              </Link>
            </div>
          </div>

          <div className="team-showcase-card highschool">
            <div className="team-card-content">
              <h3>High School Team</h3>
              <p>Our high school basketball team developing young talents and competing in regional tournaments.</p>
              <Link to="/teams?id=2" className="team-link">
                View Team
              </Link>
            </div>
          </div>

          <div className="team-showcase-card elementary">
            <div className="team-card-content">
              <h3>Elementary Team</h3>
              <p>Our elementary school basketball program focusing on fundamentals and youth development.</p>
              <Link to="/teams?id=3" className="team-link">
                View Team
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="section-header">
          <h2>By The Numbers</h2>
          <p>CourtVision is trusted by coaches and players</p>
        </div>

        <div className="stats-container">
          <div className="stat-item">
            <div className="stat-number">3</div>
            <div className="stat-label">Teams</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">45+</div>
            <div className="stat-label">Players</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">8</div>
            <div className="stat-label">Matches</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">100%</div>
            <div className="stat-label">Satisfaction</div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-content">
          <h2>Ready to elevate your basketball program?</h2>
          <p>Join CourtVision today and take your team management to the next level.</p>
          <div className="cta-buttons">
            <Link to="/login" className="primary-button">
              Get Started
            </Link>
            <Link to="/register" className="secondary-button">
              Learn More
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="footer-content">
          <div className="footer-logo">
            <h2>CourtVision</h2>
            <p>Elevate Your Basketball Program</p>
          </div>
          <div className="footer-links">
            <div className="footer-column">
              <h3>Platform</h3>
              <ul>
                <li>
                  <Link to="/teams">Teams</Link>
                </li>
                <li>
                  <Link to="/matches">Matches</Link>
                </li>
                <li>
                  <Link to="/requests">Requests</Link>
                </li>
              </ul>
            </div>
            <div className="footer-column">
              <h3>Resources</h3>
              <ul>
                <li>
                  <a href="#">Documentation</a>
                </li>
                <li>
                  <a href="#">Support</a>
                </li>
                <li>
                  <a href="#">FAQ</a>
                </li>
              </ul>
            </div>
            <div className="footer-column">
              <h3>Company</h3>
              <ul>
                <li>
                  <a href="#">About Us</a>
                </li>
                <li>
                  <a href="#">Contact</a>
                </li>
                <li>
                  <a href="#">Privacy Policy</a>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} CourtVision. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}

export default Landing
