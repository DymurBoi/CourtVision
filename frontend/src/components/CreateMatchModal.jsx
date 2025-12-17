import { useState } from "react";
import { api } from "../utils/axiosConfig";
import "../styles/CreateMatchModal.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function CreateMatchModal({ onClose, onSave, teamId }) {
  const [formData, setFormData] = useState({
    homeTeam: "CIT-U",
    awayTeam: "",
    gameType: "Scrimmage",
    recordingType: "Live",
    gameDate: new Date().toISOString().split("T")[0],
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

    // Create a local copy of formData (so we can modify it safely)
    let updatedFormData = { ...formData };

    // If practice, override home/away teams
    if (updatedFormData.gameType === "Practice") {
      updatedFormData.homeTeam = "CIT-U Team A";
      updatedFormData.awayTeam = "CIT-U Team B";
    }

    // ✅ Now validation uses the *updated* values
    if (!updatedFormData.awayTeam || !updatedFormData.gameDate) {
      toast.error("Please fill all the required fields.", { autoClose: 2500 });
      setIsSubmitting(false);
      return;
    }

    if (updatedFormData.recordingType === "Post" && !updatedFormData.finalScore) {
      toast.error("Please fill in the final score for Post Game Analysis.", { autoClose: 2500 });
      setIsSubmitting(false);
      return;
    }

    try {
      // Fetch active seasons for this specific team only
      const seasonsRes = await api.get(`/seasons/team/${teamId}`);
      const allSeasons = seasonsRes.data;
      
      // Filter for active seasons belonging to this team
      const activeSeasons = allSeasons.filter(season => season.active === true);
      
      if (!activeSeasons || activeSeasons.length === 0) {
        toast.error("No active season found for this team. Please start a season first.", { autoClose: 3000 });
        setIsSubmitting(false);
        return;
      }

      const seasonId = activeSeasons[0].id;

      const gamePayload = {
        gameName: `${updatedFormData.homeTeam} vs ${updatedFormData.awayTeam}`,
        gameType: updatedFormData.gameType,
        recordingType: updatedFormData.recordingType,
        gameDate: updatedFormData.gameDate,
        gameResult: updatedFormData.recordingType === "Post" ? updatedFormData.gameResult : "",
        finalScore: updatedFormData.recordingType === "Post" ? updatedFormData.finalScore : "",
        team: { teamId },
        season: { id: seasonId },
      };

      const gameRes = await api.post("/games/post", gamePayload);
      const savedGame = gameRes.data;

      toast.success("✅ Match created successfully!", { autoClose: 2500 });
      onSave(savedGame);
      onClose();
    } catch (error) {
      console.error("❌ Failed to save match:", error);
      toast.error(
        error?.response?.data?.message || error?.message || "Failed to save match.",
        { autoClose: 3000 }
      );
    } finally {
      setIsSubmitting(false);
    }
  };


  return (
    <>
      <ToastContainer position="top-center" theme="colored" />

      <div className="modal-overlay" onClick={() => !isSubmitting && onClose()}>
        <div
          className="modal-container match-modal"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="modal-header">
            <h2>Create New Match</h2>
            <button className="close-button" onClick={onClose}>
              &times;
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <h3>Match Details</h3>

            {/* First Row */}
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
              {formData.gameType !== "Practice" && (
                <div className="form-group">
                  <label htmlFor="awayTeam">Away Team</label>
                  <input
                    type="text"
                    name="awayTeam"
                    value={formData.awayTeam}
                    onChange={handleChange}
                    placeholder="Away Team"
                    required={formData.gameType !== "Practice"}
                  />
                </div>
              )}

              <div className="form-group">
                <label>Game Type</label>
                <select
                  name="gameType"
                  className="team-select"
                  value={formData.gameType}
                  onChange={handleChange}
                >
                  <option value="Scrimmage">Scrimmage</option>
                  <option value="Practice">Practice</option>
                  <option value="Official Match">Official Match</option>
                </select>
              </div>
            </div>

            {/* Second Row */}
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
                  <div
                    style={{
                      display: "flex",
                      gap: "0.5rem",
                      flexDirection: "column",
                    }}
                  >
                    <select
                      name="gameResult"
                      value={formData.gameResult}
                      onChange={handleChange}
                      style={{ marginBottom: "6px" }}
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
                <div className="form-group" style={{ visibility: "hidden" }} />
              )}
            </div>

            <div className="modal-actions">
              <button
                type="submit"
                className="save-button-create"
                disabled={isSubmitting}
                onClick={(e) => e.stopPropagation()}
              >
                {isSubmitting ? "Saving..." : "Save Match"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default CreateMatchModal;
