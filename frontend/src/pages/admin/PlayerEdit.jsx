"use client";

import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import AdminNavbar from "../../components/AdminNavbar";
import "../../styles/admin/UserForm.css";
import { api } from "../../utils/axiosConfig";

function PlayerEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    fname: "",
    lname: "",
    email: "",
    password: "",
    birthDate: "",
    jerseyNum: "",
    position: "",
    team: null,
  });

  const [teams, setTeams] = useState([]);
  const positions = ["Point Guard", "Shooting Guard", "Small Forward", "Power Forward", "Center"];

  // 🔃 Fetch player data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const playerRes = await api.get(`/players/get/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        });

        const teamRes = await api.get(`/teams/get/all`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        });

        const player = playerRes.data;

        setFormData({
          fname: player.fname || "",
          lname: player.lname || "",
          email: player.email || "",
          password: "", // Leave blank
          birthDate: player.birthDate || "",
          jerseyNum: player.jerseyNum || "",
          position: player.position || "",
          team: player.team || null,
        });

        setTeams(teamRes.data);
      } catch (err) {
        console.error("Failed to load player or teams:", err);
        alert("Failed to load player details");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      ...formData,
      team: teams.find((t) => t.teamName === formData.team), // full team object or ID if required
    };

    try {
      await api.put(`/players/put/${id}`, payload, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });

      alert("✅ Player updated successfully");
      navigate(`/admin/users/${id}`);
    } catch (error) {
      console.error("❌ Failed to update player:", error);
      alert("Update failed. Please check your inputs.");
    }
  };

  if (loading) {
    return <p className="loading">Loading player data...</p>;
  }

  return (
    <div className="admin-layout">
      <main className="admin-content">
        <div className="admin-header">
          <h1>Edit Player</h1>
          <p>Update player details and stats</p>
        </div>

        <div className="user-form-container">
          <form onSubmit={handleSubmit} className="user-form">
            <div className="form-section">
              <h2>Basic Info</h2>
              <div className="form-row">
                <div className="form-group">
                  <label>First Name</label>
                  <input
                    type="text"
                    name="fname"
                    value={formData.fname}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Last Name</label>
                  <input
                    type="text"
                    name="lname"
                    value={formData.lname}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Email</label>
                  <input type="email" name="email" value={formData.email} onChange={handleChange} required />
                </div>
                <div className="form-group">
                  <label>Password</label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Leave blank to keep current"
                  />
                </div>
              </div>
            </div>

            <div className="form-section">
              <h2>Team & Stats</h2>
              <div className="form-row">
                <div className="form-group">
                  <label>Birth Date</label>
                  <input
                    type="date"
                    name="birthDate"
                    value={formData.birthDate}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group">
                  <label>Jersey Number</label>
                  <input
                    type="number"
                    name="jerseyNum"
                    value={formData.jerseyNum}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Position</label>
                  <select name="position" value={formData.position} onChange={handleChange}>
                    <option value="">Select Position</option>
                    {positions.map((p, i) => (
                      <option key={i} value={p}>
                        {p}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Team</label>
                  <select name="team" value={formData.team?.teamName || ""} onChange={handleChange} required>
                    <option value="">Select Team</option>
                    {teams.map((team) => (
                      <option key={team.teamId} value={team.teamName}>
                        {team.teamName}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="form-actions">
              <button type="submit" className="save-button">
                Save Changes
              </button>
              <Link to={`/admin/users/${id}`} className="cancel-button">
                Cancel
              </Link>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}

export default PlayerEdit;
