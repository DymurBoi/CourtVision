import { useState } from "react";
import "../styles/CreateBasicStats.css";

function CreateBasicStatsModal({ onClose, onSave, playersList }) {
  const [formData, setFormData] = useState({
    selectedPlayer: 0, // new field for the player
    minutes: "00:00:00",
    twoPtAttempts: 0,
    twoPtMade: 0,
    threePtAttempts: 0,
    threePtMade: 0,
    ftAttempts: 0,
    ftMade: 0,
    assists: 0,
    oFRebounds: 0,
    dFRebounds: 0,
    blocks: 0,
    steals: 0,
    turnovers: 0,
    pFouls: 0,
    dFouls: 0,
    plusMinus: 0,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const handlePlayerSelect = (e) => {
  setFormData({
    ...formData,
    selectedPlayer: e.target.value,
  });
};

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container stat-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Add Basic Stats</h2>
          <button className="close-button" onClick={onClose}>
            &times;
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-content">
            <div className="modal-field">
              <div className="form-row">
              <div className="form-group">
              <label htmlFor="playerSelect">Player:</label>
                <select
                name="selectedPlayer"
                id="playerSelect"
                value={formData.selectedPlayer}
                onChange={handlePlayerSelect}
                required
                >
                <option value="">Select a player</option>
                {playersList.map((player) => (
                    <option key={player.playerId} value={player.playerId}>
                    {player.fname} {player.lname} {/* Display first and last name */}
                    </option>
                ))}
                </select>
                </div>
                </div>
            </div>
            <div className="players-table-container">
              <table className="players-table">
                <tbody>
                  <tr>
                    <th>MIN</th>
                    <th>2PTM</th>
                    <th>2PTA</th>
                    <th>3PTM</th>
                    <th>3PTA</th>
                    <th>FTM</th>
                    <th>FTA</th>
                    <th>STL</th>
                    <th>TO</th>
                    <th>AST</th>
                    <th>BLK</th>
                    <th>OREB</th>
                    <th>DREB</th>
                    <th>PF</th>
                    <th>DF</th>
                  </tr>
                
                
                  <tr>
                    <td>
                      <input
                        type="text"
                        name="minutes"
                        value={formData.minutes}
                        onChange={handleChange}
                        style={{ width: "80px" }}
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        name="twoPtMade"
                        value={formData.twoPtMade}
                        onChange={handleChange}
                        style={{ width: "60px" }}
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        name="twoPtAttempts"
                        value={formData.twoPtAttempts}
                        onChange={handleChange}
                        style={{ width: "60px" }}
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        name="threePtMade"
                        value={formData.threePtMade}
                        onChange={handleChange}
                        style={{ width: "60px" }}
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        name="threePtAttempts"
                        value={formData.threePtAttempts}
                        onChange={handleChange}
                        style={{ width: "60px" }}
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        name="ftMade"
                        value={formData.ftMade}
                        onChange={handleChange}
                        style={{ width: "60px" }}
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        name="ftAttempts"
                        value={formData.ftAttempts}
                        onChange={handleChange}
                        style={{ width: "60px" }}
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        name="steals"
                        value={formData.steals}
                        onChange={handleChange}
                        style={{ width: "60px" }}
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        name="turnovers"
                        value={formData.turnovers}
                        onChange={handleChange}
                        style={{ width: "60px" }}
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        name="assists"
                        value={formData.assists}
                        onChange={handleChange}
                        style={{ width: "60px" }}
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        name="blocks"
                        value={formData.blocks}
                        onChange={handleChange}
                        style={{ width: "60px" }}
                      />
                    </td>
                    
                    <td>
                      <input
                        type="number"
                        name="oFRebounds"
                        value={formData.oFRebounds}
                        onChange={handleChange}
                        style={{ width: "60px" }}
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        name="dFRebounds"
                        value={formData.dFRebounds}
                        onChange={handleChange}
                        style={{ width: "60px" }}
                      />
                    </td>
                    
                    <td>
                      <input
                        type="number"
                        name="pFouls"
                        value={formData.pFouls}
                        onChange={handleChange}
                        style={{ width: "60px" }}
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        name="dFouls"
                        value={formData.dFouls}
                        onChange={handleChange}
                        style={{ width: "60px" }}
                      />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div style={{ display: "flex", justifyContent: "center", gap: "1rem", marginTop: "1rem" }}>
            <button type="submit" className="save-button">
              Save Changes
            </button>
            <button type="button" className="cancel-button" onClick={onClose}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateBasicStatsModal;
