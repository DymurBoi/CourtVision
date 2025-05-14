import React, { useState, useEffect } from 'react';

const CTeam = () => {
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPlayers = async () => {
    try {
      const response = await fetch('/api/players'); // Adjust URL as needed
      const data = await response.json();
      
      // Simplify the response to get rid of unnecessary nesting
      const flattenedPlayers = data.map(player => {
        return {
          playerId: player.playerId,
          fname: player.fname,
          lname: player.lname,
          email: player.email,
          jerseyNum: player.jerseyNum,
          isCoach: player.isCoach,
          isAdmin: player.isAdmin,
          team: player.team,
          physicalRecords: player.physicalRecords || {}  // Handle missing physicalRecords safely
        };
      });
      setPlayers(flattenedPlayers);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch players');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlayers();
  }, []); // Empty dependency array ensures it runs only once when the component mounts

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <h1>Players</h1>
      <ul>
        {players.map(player => (
          <li key={player.playerId}>
            <h2>{player.fname} {player.lname}</h2>
            <p>Email: {player.email}</p>
            <p>Jersey Number: {player.jerseyNum}</p>
            <p>Coach: {player.isCoach ? 'Yes' : 'No'}</p>
            <p>Admin: {player.isAdmin ? 'Yes' : 'No'}</p>
            {player.physicalRecords && (
              <div>
                <h3>Physical Records</h3>
                <p>Weight: {player.physicalRecords.weight || 'N/A'}</p>
                <p>Height: {player.physicalRecords.height || 'N/A'}</p>
                <p>Wingspan: {player.physicalRecords.wingspan || 'N/A'}</p>
                <p>Vertical: {player.physicalRecords.vertical || 'N/A'}</p>
                <p>BMI: {player.physicalRecords.bmi || 'N/A'}</p>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CTeam;
