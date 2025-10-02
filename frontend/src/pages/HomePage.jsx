import React from "react";
import "./HomePage.css";
import background from "../images/crop_background_image.jpg";

function HomePage({ user }) {
  return (
    <div
      className="home"
      style={{ backgroundImage: `url(${background})` }}
    >
      <div className="overlay"></div> {/* ✅ dark overlay */}
      <div className="hero">
        <h1 className="fade-in">🌱 Welcome to Crop Prediction System</h1>
        <p className="welcome fade-in-delay">
          Hello {user?.name || "Farmer"} 👋
        </p>
        <p className="quote fade-in-delay-2">
          Select a feature from the navigation menu to start your journey.
        </p>
      </div>
    </div>
  );
}

export default HomePage;
