import { useState } from "react";
import { api } from "../utils/axiosConfig";
import "../styles/Modal.css";
import "../styles/MatchModal.css";

function CreateMatchModal({ onClose, onSave, teamId }) {
  const [formData, setFormData] = useState({
    homeTeam: "CIT-U",
    awayTeam: "",
    gameDate: new Date().toISOString().split("T")[0], // ISO 8601 format
    gameResult: "W",
    finalScore: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isSubmitting) return; // Prevent multiple submissions
    setIsSubmitting(true); // Set the submitting flag

    // Validate form data before submission
    if (!formData.awayTeam || !formData.finalScore || !formData.gameDate) {
      alert("Please fill all the required fields.");
      setIsSubmitting(false);
      return;
    }

    try {
      // Ensure the game date is formatted correctly
      const formattedDate = new Date(formData.gameDate).toISOString(); // ISO format

      const gamePayload = {
        gameName: `${formData.homeTeam} vs ${formData.awayTeam}`,
        gameResult: formData.gameResult,
        finalScore: formData.finalScore,
        gameDate: formattedDate,
        team: { teamId: teamId },
      };

      const gameRes = await api.post("/games/post", gamePayload);
      const savedGame = gameRes.data;

      console.log("✅ Game created:", savedGame);

      alert("✅ Match created successfully!");
      onSave(savedGame); // Pass back the new game object
      onClose();
    } catch (error) {
      console.error("❌ Failed to save match:", error);
      alert("Failed to save match.");
    } finally {
      setIsSubmitting(false); // Reset after the request is done
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
              <div className="form-group">
                <label htmlFor="homeTeam">Home Team</label>
                <input
                  type="text"
                  name="homeTeam"
                  value={formData.homeTeam}
                  onChange={handleChange}
                  placeholder="Home Team"
                  required
                  style={{ width: "150px" }}
                />
                </div>
                <div className="form-group">
                <label htmlFor="awayTeam">Away Team</label>
                <input
                  type="text"
                  name="awayTeam"
                  value={formData.awayTeam}
                  onChange={handleChange}
                  placeholder="Away Team"
                  required
                  style={{ width: "150px" }}
                />
                </div>
                
              </div>
              <div className="form-row">
              <div className="form-group">
                <label>Game Date</label>
                <input
                  type="date"
                  name="gameDate"
                  value={formData.gameDate}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Game Result</label>
                <select
                  name="gameResult"
                  value={formData.gameResult}
                  onChange={handleChange}
                >
                  <option value="W">Win</option>
                  <option value="L">Loss</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="finalScore">Final Score</label>
                <input
                  type="text"
                  name="finalScore"
                  value={formData.finalScore}
                  onChange={handleChange}
                  placeholder="Score (e.g. 78-65)"
                  required
                />
                </div>
              </div>
            </div>
          </div>

          <div className="modal-actions">
            <button type="submit" className="save-button-create" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Save Match"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateMatchModal;
