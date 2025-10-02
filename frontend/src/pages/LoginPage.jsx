import React, { useState } from "react";
import axios from "axios";
import "./LoginPage.css"; // Import separate CSS

export default function LoginPage({ setUser }) {
  const [formData, setFormData] = useState({ name: "", phone: "", email: "", password: "" });
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const url = isLogin
        ? "http://localhost:5000/api/auth/login"
        : "http://localhost:5000/api/auth/register";

      const res = await axios.post(url, formData);

      if (isLogin) {
        // Store token
        localStorage.setItem("token", res.data.token);
        // Set user in parent component
        if (typeof setUser === "function") {
          setUser(res.data.user);
        }
      } else {
        alert("✅ Registered successfully! Please login.");
        setIsLogin(true);
        setFormData({ name: "", phone: "", email: "", password: "" });
      }
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error || "❌ Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h1 className="login-title">{isLogin ? "Login" : "Register"}</h1>

        <form onSubmit={handleSubmit} className="login-form">
          {!isLogin && (
            <>
              <input
                type="text"
                name="name"
                placeholder="Name"
                value={formData.name}
                onChange={handleChange}
                required
              />
              <input
                type="text"
                name="phone"
                placeholder="Phone"
                value={formData.phone}
                onChange={handleChange}
                required
              />
            </>
          )}

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />

          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? (isLogin ? "Logging in..." : "Registering...") : isLogin ? "Login" : "Register"}
          </button>
        </form>

        <p className="toggle-text" onClick={() => setIsLogin(!isLogin)}>
          {isLogin ? "New user? Register" : "Already have an account? Login"}
        </p>
      </div>
    </div>
  );
}
