const express = require("express");
const { recommendCrop } = require("../controllers/recommendationController");

const router = express.Router();

// POST /api/recommend
router.post("/", recommendCrop);

module.exports = router;
