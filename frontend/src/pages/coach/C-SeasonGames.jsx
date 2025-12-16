import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api } from "../../utils/axiosConfig";
import "../../styles/player/P-Stats.css";

function CSeasonGames() {
  const { id: seasonId } = useParams();
  const navigate = useNavigate();
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchGames = async () => {
      setLoading(true);
      try {
        console.log('Fetching games for season:', seasonId);
        const res = await api.get(`/seasons/${seasonId}/games`);
        console.log('Games response:', res.data);
        setGames(res.data || []);
        setError("");
      } catch (err) {
        console.error('Error fetching games:', err);
        console.error('Error response:', err.response);
        setError("Failed to fetch games for this season.");
      }
      setLoading(false);
    };

    if (seasonId) fetchGames();
  }, [seasonId]);

  if (loading) return <div className="loading">Loading games...</div>;
  if (error) return <div style={{ color: 'red' }}>{error}</div>;

  return (
    <div className="stats-container">
      <h1 className="page-title">Games for Season</h1>
      <div style={{ marginTop: 16 }}>
        {games.length === 0 ? (
          <div>No games found for this season.</div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: 'var(--light-purple)' }}>
                <th style={{ padding: 8 }}>Name</th>
                <th style={{ padding: 8 }}>Date</th>
                <th style={{ padding: 8 }}>Type</th>
                <th style={{ padding: 8 }}>Recording</th>
                <th style={{ padding: 8 }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {games.map(game => (
                <tr key={game.gameId} style={{ borderBottom: '1px solid #eee' }}>
                  <td style={{ padding: 8 }}>{game.gameName}</td>
                  <td style={{ padding: 8 }}>{game.gameDate || '-'}</td>
                  <td style={{ padding: 8 }}>{game.gameType || '-'}</td>
                  <td style={{ padding: 8 }}>
                    {(() => {
                      const rt = (game.recordingType || '').toString();
                      const lower = rt.toLowerCase();
                      if (lower.includes('live')) return 'Live';
                      if (lower.includes('post')) return 'Post';
                      return rt || '-';
                    })()}
                  </td>
                  <td style={{ padding: 8 }}>
                    <button
                      className="apply-button"
                      onClick={() => navigate(`/coach/game-details/${game.gameId}`)}
                      style={{ padding: '4px 12px', fontSize: 14 }}
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default CSeasonGames;
