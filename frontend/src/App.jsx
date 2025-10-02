import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import PredictionPage from "./pages/PredictionPage";
import RecommendationPage from "./pages/RecommendationPage";
import LoginPage from "./pages/LoginPage";

function App() {
  const [user, setUser] = useState(null);

  // Persist login on page refresh using localStorage
  useEffect(() => {
    const savedUser = localStorage.getItem("token") ? JSON.parse(localStorage.getItem("user")) : null;
    if (savedUser) setUser(savedUser);
  }, []);

  return (
    <Router>
      <Navbar user={user} />
      <Routes>
        <Route
          path="/"
          element={user ? <HomePage user={user} /> : <Navigate to="/login" />}
        />
        <Route
          path="/prediction"
          element={user ? <PredictionPage user={user} /> : <Navigate to="/login" />}
        />
        <Route
          path="/recommendation"
          element={user ? <RecommendationPage user={user} /> : <Navigate to="/login" />}
        />
        <Route
          path="/login"
          element={user ? <Navigate to="/" /> : <LoginPage setUser={setUser} />}
        />
        {/* Redirect any unknown route to home */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
