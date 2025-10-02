const { spawn } = require("child_process");
const path = require("path");

const recommendCrop = (req, res) => {
  const pythonPath = "python"; // or "python3" depending on your setup
  const scriptPath = path.join(__dirname, "..", "python", "recommend_tabnet.py");

  let dataString = "";

  const pyProcess = spawn(pythonPath, [scriptPath]);

  pyProcess.stdout.on("data", (data) => {
    dataString += data.toString();
  });

  pyProcess.stderr.on("data", (data) => {
    console.error("Python error:", data.toString());
  });

  pyProcess.on("close", () => {
    try {
      const result = JSON.parse(dataString);
      res.json(result);
    } catch (err) {
      console.error("JSON parse error:", err);
      res.status(500).json({ error: "Recommendation failed" });
    }
  });

  pyProcess.stdin.write(JSON.stringify(req.body));
  pyProcess.stdin.end();
};

module.exports = { recommendCrop };
