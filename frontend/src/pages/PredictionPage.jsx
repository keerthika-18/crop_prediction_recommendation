import React, { useState } from "react";
import axios from "axios";
import "./PredictionPage.css"; // Import CSS file

const PredictionPage = ({ user }) => {
  const [formData, setFormData] = useState({
    N: "",
    P: "",
    K: "",
    Temperature: "",
    Humidity: "",
    Rainfall: "",
    SoilType: "",
    Region: "",
    Season: "",
    CropType: "",
    CropName: "",
    Area: "",
    FertilizerUsed: "",
    IrrigationType: "",
    PesticideUsage: "",
    SeedQuality: "",
    AlertRegion: "", // optional field for sending alerts
  });

  const [prediction, setPrediction] = useState(null);
  const [error, setError] = useState("");
  const [alertMessage, setAlertMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ✅ Predict Yield
  const handleSubmit = async (e) => {
  e.preventDefault();
  setError("");
  setAlertMessage("");
  setPrediction(null);

  try {
    const payload = {
      ...formData,
      N: parseFloat(formData.N),
      P: parseFloat(formData.P),
      K: parseFloat(formData.K),
      Temperature: parseFloat(formData.Temperature),
      Humidity: parseFloat(formData.Humidity),
      Rainfall: parseFloat(formData.Rainfall),
      Area: parseFloat(formData.Area),
      FertilizerUsed: parseFloat(formData.FertilizerUsed),
      PesticideUsage: parseFloat(formData.PesticideUsage),
    };

    const res = await axios.post("http://localhost:5000/api/predict", payload);

    console.log("Prediction response from backend:", res.data);

    if (res.data.prediction === undefined) {
      setError("Prediction failed: backend did not return a predicted_yield");
      setPrediction(null);
    } else {
      setPrediction(Number(res.data.prediction));
    }
  } catch (err) {
    console.error("Prediction error:", err.response?.data || err.message);
    setError("Prediction failed. Please try again.");
  }
};

  const sendAlert = async () => {
  try {
    const res = await axios.post("http://localhost:5000/api/weather-alert", {
       phone : user?.phone.startsWith("+") ? user.phone : "+91" + user.phone,
      location: formData.Region, // get region from form
    });
    setAlertMessage(res.data.alert || "✅ Alert sent successfully!");
  } catch (err) {
    console.error("Alert error:", err.response?.data || err.message);
    setAlertMessage("❌ Failed to send weather alert");
  }
};


  return (
    <div className="prediction-container">
      <div className="form-box">
        <h2 className="title">🌾 Crop Yield Prediction</h2>

        <form onSubmit={handleSubmit} className="prediction-form">
          {/* Numeric Inputs */}
          {[
            "N",
            "P",
            "K",
            "Temperature",
            "Humidity",
            "Rainfall",
            "Area",
            "FertilizerUsed",
            "PesticideUsage",
          ].map((field) => (
            <div key={field} className="form-group">
              <label>{field}</label>
              <input
                type="number"
                step="any"
                name={field}
                value={formData[field]}
                onChange={handleChange}
                required
              />
            </div>
          ))}

          {/* Text Inputs */}
          {[
            "SoilType",
            "Region",
            "Season",
            "CropType",
            "CropName",
            "IrrigationType",
            "SeedQuality",
          ].map((field) => (
            <div key={field} className="form-group">
              <label>{field}</label>
              <input
                type="text"
                name={field}
                value={formData[field]}
                onChange={handleChange}
                required
              />
            </div>
          ))}

          {/* Optional Alert Region */}
          <div className="form-group">
            <label>Alert Region (optional)</label>
            <input
              type="text"
              name="AlertRegion"
              value={formData.AlertRegion}
              onChange={handleChange}
              placeholder="Leave empty to use Region"
            />
          </div>

          {/* Buttons */}
          <div className="button-row">
            <button type="submit" className="submit-btn">
              Predict Yield
            </button>
            <button
              type="button"
              className="alert-btn"
              onClick={sendAlert}
              disabled={!formData.Region && !formData.AlertRegion}
            >
              🚨 Send Alert
            </button>
          </div>
        </form>

        {/* Prediction Result */}
        {prediction !== null && !isNaN(prediction) && (
          <div className="result-box">
            <p>Predicted Yield/ha: {prediction.toFixed(2)}</p>
          </div>
        )}

        {/* Alert Message */}
        {alertMessage && <div className="alert-message">{alertMessage}</div>}

        {/* Error Message */}
        {error && <div className="error-box">{error}</div>}
      </div>
    </div>
  );
};

export default PredictionPage;
