"use client"

import "../../styles/player/P-Home.css"

function PHome() {
  // Static player data
  const playerData = {
    name: "John Doe",
    jerseyNumber: 23,
    position: "Point Guard",
    team: {
      id: 1,
      name: "CIT-U College Team",
      description: "Our collegiate basketball team competing in university leagues and championships.",
      coach: "Michael Thompson",
    },
  }

  // Static team members data
  const teamMembers = [
    { id: 101, firstName: "James", lastName: "Wilson", jerseyNumber: 23, position: "Point Guard", avatar: "J" },
    { id: 102, firstName: "Robert", lastName: "Garcia", jerseyNumber: 10, position: "Shooting Guard", avatar: "R" },
    { id: 103, firstName: "Michael", lastName: "Chen", jerseyNumber: 7, position: "Small Forward", avatar: "M" },
    { id: 104, firstName: "David", lastName: "Smith", jerseyNumber: 32, position: "Power Forward", avatar: "D" },
    { id: 105, firstName: "Christopher", lastName: "Johnson", jerseyNumber: 45, position: "Center", avatar: "C" },
    { id: 106, firstName: "Daniel", lastName: "Martinez", jerseyNumber: 5, position: "Point Guard", avatar: "D" },
    { id: 107, firstName: "Anthony", lastName: "Rodriguez", jerseyNumber: 12, position: "Shooting Guard", avatar: "A" },
    { id: 108, firstName: "Kevin", lastName: "Brown", jerseyNumber: 21, position: "Small Forward", avatar: "K" },
    { id: 109, firstName: "Thomas", lastName: "Davis", jerseyNumber: 33, position: "Power Forward", avatar: "T" },
    { id: 110, firstName: "Brian", lastName: "Taylor", jerseyNumber: 50, position: "Center", avatar: "B" },
  ]

  return (
    <main className="main-content">
      <div className="player-dashboard">
        <div className="player-welcome">
          <div className="player-avatar">
            <span>{playerData.name.charAt(0)}</span>
          </div>
          <div className="player-welcome-text">
            <h1>Welcome, {playerData.name}</h1>
            <p>
              #{playerData.jerseyNumber} | {playerData.position}
            </p>
          </div>
        </div>

        <div className="player-team-card">
          <div className="team-banner college"></div>
          <div className="team-content">
            <h2>{playerData.team.name}</h2>
            <p>{playerData.team.description}</p>
            <div className="team-meta">
              <div className="meta-item">
                <span className="meta-label">Coach:</span>
                <span className="meta-value">{playerData.team.coach}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Team Members Section */}
        <div className="team-members-section">
          <h2>Team Members</h2>
          <div className="team-members-grid">
            {teamMembers.map((member) => (
              <div className="team-member-card" key={member.id}>
                <div className="member-avatar">
                  <span>{member.avatar}</span>
                </div>
                <div className="member-details">
                  <h3>
                    {member.firstName} {member.lastName}
                  </h3>
                  <p className="member-jersey">#{member.jerseyNumber}</p>
                  <p className="member-position">{member.position}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  )
}

export default PHome
