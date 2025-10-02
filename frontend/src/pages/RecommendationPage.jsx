import React, { useState } from "react";
import axios from "axios";
import "./RecommendationPage.css"; // Import CSS

function RecommendationPage() {
  const [formData, setFormData] = useState({
    N: "",
    P: "",
    K: "",
    Temperature: "",
    Humidity: "",
    Rainfall: "",
    Soil_Type: "",
    Region: "",
    Season: "",
    IrrigationType: ""
  });

  const [recommendedCrop, setRecommendedCrop] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setRecommendedCrop(null);

    try {
      const res = await axios.post("http://localhost:5000/api/recommend", formData);
      setRecommendedCrop(res.data.recommended_crop);
    } catch (err) {
      console.error("Error:", err);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="recommendation-container">
      <div className="recommendation-box">
        <h2 className="title">🌱 Crop Recommendation</h2>

        <form onSubmit={handleSubmit} className="recommendation-form">
          {Object.keys(formData).map((key) => (
            <div key={key} className="form-group">
              <label>{key}</label>
              <input
                type="text"
                name={key}
                value={formData[key]}
                onChange={handleChange}
                required
              />
            </div>
          ))}

          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? "Predicting..." : "Get Recommendation"}
          </button>
        </form>

        {recommendedCrop && (
          <div className="result-box">
            <h3>Recommended Crop: {recommendedCrop}</h3>
          </div>
        )}

        {error && (
          <div className="error-box">
            <p>{error}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default RecommendationPage;
