const { spawn } = require("child_process");
const path = require("path");

const getPrediction = (req, res) => {
  const inputData = req.body;

  // Build full path to predict.py
  const scriptPath = path.join(__dirname, "../python/predict.py");

  const python = spawn("python", [scriptPath, JSON.stringify(inputData)]);

  let result = "";
  let errorMsg = "";

  python.stdout.on("data", (data) => {
    result += data.toString();
  });

  python.stderr.on("data", (data) => {
    errorMsg += data.toString();
    console.error("Python stderr:", data.toString());
  });

  python.on("close", (code) => {
    if (code !== 0 || errorMsg) {
      return res.status(500).json({ error: "Python script failed", details: errorMsg });
    }
    try {
      const prediction = JSON.parse(result);
      res.json({ prediction });
    } catch (err) {
      res.status(500).json({ error: "Failed to parse prediction", details: result });
    }
  });
};

module.exports = { getPrediction };
