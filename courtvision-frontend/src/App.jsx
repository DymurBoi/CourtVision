import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom"
import Navbar from "./components/Navbar"
import CHome from "./pages/C-Home"
import CTeam from "./pages/C-Team"
import CMatches from "./pages/C-Matches"
import CGameDetails from "./pages/C-GameDetails"
import Requests from "./pages/Requests"
import Profile from "./pages/Profile"
import Login from "./pages/Login"
import PlayerRegistration from "./pages/PlayerRegistration"
import "./styles/App.css"

// Layout component that conditionally renders the Navbar
function Layout({ children }) {
  const location = useLocation()
  const authRoutes = ["/login", "/register"]
  const hideNavbar = authRoutes.includes(location.pathname)

  return (
    <div className="app">
      {!hideNavbar && <Navbar />}
      {children}
    </div>
  )
}

function App() {
  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <Layout>
              <CHome />
            </Layout>
          }
        />
        <Route
          path="/teams"
          element={
            <Layout>
              <CTeam />
            </Layout>
          }
        />
        <Route
          path="/matches"
          element={
            <Layout>
              <CMatches />
            </Layout>
          }
        />
        <Route
          path="/game-details/:id"
          element={
            <Layout>
              <CGameDetails />
            </Layout>
          }
        />
        <Route
          path="/requests"
          element={
            <Layout>
              <Requests />
            </Layout>
          }
        />
        <Route
          path="/profile"
          element={
            <Layout>
              <Profile />
            </Layout>
          }
        />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<PlayerRegistration />} />
      </Routes>
    </Router>
  )
}

export default App

