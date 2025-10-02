const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const recommendationRoutes = require("./routes/recommendationRoutes");
const predictRoute = require("./routes/predictionRoutes");
const weatherRoutes = require("./routes/weatherRoutes");
const authRoutes = require("./routes/authRoutes");
require("dotenv").config(); // MUST be before you access process.env


const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect("mongodb://localhost:27017/cropDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("✅ MongoDB connected"))
.catch((err) => console.error("MongoDB error:", err));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/predict", predictRoute);
app.use("/api/recommend", recommendationRoutes);
app.use("/api/weather-alert", weatherRoutes);

const PORT = 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
