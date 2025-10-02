const express = require("express");
const router = express.Router();
const { sendWeatherAlert } = require("../services/weatherService");

router.post("/", async (req, res) => {
  const { location, phone } = req.body;

  if (!location || !phone) {
    return res.status(400).json({ error: "Location and phone are required" });
  }

  try {
    const result = await sendWeatherAlert(location, phone);
    res.json(result);
  } catch (err) {
    console.error("Weather Alert Route Error:", err);
    res.status(500).json({ error: "Failed to send weather alert" });
  }
});

module.exports = router;
