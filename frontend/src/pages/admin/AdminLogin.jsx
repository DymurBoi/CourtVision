import { useState, useEffect } from "react"
import { useNavigate, useLocation, Link } from "react-router-dom"
import { jwtDecode } from "jwt-decode"
import "../../styles/Login.css"
import basketballCourt from "../../assets/BasketballCourt.jpg"
import { api } from "../../utils/axiosConfig"
import { useAuth } from "../../components/AuthContext"

function AdminLogin() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const navigate = useNavigate()
  const location = useLocation()
  const { login, user } = useAuth()

  useEffect(() => {
    if (user?.role === "admin") {
      navigate("/admin/dashboard", { replace: true })
    }
  }, [user, navigate])

  const handleLogin = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      const response = await api.post("/auth/login/admin", { email, password })

      const { token } = response.data
      const decoded = jwtDecode(token)

      console.log("✅ Admin token decoded:", decoded)
      console.log("Admin ID from token:", decoded.sub)

      const adminId = decoded.sub

      // Store in context and localStorage
      login(token, "admin", adminId)

      localStorage.setItem("authToken", token)
      localStorage.setItem("userRole", "admin")
      localStorage.setItem("userId", adminId)

      const redirectPath = location.state?.from?.pathname || "/admin/dashboard"
      navigate(redirectPath, { replace: true })
    } catch (error) {
      console.error("❌ Admin login failed:", error)
      setError("Invalid email or password. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-image">
        <img src={basketballCourt || "/placeholder.svg"} alt="Basketball Court" />
      </div>

      <div className="auth-form-container">
        <div className="auth-form-wrapper">
          <div className="auth-logo">
            <h1>CourtVision</h1>
          </div>

          <h2 className="auth-title">Admin Login</h2>
          <p className="auth-subtitle">Enter your administrator credentials</p>

          <form className="auth-form" onSubmit={handleLogin}>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="Enter your admin email"
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Enter your password"
              />
            </div>

            {error && <div className="error-message">{error}</div>}

            <button type="submit" className="auth-button" disabled={isLoading}>
              {isLoading ? "Logging in..." : "Admin Login"}
            </button>
          </form>

          <div className="auth-footer">
            <p>
              <Link to="/login">Back to regular login</Link>
            </p>
          </div>
        </div>

        <style jsx>{`
          .error-message {
            color: #e74c3c;
            font-size: 14px;
            margin-top: 10px;
            text-align: center;
          }
        `}</style>
      </div>
    </div>
  )
}

export default AdminLogin
