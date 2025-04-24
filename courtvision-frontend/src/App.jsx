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
import AdminDashboard from "./pages/admin/AdminDashboard"
import UserManagement from "./pages/admin/UserManagement"
import UserDetails from "./pages/admin/UserDetails"
import UserEdit from "./pages/admin/UserEdit"
import CreateCoach from "./pages/admin/CreateCoach"
import "./styles/App.css"

// Layout component that conditionally renders the Navbar
function Layout({ children }) {
  const location = useLocation()
  const authRoutes = ["/login", "/register"]
  const adminRoutes = ["/admin", "/admin/users", "/admin/users/new-coach"]

  // Check if the current path starts with any admin route
  const isAdminRoute = adminRoutes.some(
    (route) => location.pathname === route || location.pathname.startsWith(`${route}/`),
  )

  const hideNavbar = authRoutes.includes(location.pathname) || isAdminRoute

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

        {/* Admin Routes */}
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/users" element={<UserManagement />} />
        <Route path="/admin/users/:id" element={<UserDetails />} />
        <Route path="/admin/users/:id/edit" element={<UserEdit />} />
        <Route path="/admin/users/new-coach" element={<CreateCoach />} />
      </Routes>
    </Router>
  )
}

export default App
