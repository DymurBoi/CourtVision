import { useState } from "react";
import { api } from "../utils/axiosConfig";
import "../styles/Modal.css";
import "../styles/MatchModal.css";

function CreateMatchModal({ onClose, onSave, teamId }) {
  const [formData, setFormData] = useState({
    homeTeam: "CIT-U",
    awayTeam: "",
    gameDate: new Date().toISOString().split("T")[0],
    gameResult: "W",
    finalScore: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const gamePayload = {
        gameName: `${formData.homeTeam} vs ${formData.awayTeam}`,
        gameResult: formData.gameResult,
        finalScore: formData.finalScore,
        gameDate: formData.gameDate,
        team: { teamId: teamId },
      };

      const gameRes = await api.post("/games/post", gamePayload);
      const savedGame = gameRes.data;
      console.log("✅ Game created:", savedGame);

      alert("✅ Match created successfully!");
      onSave(savedGame); // pass back the new game object
      onClose();
    } catch (error) {
      console.error("❌ Failed to save match:", error);
      alert("Failed to save match. Check console for details.");
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container match-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Create New Match</h2>
          <button className="close-button" onClick={onClose}>
            &times;
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-content">
            <div className="match-form-section">
              <h3>Match Details</h3>
              <div className="form-row">
                <input
                  type="text"
                  name="homeTeam"
                  value={formData.homeTeam}
                  onChange={handleChange}
                  placeholder="Home Team"
                  required
                  style={{ width: "150px" }}
                />
                <input
                  type="text"
                  name="awayTeam"
                  value={formData.awayTeam}
                  onChange={handleChange}
                  placeholder="Away Team"
                  required
                  style={{ width: "150px" }}
                />
                <input
                  type="text"
                  name="finalScore"
                  value={formData.finalScore}
                  onChange={handleChange}
                  placeholder="Score (e.g. 78-65)"
                  required
                  style={{ width: "100px" }}
                />
              </div>
              <div className="form-row">
                <select
                  name="gameResult"
                  value={formData.gameResult}
                  onChange={handleChange}
                  style={{ width: "100px" }}
                >
                  <option value="W">Win</option>
                  <option value="L">Loss</option>
                </select>
                <input
                  type="date"
                  name="gameDate"
                  value={formData.gameDate}
                  onChange={handleChange}
                  required
                  style={{ width: "150px" }}
                />
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" onClick={onClose} className="cancel-button">
              Cancel
            </button>
            <button type="submit" className="save-button">
              Save Match
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateMatchModal;
