const express = require("express");
const { getPrediction } = require("../controllers/predictionController");

const router = express.Router();

router.post("/", getPrediction); // POST /api/predict/

module.exports = router;
