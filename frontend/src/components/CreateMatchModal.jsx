"use client"

import { useState } from "react"
import "../styles/Modal.css"
import "../styles/MatchModal.css"

function CreateMatchModal({ onClose, onSave, initialData = null }) {
  const isEditing = !!initialData

  const [formData, setFormData] = useState({
    homeTeam: initialData?.homeTeam || "CIT-U",
    awayTeam: initialData?.awayTeam || "",
    result: initialData?.result || "W",
    score: initialData?.score || "",
    date: initialData?.date || new Date().toISOString().split("T")[0],
    players: initialData?.players || [
      {
        id: 1,
        name: "",
        minutes: "",
        pts2MA: "",
        pts3MA: "",
        ftMA: "",
        steals: "",
        turnovers: "",
        assists: "",
        blocks: "",
        ofRebounds: "",
        dfRebounds: "",
        fouls: "",
      },
    ],
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const handlePlayerChange = (index, field, value) => {
    const updatedPlayers = [...formData.players]
    updatedPlayers[index] = {
      ...updatedPlayers[index],
      [field]: value,
    }
    setFormData({
      ...formData,
      players: updatedPlayers,
    })
  }

  const addPlayer = () => {
    const newId = formData.players.length > 0 ? Math.max(...formData.players.map((p) => p.id)) + 1 : 1

    setFormData({
      ...formData,
      players: [
        ...formData.players,
        {
          id: newId,
          name: "",
          minutes: "",
          pts2MA: "",
          pts3MA: "",
          ftMA: "",
          steals: "",
          turnovers: "",
          assists: "",
          blocks: "",
          ofRebounds: "",
          dfRebounds: "",
          fouls: "",
        },
      ],
    })
  }

  const removePlayer = (index) => {
    const updatedPlayers = [...formData.players]
    updatedPlayers.splice(index, 1)
    setFormData({
      ...formData,
      players: updatedPlayers,
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave(formData)
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container match-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{isEditing ? "Edit Match" : "Create New Match"}</h2>
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
                    id="homeTeam"
                    name="homeTeam"
                    value={formData.homeTeam}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="awayTeam">Away Team</label>
                  <input
                    type="text"
                    id="awayTeam"
                    name="awayTeam"
                    value={formData.awayTeam}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="result">Result</label>
                  <select id="result" name="result" value={formData.result} onChange={handleChange} required>
                    <option value="W">Win</option>
                    <option value="L">Loss</option>
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="score">Score</label>
                  <input
                    type="text"
                    id="score"
                    name="score"
                    value={formData.score}
                    onChange={handleChange}
                    placeholder="e.g. 78-65"
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="date">Date</label>
                  <input type="date" id="date" name="date" value={formData.date} onChange={handleChange} required />
                </div>
              </div>
            </div>

            <div className="match-form-section">
              <div className="section-header">
                <h3>Player Statistics</h3>
                <button type="button" className="add-player-button" onClick={addPlayer}>
                  Add Player
                </button>
              </div>

              <div className="players-table-container">
                <table className="players-table">
                  <thead>
                    <tr>
                      <th>Player Name</th>
                      <th>MIN</th>
                      <th>2 PTS M/A</th>
                      <th>3 PTS M/A</th>
                      <th>FT M/A</th>
                      <th>STL</th>
                      <th>TO</th>
                      <th>AST</th>
                      <th>BLK</th>
                      <th>OREB</th>
                      <th>DREB</th>
                      <th>FOULS</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {formData.players.map((player, index) => (
                      <tr key={player.id}>
                        <td>
                          <input
                            type="text"
                            value={player.name}
                            onChange={(e) => handlePlayerChange(index, "name", e.target.value)}
                            placeholder="Player Name"
                            required
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            value={player.minutes}
                            onChange={(e) => handlePlayerChange(index, "minutes", e.target.value)}
                            placeholder="MIN"
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            value={player.pts2MA}
                            onChange={(e) => handlePlayerChange(index, "pts2MA", e.target.value)}
                            placeholder="M/A"
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            value={player.pts3MA}
                            onChange={(e) => handlePlayerChange(index, "pts3MA", e.target.value)}
                            placeholder="M/A"
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            value={player.ftMA}
                            onChange={(e) => handlePlayerChange(index, "ftMA", e.target.value)}
                            placeholder="M/A"
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            value={player.steals}
                            onChange={(e) => handlePlayerChange(index, "steals", e.target.value)}
                            placeholder="STL"
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            value={player.turnovers}
                            onChange={(e) => handlePlayerChange(index, "turnovers", e.target.value)}
                            placeholder="TO"
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            value={player.assists}
                            onChange={(e) => handlePlayerChange(index, "assists", e.target.value)}
                            placeholder="AST"
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            value={player.blocks}
                            onChange={(e) => handlePlayerChange(index, "blocks", e.target.value)}
                            placeholder="BLK"
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            value={player.ofRebounds}
                            onChange={(e) => handlePlayerChange(index, "ofRebounds", e.target.value)}
                            placeholder="OREB"
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            value={player.dfRebounds}
                            onChange={(e) => handlePlayerChange(index, "dfRebounds", e.target.value)}
                            placeholder="DREB"
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            value={player.fouls}
                            onChange={(e) => handlePlayerChange(index, "fouls", e.target.value)}
                            placeholder="PF/FD"
                          />
                        </td>
                        <td>
                          <button
                            type="button"
                            className="remove-player-button"
                            onClick={() => removePlayer(index)}
                            disabled={formData.players.length <= 1}
                          >
                            Remove
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="modal-actions">
            <button type="submit" className="save-button">
              {isEditing ? "Save Changes" : "Create Match"}
            </button>
            <button type="button" className="cancel-button" onClick={onClose}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CreateMatchModal
