import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css"; // ✅ new CSS file for transitions

export default function Navbar({ user, setUser }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div className="logo">
        <Link to="/" className="nav-link">🌾 CropApp</Link>
      </div>
      <div className="nav-links">
        {user ? (
          <>
            <Link to="/prediction" className="nav-link">Prediction</Link>
            <Link to="/recommendation" className="nav-link">Recommendation</Link>
            <button onClick={handleLogout} className="logout-btn">Logout</button>
          </>
        ) : (
          <Link to="/login" className="nav-link">Login</Link>
        )}
      </div>
    </nav>
  );
}
