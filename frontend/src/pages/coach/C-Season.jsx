import React, { useEffect, useState } from "react";
import { useAuth } from "../../components/AuthContext";
import { api } from "../../utils/axiosConfig";
import "../../styles/coach/C-Season.css";

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
          setError("Failed to fetch teams for coach");
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
      await api.post(
        `/seasons/start?name=${encodeURIComponent(seasonName)}&teamId=${teamId}`
      );
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
    <div className="season-page stats-container">
      <h1 className="page-title">Season Management</h1>
      <p className="page-subtitle">Start or end a season for your team</p>

      <form className = "season-page form"onSubmit={handleStartSeason}>
        <input
          type="text"
          value={seasonName}
          onChange={(e) => setSeasonName(e.target.value)}
          placeholder="Season Name"
          required
        />
        <button className="apply-button" type="submit">
          Start New Season
        </button>
      </form>

      {loading ? (
        <div>Loading seasons...</div>
      ) : error ? (
        <div className="error-message">{error}</div>
      ) : (
        <div className="season-page stats-card">
          <div className="season-page stats-card-header">
            <h2>All Seasons</h2>
          </div>
          <div className="stats-card-body">
            {seasons.length === 0 ? (
              <div className="no-data">No seasons found.</div>
            ) : (
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Start Date</th>
                    <th>End Date</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {seasons.map((season) => (
                    <tr key={season.id}>
                      <td data-label="Name">{season.seasonName}</td>
                      <td data-label="Start Date">{season.startDate || "-"}</td>
                      <td data-label="End Date">{season.endDate || "-"}</td>
                      <td data-label="Status">
                        {season.active ? (
                          <span className="status-active">Active</span>
                        ) : (
                          <span className="status-ended">Ended</span>
                        )}
                      </td>
                      <td data-label="Action">
                        <div className="actions">
                          {season.active && (
                            <button
                              className="apply-button"
                              onClick={() => handleEndSeason(season.id)}
                            >
                              End Season
                            </button>
                          )}
                          <a
                            href={`/coach/season/${season.id}/games`}
                            className="apply-button"
                          >
                            View Games
                          </a>
                          <a
                            href={`/coach/season/${season.id}/ranking`}
                            className="apply-button"
                          >
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
