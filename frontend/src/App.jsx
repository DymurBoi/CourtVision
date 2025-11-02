import { BrowserRouter as Router, Route, Routes, useLocation } from "react-router-dom"
import CoachOnlyRoute from "./components/CoachOnlyRoute"
import AdminOnlyRoute from "./components/AdminOnlyRoute"
import PlayerOnlyRoute from "./components/PlayerOnlyRoute"
import CoachNavbar from "./components/CoachNavbar"
import AdminNavbar from "./components/AdminNavbar"
import PlayerNavbar from "./components/PlayerNavbar"
import Landing from "./pages/Landing"
import Login from "./pages/Login"
import PlayerRegistration from "./pages/PlayerRegistration"
import CGameDetails from "./pages/coach/C-GameDetails"
import CRequests from "./pages/coach/C-Requests"
import CMatches from "./pages/coach/C-Matches"
import CHome from "./pages/coach/C-Home"
import CProfile from "./pages/coach/C-Profile"
import PHome from "./pages/player/P-Home"
import PStats from "./pages/player/P-Stats"
import PMatches from "./pages/player/P-Matches"
import PMatchDetails from "./pages/player/P-MatchDetails"
import PProfile from "./pages/player/P-Profile"
import AdminDashboard from "./pages/admin/AdminDashboard"
import UserManagement from "./pages/admin/PlayerManagement"
import PlayerDetails from "./pages/admin/PlayerDetails"
import PlayerEdit from "./pages/admin/PlayerEdit"
import CoachDetails from "./pages/admin/CoachDetails"
import CoachEdit from "./pages/admin/CoachEdit"
import CreateCoach from "./pages/admin/CreateCoach"
import AdminTeams from "./pages/admin/AdminTeams"
import AdminMatches from "./pages/admin/AdminMatches"
import AdminRequests from "./pages/admin/AdminRequests"
import AdminLogin from "./pages/admin/AdminLogin"
import PGameDetails from "./pages/player/P-GameDetails"
import CoachManagement from "./pages/admin/CoachManagement" 
import { AuthProvider } from "./components/AuthContext"
import { useEffect } from "react"
import "./styles/App.css"
import CSeason from "./pages/coach/C-Season";
import CPlayerRanking from "./pages/coach/C-PlayerRanking";
import CLiveRecord from "./pages/coach/C-LiveRecord"
import CSeasonGames from "./pages/coach/C-SeasonGames";
import CSeasonRanking from "./pages/coach/C-SeasonRanking";
import CLivePracticeMatch from "./pages/coach/C-LivePracticeMatch";
import PPlayerRanking from "./pages/player/P-PlayerRanking"

// Create a wrapper component that forces re-render on location change
function AppRoutes() {
  const location = useLocation();
  
  // Force re-render on location change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<PlayerRegistration />} />
      <Route path="/admin/login" element={<AdminLogin />} />
      {/* Demo route to view Live Record page without auth */}
      

      {/* Admin Routes */}
      <Route element={<AdminOnlyRoute key="admin" />}>
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route
          path="/admin/users"
          element={
            <>
              <AdminNavbar />
              <UserManagement />
            </>
          }
        />
        <Route
          path="/admin/coaches"
          element={
            <>
              <AdminNavbar />
              <CoachManagement />
            </>
          }
        />
        <Route
          path="/admin/users/:id"
          element={
            <>
              <AdminNavbar />
              <PlayerDetails />
            </>
          }
        />
        <Route
          path="/admin/users/:id/edit"
          element={
            <>
              <AdminNavbar />
              <PlayerEdit />
            </>
          }
        />
           <Route
          path="/admin/coach/:id"
          element={
            <>
              <AdminNavbar />
              <CoachDetails />
            </>
          }
        />
        <Route
          path="/admin/Coach/:id/edit"
          element={
            <>
              <AdminNavbar />
              <CoachEdit />
            </>
          }
        />
        <Route
          path="/admin/users/new-coach"
          element={
            <>
              <AdminNavbar />
              <CreateCoach />
            </>
          }
        />
        <Route
          path="/admin/teams"
          element={
            <>
              <AdminNavbar />
              <AdminTeams />
            </>
          }
        />
        <Route
          path="/admin/matches"
          element={
            <>
              <AdminNavbar />
              <AdminMatches />
            </>
          }
        />
        <Route
          path="/admin/requests"
          element={
            <>
              <AdminNavbar />
              <AdminRequests />
            </>
          }
        />
      </Route>

      {/* Coach Routes */}
      <Route element={<CoachOnlyRoute key="coach" />}>
      <Route path="/coach/live-record/:id" element={<CLiveRecord />} />
        <Route
          path="/coach/game-details/:id"
          element={
            <>
              <CoachNavbar />
              <CGameDetails />
            </>
          }
        />
        <Route path="/coach/practice-live-record/:id" element={<CLivePracticeMatch />} />
        <Route
          path="/coach/game-details/:id"
          element={
            <>
              <CoachNavbar />
              <CGameDetails />
            </>
          }
        />
        <Route
          path="/coach/requests"
          element={
            <>
              <CoachNavbar />
              <CRequests />
            </>
          }
        />
        <Route
          path="/coach/matches"
          element={
            <>
              <CoachNavbar />
              <CMatches />
            </>
          }
        />
        <Route
          path="/coach/team"
          element={
            <>
              <CoachNavbar />
              <CHome />
            </>
          }
        />
        <Route
          path="/coach/home"
          element={
            <>
              <CoachNavbar />
              <CHome />
            </>
          }
        />
        <Route
          path="/coach/season"
          element={
            <>
              <CoachNavbar />
              <CSeason />
            </>
          }
        />
        <Route
          path="/coach/season/:id/games"
          element={
            <>
              <CoachNavbar />
              <CSeasonGames />
            </>
          }
        />
        <Route
          path="/coach/season/:id/ranking"
          element={
            <>
              <CoachNavbar />
              <CSeasonRanking />
            </>
          }
        />
        <Route
          path="/coach/ranking"
          element={
            <>
              <CoachNavbar />
              <CPlayerRanking />
            </>
          }
        />
        <Route
          path="/coach/profile"
          element={
            <>
              <CoachNavbar />
              <CProfile />
            </>
          }
        />
      </Route>

      {/* Player Routes */}
      <Route element={<PlayerOnlyRoute key="player" />}>
        <Route
          path="/player/home"
          element={
            <>
              <PlayerNavbar />
              <PHome />
            </>
          }
        />
        <Route
          path="/player/player-ranking"
          element={
            <>
              <PlayerNavbar />
              <PPlayerRanking />
            </>
          }
        />
        <Route
          path="/player/stats"
          element={
            <>
              <PlayerNavbar />
              <PStats />
            </>
          }
        />
        <Route
          path="/player/matches"
          element={
            <>
              <PlayerNavbar />
              <PMatches />
            </>
          }
        />
        <Route
          path="/player/game-details/:id"
          element={
            <>
              <PlayerNavbar />
              <PMatchDetails />
            </>
          }
        />
        <Route
          path="/player/profile"
          element={
            <>
              <PlayerNavbar />
              <PProfile />
            </>
          }
        />
      </Route>
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  )
}

export default App
