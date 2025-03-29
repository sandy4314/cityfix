import React, { useState, useEffect } from "react";
import { Routes, Route, Link, useNavigate, useLocation } from "react-router-dom";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Dashboard from "./components/Dashboard";
import CreateComplaint from "./components/CreateComplaint";
import AdminDashboard from "./components/AdminDashboard";
import LandingPage from "./components/LandingPage"; // Import LandingPage
import "./App.css";

const App = () => {
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [role, setRole] = useState(localStorage.getItem("role") || "");
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    setToken(localStorage.getItem("token") || "");
    setRole(localStorage.getItem("role") || "");
  }, [token]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    setToken("");
    setRole("");
    navigate("/"); // Redirect to landing page after logout
  };

  // Check current route
  const isLandingPage = location.pathname === "/";
  const isLoginPage = location.pathname === "/login";
  const isSignupPage = location.pathname === "/signup";

  return (
    <div className="app-container">
      <nav className="navbar">
        {/* Only show Login/Signup links if not logged in and not on landing, login, or signup pages */}
        {!token && !isLandingPage && !isLoginPage && !isSignupPage && (
          <Link to="/login" className="nav-link">Login</Link>
        )}
        {!token && !isLandingPage && !isLoginPage && !isSignupPage && (
          <Link to="/signup" className="nav-link">Signup</Link>
        )}

        {token && role === "user" && (
          <Link to="/dashboard" className="nav-link">Dashboard</Link>
        )}
        {token && role === "user" && (
          <Link to="/create-complaint" className="nav-link">Create Complaint</Link>
        )}
        {token && role === "admin" && (
          <Link to="/admin-dashboard" className="nav-link">Admin Dashboard</Link>
        )}

        {token && (
          <button onClick={handleLogout} className="logout-btn">Logout</button>
        )}
      </nav>

      <Routes>
        <Route path="/" element={<LandingPage />} /> {/* Landing page as default */}
        <Route path="/login" element={<Login setToken={setToken} />} />
        <Route path="/signup" element={<Signup setToken={setToken} />} />
        <Route
          path="/dashboard"
          element={role === "user" ? <Dashboard token={token} /> : <Login setToken={setToken} />}
        />
        <Route
          path="/create-complaint"
          element={role === "user" ? <CreateComplaint token={token} /> : <Login setToken={setToken} />}
        />
        <Route
          path="/admin-dashboard"
          element={role === "admin" ? <AdminDashboard token={token} /> : <Login setToken={setToken} />}
        />
      </Routes>
    </div>
  );
};

export default App;