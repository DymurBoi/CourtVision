import React, { useEffect, useState } from "react";
import { useAuth } from "../../components/AuthContext";
import { api } from "../../utils/axiosConfig";
import "../../styles/player/P-Stats.css";

function CSeason() {
  const { user } = useAuth();
  const [seasons, setSeasons] = useState([]);
  const [seasonName, setSeasonName] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [coachId, setCoachId] = useState(null);
  const [teamId, setTeamId] = useState(null);

  useEffect(() => {
    const init = async () => {
      if (user && user.id) {
        let id = user.id;
        if (typeof id === "string" && id.startsWith("COACH_")) {
          id = id.substring(6);
        }
        setCoachId(id);
        try {
          const teamsRes = await api.get(`/teams/get/by-coach/${id}`);
          const teams = teamsRes.data || [];
          if (teams.length > 0) {
            const tId = teams[0].teamId;
            setTeamId(tId);
            fetchSeasons(tId);
          } else {
            setSeasons([]);
            setLoading(false);
          }
        } catch (err) {
          setError('Failed to fetch teams for coach');
          setLoading(false);
        }
      }
    };
    init();
  }, [user]);

  const fetchSeasons = async (id) => {
    setLoading(true);
    try {
      const res = await api.get(`/seasons/team/${id}`);
      setSeasons(res.data || []);
      setError("");
    } catch (err) {
      setError("Failed to fetch seasons.");
      setSeasons([]);
    }
    setLoading(false);
  };

  const handleStartSeason = async (e) => {
    e.preventDefault();
    if (!seasonName.trim() || !teamId) return;
    try {
      await api.post(`/seasons/start?name=${encodeURIComponent(seasonName)}&teamId=${teamId}`);
      setSeasonName("");
      fetchSeasons(teamId);
    } catch (err) {
      setError("Failed to start season.");
    }
  };

  const handleEndSeason = async (seasonId) => {
    try {
      await api.post(`/seasons/${seasonId}/stop`);
      if (teamId) fetchSeasons(teamId);
    } catch (err) {
      setError("Failed to end season.");
    }
  };

  return (
    <div className="stats-container">
      <h1 className="page-title">Season Management</h1>
      <p className="page-subtitle">Start or end a season for your team</p>
      <form onSubmit={handleStartSeason} style={{ marginBottom: 24 }}>
        <input
          type="text"
          value={seasonName}
          onChange={e => setSeasonName(e.target.value)}
          placeholder="Season Name"
          style={{ padding: 8, borderRadius: 6, border: '1px solid #ccc', marginRight: 8 }}
          required
        />
        <button className="apply-button" type="submit">Start New Season</button>
      </form>
      {loading ? (
        <div>Loading seasons...</div>
      ) : error ? (
        <div style={{ color: 'red' }}>{error}</div>
      ) : (
        <div className="stats-card">
          <div className="stats-card-header">
            <h2>All Seasons</h2>
          </div>
          <div style={{ padding: 24 }}>
            {seasons.length === 0 ? (
              <div>No seasons found.</div>
            ) : (
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: 'var(--light-purple)' }}>
                    <th style={{ padding: 8 }}>Name</th>
                    <th style={{ padding: 8 }}>Start Date</th>
                    <th style={{ padding: 8 }}>End Date</th>
                    <th style={{ padding: 8 }}>Status</th>
                    <th style={{ padding: 8 }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {seasons.map(season => (
                    <tr key={season.id} style={{ borderBottom: '1px solid #eee' }}>
                      <td style={{ padding: 8 }}>{season.seasonName}</td>
                      <td style={{ padding: 8 }}>{season.startDate || '-'}</td>
                      <td style={{ padding: 8 }}>{season.endDate || '-'}</td>
                      <td style={{ padding: 8 }}>
                        {season.active ? <span style={{ color: 'green' }}>Active</span> : 'Ended'}
                      </td>
                      <td style={{ padding: 8 }}>
                        <div style={{ display: 'flex', gap: 8 }}>
                          {season.active && (
                            <button className="apply-button" style={{ padding: '4px 12px', fontSize: 14 }} onClick={() => handleEndSeason(season.id)}>
                              End Season
                            </button>
                          )}
                          <a href={`/coach/season/${season.id}/games`} className="apply-button" style={{ padding: '4px 12px', fontSize: 14, textDecoration: 'none' }}>
                            View Games
                          </a>
                          <a href={`/coach/season/${season.id}/ranking`} className="apply-button" style={{ padding: '4px 12px', fontSize: 14, textDecoration: 'none' }}>
                            View Player Ranking
                          </a>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default CSeason;
