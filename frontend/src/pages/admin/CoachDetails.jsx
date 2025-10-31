"use client";

import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import AdminNavbar from "../../components/AdminNavbar";
import { api } from "../../utils/axiosConfig";
import "../../styles/admin/UserDetails.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function CoachDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [coach, setCoach] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCoach = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/coaches/get/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        });
        setCoach(res.data);
      } catch (error) {
        console.error("Failed to fetch coach:", error);
        const errMsg =
          error?.response?.data?.message ||
          error?.response?.data ||
          "Failed to load coach details.";
        toast.error(errMsg, { autoClose: 2500 });
      } finally {
        setLoading(false);
      }
    };

    fetchCoach();
  }, [id]);

  const handleDeleteCoach = async () => {
    if (window.confirm("Are you sure you want to delete this coach?")) {
      try {
        await api.delete(`/coaches/delete/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        });
        toast.success("Coach deleted successfully!", { autoClose: 2500 });
        setTimeout(() => navigate("/admin/users"), 2000); // slight delay for user feedback
      } catch (error) {
        console.error("Failed to delete coach:", error);
        const errMsg =
          error?.response?.data?.message ||
          error?.response?.data ||
          "Could not delete coach.";
        toast.error(errMsg, { autoClose: 2500 });
      }
    }
  };

  if (loading) {
    return <div className="loading">Loading coach details...</div>;
  }

  if (!coach) {
    return (
      <>
        <ToastContainer position="top-center" theme="colored" />
        <div className="not-found">
          Coach not found. <Link to="/admin/users">Back to User Management</Link>
        </div>
      </>
    );
  }

  return (
    <div className="admin-layout">
      <ToastContainer position="top-center" theme="colored" />

      <main className="admin-content">
        <div className="user-details-header">
          <div>
            <h1>
              {coach.fname} {coach.lname}
            </h1>
            <span className="user-type coach">coach</span>
            <span className="user-status active">active</span>
          </div>
          <div className="user-actions">
            <Link
              to={`/admin/users/${coach.coachId}/edit`}
              className="edit-user-button"
            >
              Edit Coach
            </Link>
            <button className="delete-user-button" onClick={handleDeleteCoach}>
              Delete Coach
            </button>
          </div>
        </div>

        <div className="user-details-content">
          <div className="user-details-card">
            <h2>Basic Information</h2>
            <div className="details-grid">
              <div className="detail-item">
                <span className="detail-label">Full Name</span>
                <span className="detail-value">
                  {coach.fname} {coach.lname}
                </span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Email</span>
                <span className="detail-value">{coach.email}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Birth Date</span>
                <span className="detail-value">{coach.birthDate}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Team(s)</span>
                <span className="detail-value">
                  {coach.teams?.map((t) => t.teamName).join(", ") ||
                    "Unassigned"}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="back-navigation">
          <Link to="/admin/coaches" className="back-link">
            Back to User Management
          </Link>
        </div>
      </main>
    </div>
  );
}

export default CoachDetails;
