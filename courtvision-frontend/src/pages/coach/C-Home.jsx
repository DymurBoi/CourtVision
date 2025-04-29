import React from 'react';
import { Link } from 'react-router-dom';
import '../../styles/coach/C-Home.css';

function CHome() {
  return (
    <main className="main-content">
      <div className="page-header">
        <h1>Basketball Teams</h1>
        <p>Explore our different basketball teams and their achievements</p>
      </div>
      
      <div className="teams-container">
        <div className="team-card">
          <div className="team-banner college"></div>
          <div className="team-content">
            <h2>CIT-U College Team</h2>
            <p>Our collegiate basketball team competing in university leagues and championships.</p>
            <div className="team-stats">
              <div className="player-count">
                <span className="stat-label">Players:</span>
                <span className="stat-value">15</span>
              </div>
            </div>
            <Link to="/teams?id=1" className="team-button">View Team Details</Link>
          </div>
        </div>
        
        <div className="team-card">
          <div className="team-banner highschool"></div>
          <div className="team-content">
            <h2>CIT-U High School Team</h2>
            <p>Our high school basketball team developing young talents and competing in regional tournaments.</p>
            <div className="team-stats">
              <div className="player-count">
                <span className="stat-label">Players:</span>
                <span className="stat-value">12</span>
              </div>
            </div>
            <Link to="/teams?id=2" className="team-button">View Team Details</Link>
          </div>
        </div>
        
        <div className="team-card">
          <div className="team-banner elementary"></div>
          <div className="team-content">
            <h2>CIT-U Elementary Team</h2>
            <p>Our elementary school basketball program focusing on fundamentals and youth development.</p>
            <div className="team-stats">
              <div className="player-count">
                <span className="stat-label">Players:</span>
                <span className="stat-value">10</span>
              </div>
            </div>
            <Link to="/teams?id=3" className="team-button">View Team Details</Link>
          </div>
        </div>
      </div>
    </main>
  );
}

export default CHome;
