"use client"
import React, { useState, useEffect } from 'react';
import "../styles/components/PhysicalRecordModal.css"
import { api } from "../utils/axiosConfig"

const PhysicalRecordModal = ({ request, onClose, onApprove, onReject }) => {
  const [oldRecord, setOldRecord] = useState(null);

  useEffect(() => {
    const fetchOldRecord = async () => {
      try {
        const response = await api.get(`/physical-records/get/by-player/${request.playerId}`);
        setOldRecord(response.data);
      } catch (error) {
        console.error("Error fetching old record:", error);
      }
    };

    fetchOldRecord();
  }, [request.playerId]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  };

  return (
    <div className="modal-overlay">
      <div className="physical-record-modal">
        <div className="modal-header">
          <h2>Physical Record</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>

        <div className="modal-content">
          <div className="player-info">
            <h3>{request.playerName}</h3>
            <span className="request-date">{formatDate(request.dateRequested)}</span>
          </div>

          <div className="records-comparison">
            <div className="record-column">
              <h4>Old Record</h4>
              <div className="record-item">
                <span className="label">Height</span>
                <span className="value">{(oldRecord?.height || oldRecord?.height === 0) ? oldRecord.height : 0} cm</span>
              </div>
              <div className="record-item">
                <span className="label">Weight</span>
                <span className="value">{(oldRecord?.weight || oldRecord?.weight === 0) ? oldRecord.weight : 0} kg</span>
              </div>
              <div className="record-item">
                <span className="label">Wingspan</span>
                <span className="value">{(oldRecord?.wingspan || oldRecord?.wingspan === 0) ? oldRecord.wingspan : 0} cm</span>
              </div>
              <div className="record-item">
                <span className="label">Vertical</span>
                <span className="value">{(oldRecord?.vertical || oldRecord?.vertical === 0) ? oldRecord.vertical : 0} cm</span>
              </div>
            </div>

            <div className="record-column">
              <h4>Updated Record</h4>
              <div className="record-item">
                <span className="label">Height</span>
                <span className="value">{request.height} cm</span>
              </div>
              <div className="record-item">
                <span className="label">Weight</span>
                <span className="value">{request.weight} kg</span>
              </div>
              <div className="record-item">
                <span className="label">Wingspan</span>
                <span className="value">{request.wingspan} cm</span>
              </div>
              <div className="record-item">
                <span className="label">Vertical</span>
                <span className="value">{request.vertical} cm</span>
              </div>
            </div>
          </div>

          <div className="modal-actions">
            <button className="confirm-button" onClick={onApprove}>
              Confirm Update
            </button>
            <button className="reject-button" onClick={onReject}>
              Reject
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PhysicalRecordModal;
