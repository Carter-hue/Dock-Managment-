const express = require("express");
const fs = require("fs");
const cors = require("cors");
const path = require("path");

const app = express();
const PORT = 3001;
const DB_FILE = path.join(__dirname, "docks.json");

app.use(cors());
app.use(express.json());

const INITIAL = {
  pendingInQueue: 0,
  todayTotalTruck: 0,
  docks: [
    { dock: "D1", token: "", geNo: "", truck: "", driver: "", timerSeconds: 0 },
    { dock: "D2", token: "", geNo: "", truck: "", driver: "", timerSeconds: 0 },
    { dock: "D3", token: "", geNo: "", truck: "", driver: "", timerSeconds: 0 },
    { dock: "D4", token: "", geNo: "", truck: "", driver: "", timerSeconds: 0 },
    { dock: "D5", token: "", geNo: "", truck: "", driver: "", timerSeconds: 0 },
    { dock: "D6", token: "", geNo: "", truck: "", driver: "", timerSeconds: 0 },
    { dock: "D7", token: "", geNo: "", truck: "", driver: "", timerSeconds: 0 },
    { dock: "D8", token: "", geNo: "", truck: "", driver: "", timerSeconds: 0 },
    { dock: "D9", token: "", geNo: "", truck: "", driver: "", timerSeconds: 0 },
    {
      dock: "D10",
      token: "",
      geNo: "",
      truck: "",
      driver: "",
      timerSeconds: 0,
    },
    {
      dock: "D11",
      token: "",
      geNo: "",
      truck: "",
      driver: "",
      timerSeconds: 0,
    },
    {
      dock: "D12",
      token: "",
      geNo: "",
      truck: "",
      driver: "",
      timerSeconds: 0,
    },
    {
      dock: "D13",
      token: "",
      geNo: "",
      truck: "",
      driver: "",
      timerSeconds: 0,
    },
  ],
};

function readDB() {
  if (!fs.existsSync(DB_FILE)) {
    fs.writeFileSync(DB_FILE, JSON.stringify(INITIAL, null, 2));
  }
  return JSON.parse(fs.readFileSync(DB_FILE, "utf-8"));
}

function writeDB(data) {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
}

// ── ADD THESE 3 LINES ──
const startupDB = readDB();
startupDB.todayTotalTruck = 0;
writeDB(startupDB);

setInterval(() => {
  const db = readDB();
  db.docks.forEach((d) => {
    if (d.timerSeconds > 0) d.timerSeconds += 1;
  });
  writeDB(db);
}, 1000);

app.get("/api/docks", (req, res) => res.json(readDB()));

app.post("/api/docks/assign", (req, res) => {
  const { dock, token, geNo, truck, driver } = req.body;
  const db = readDB();
  const idx = db.docks.findIndex((d) => d.dock === dock);
  if (idx === -1) return res.status(404).json({ error: "Dock not found" });
  db.docks[idx] = { dock, token, geNo, truck, driver, timerSeconds: 1 };
  db.todayTotalTruck += 1;
  writeDB(db);
  res.json({ success: true });
});

app.post("/api/docks/clear", (req, res) => {
  const { dock } = req.body;
  const db = readDB();
  const idx = db.docks.findIndex((d) => d.dock === dock);
  if (idx === -1) return res.status(404).json({ error: "Dock not found" });
  db.docks[idx] = {
    dock,
    token: "",
    geNo: "",
    truck: "",
    driver: "",
    timerSeconds: 0,
  };
  writeDB(db);
  res.json({ success: true });
});

app.listen(PORT, () => {
  console.log(`\n✅ CMS1 API running at http://localhost:${PORT}\n`);
});
