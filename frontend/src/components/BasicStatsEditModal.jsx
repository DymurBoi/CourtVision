import { useState } from "react";
import "../styles/Modal.css";
import "../styles/MatchModal.css";

function BasicStatsEditModal({ onClose, onSave, initialData }) {
  const [formData, setFormData] = useState({
    minutes: initialData?.minutes || "00:00:00",
    twoPtAttempts: initialData?.twoPtAttempts || 0,
    twoPtMade: initialData?.twoPtMade || 0,
    threePtAttempts: initialData?.threePtAttempts || 0,
    threePtMade: initialData?.threePtMade || 0,
    ftAttempts: initialData?.ftAttempts || 0,
    ftMade: initialData?.ftMade || 0,
    assists: initialData?.assists || 0,
    oFRebounds: initialData?.oFRebounds || 0,
    dFRebounds: initialData?.dFRebounds || 0,
    blocks: initialData?.blocks || 0,
    steals: initialData?.steals || 0,
    turnovers: initialData?.turnovers || 0,
    pFouls: initialData?.pFouls || 0,
    dFouls: initialData?.dFouls || 0,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container match-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Edit Basic Stats</h2>
          <button className="close-button" onClick={onClose}>
            &times;
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-content">
            <div className="players-table-container">
              <table className="players-table">
                <thead>
                  <tr>
                    <th>Player Name</th>
                    <th>MIN</th>
                    <th>2PTA</th>
                    <th>2PTM</th>
                    <th>3PTA</th>
                    <th>3PTM</th>
                    <th>FTA</th>
                    <th>FTM</th>
                    <th>AST</th>
                    <th>OREB</th>
                    <th>DREB</th>
                    <th>BLK</th>
                    <th>STL</th>
                    <th>TO</th>
                    <th>PF</th>
                    <th>DF</th>
                  </tr>
                </thead>
               <tbody>
  <tr>
    <td>{initialData.playerName}</td>
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
        name="twoPtAttempts"
        value={formData.twoPtAttempts}
        onChange={handleChange}
        style={{ width: "60px" }}
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
        name="threePtAttempts"
        value={formData.threePtAttempts}
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
        name="ftAttempts"
        value={formData.ftAttempts}
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
        name="assists"
        value={formData.assists}
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
        name="blocks"
        value={formData.blocks}
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

          <div className="modal-actions">
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

export default BasicStatsEditModal;
