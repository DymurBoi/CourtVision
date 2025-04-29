import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import CoachOnlyRoute from "./components/CoachOnlyRoute";
import AdminOnlyRoute from "./components/AdminOnlyRoute";
import CoachNavbar from "./components/CoachNavbar";
import AdminNavbar from "./components/AdminNavbar";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import PlayerRegistration from "./pages/PlayerRegistration";
import CGameDetails from "./pages/coach/C-GameDetails";
import CRequests from "./pages/coach/C-Requests";
import CMatches from "./pages/coach/C-Matches";
import CTeam from "./pages/coach/C-Team";
import CHome from "./pages/coach/C-Home";
import CProfile from "./pages/coach/C-Profile";
import AdminDashboard from "./pages/admin/AdminDashboard";
import UserManagement from "./pages/admin/UserManagement";
import UserDetails from "./pages/admin/UserDetails";
import UserEdit from "./pages/admin/UserEdit";
import CreateCoach from "./pages/admin/CreateCoach";
import AdminTeams from "./pages/admin/AdminTeams";
import AdminMatches from "./pages/admin/AdminMatches";
import AdminRequests from "./pages/admin/AdminRequests";
import "./styles/App.css";

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<PlayerRegistration />} />

        {/* Admin Routes */}
        <Route element={<AdminOnlyRoute />}>
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/users" element={<><AdminNavbar /><UserManagement /></>} />
          <Route path="/admin/users/:id" element={<><AdminNavbar /><UserDetails /></>} />
          <Route path="/admin/users/:id/edit" element={<><AdminNavbar /><UserEdit /></>} />
          <Route path="/admin/users/new-coach" element={<><AdminNavbar /><CreateCoach /></>} />
          <Route path="/admin/teams" element={<><AdminNavbar /><AdminTeams /></>} />
          <Route path="/admin/matches" element={<><AdminNavbar /><AdminMatches /></>} />
          <Route path="/admin/requests" element={<><AdminNavbar /><AdminRequests /></>} />
        </Route>

        {/* Coach Routes */}
        <Route element={<CoachOnlyRoute />}>
          <Route path="/coach/game-details/:id" element={<><CoachNavbar /><CGameDetails /></>} />
          <Route path="/coach/requests" element={<><CoachNavbar /><CRequests /></>} />
          <Route path="/coach/matches" element={<><CoachNavbar /><CMatches /></>} />
          <Route path="/coach/team" element={<><CoachNavbar /><CTeam /></>} />
          <Route path="/coach/home" element={<><CoachNavbar /><CHome /></>} />
          <Route path="/coach/profile" element={<><CoachNavbar /><CProfile /></>} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
