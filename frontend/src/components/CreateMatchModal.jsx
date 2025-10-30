import { useState } from "react";
import { api } from "../utils/axiosConfig";
import "../styles/CreateMatchModal.css";

function CreateMatchModal({ onClose, onSave, teamId }) {
  const [formData, setFormData] = useState({
    homeTeam: "CIT-U",
    awayTeam: "",
    gameType: "Scrimmage",
    recordingType: "Live",
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

    if (isSubmitting) return;
    setIsSubmitting(true);

    // Basic validation
    if (!formData.awayTeam || !formData.gameDate) {
      alert("Please fill all the required fields.");
      setIsSubmitting(false);
      return;
    }

    if (formData.recordingType === "Post" && !formData.finalScore) {
      alert("Please fill in the final score for Post Game Analysis.");
      setIsSubmitting(false);
      return;
    }

    try {
      // use the date input value (YYYY-MM-DD) to match backend LocalDate expected format
      const formattedDate = formData.gameDate; // already in YYYY-MM-DD

      // Ensure there is an active season (global) and include it in the game payload
      const seasonsRes = await api.get("/seasons/active");
      const active = seasonsRes.data;
      if (!active || active.length === 0) {
        alert("No active season found. Start a season before creating matches.");
        setIsSubmitting(false);
        return;
      }

      const seasonId = active[0].id;

      // Prepare the payload conditionally
      const gamePayload = {
        gameName: `${formData.homeTeam} vs ${formData.awayTeam}`,
        gameType: formData.gameType,
        recordingType: formData.recordingType,
        gameResult: formData.recordingType === "Live" ? "" : formData.gameResult,
        finalScore: formData.recordingType === "Live" ? "" : formData.finalScore,
        gameDate: formattedDate,
        team: { teamId: teamId },
        season: { id: seasonId }
      };

      const gameRes = await api.post(`/games/post`, gamePayload);
      const savedGame = gameRes.data;

      console.log("✅ Game created:", savedGame);
      alert("✅ Match created successfully!");
      onSave(savedGame);
      onClose();
    } catch (error) {
      console.error("❌ Failed to save match:", error);
      // Try to show meaningful server error
      const serverMsg = error?.response?.data || error?.response?.data?.message || error?.message;
      alert(serverMsg || "Failed to save match.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={() => !isSubmitting && onClose()}>
      <div className="modal-container match-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Create New Match</h2>
          <button className="close-button" onClick={onClose}>
            &times;
          </button>
        </div>

        <form onSubmit={handleSubmit}>
              <h3>Match Details</h3>
              {/*First Row*/}
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
                  />
                </div>
                <div className="form-group">
                  <label>Game Type</label>
                  <select
                    name="gameType"
                    value={formData.gameType}
                    onChange={handleChange}
                  >
                    <option value="Scrimmage">Scrimmage</option>
                    <option value="Practice">Practice</option>
                    <option value="Official Match">Official Match</option>
                  </select>
                </div>
              </div>

              {/*Second Row*/}
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
                  <label>Recording Type</label>
                  <select
                    name="recordingType"
                    value={formData.recordingType}
                    onChange={handleChange}
                  >
                    <option value="Live">Live Analysis</option>
                    <option value="Post">Post Game Analysis</option>
                  </select>
                </div>
                {formData.recordingType === "Post" ? (
                  <div className="form-group">
                    <label>Game Result & Final Score</label>
                    <div style={{ display: 'flex', gap: '0.5rem', flexDirection: 'column' }}>
                      <select
                        name="gameResult"
                        value={formData.gameResult}
                        onChange={handleChange}
                        style={{ marginBottom: '6px' }}
                      >
                        <option value="W">Win</option>
                        <option value="L">Loss</option>
                        <option value="T">Tie</option>
                      </select>
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
                ) : (
                  <div className="form-group" style={{ visibility: 'hidden' }}>
                    {/* spacer for alignment */}
                  </div>
                )}
              </div>

              <div className="modal-actions">
                <button type="submit" className="save-button-create" disabled={isSubmitting} onClick={(e) => e.stopPropagation()}>
                  {isSubmitting ? "Saving..." : "Save Match"}
                </button>
              </div>
        </form>
      </div>
    </div>
  );
}

export default CreateMatchModal;
