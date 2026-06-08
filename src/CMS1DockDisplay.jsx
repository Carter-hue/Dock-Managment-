import { useState, useEffect, useRef } from "react";

const API = "http://localhost:3001";
const POLL_MS = 5000;

function pad(n) { return String(n).padStart(2, "0"); }

function formatTimer(s) {
  if (!s || s <= 0) return "";
  return `${pad(Math.floor(s/3600))}:${pad(Math.floor((s%3600)/60))}:${pad(s%60)}`;
}

function rowColor(sec) {
  if (!sec || sec === 0) return "#1A6B1A"; // green
  if (sec < 600)         return "#E1AD01"; // yellow under 10 min
  return                        "#CC0000"; // red 10 min+
}

export default function CMS1DockDisplay() {
  const [data, setData]           = useState({ pendingInQueue:0, todayTotalTruck:0, docks:[] });
  const [connected, setConnected] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const pollRef = useRef(null);

  async function fetchDocks() {
    try {
      const res  = await fetch(`${API}/api/docks`, { cache: "no-store" });
      const json = await res.json();
      setData(json);
      setConnected(true);
      setLastUpdate(new Date());
    } catch {
      setConnected(false);
    }
  }

  useEffect(() => {
    fetchDocks();
    pollRef.current = setInterval(fetchDocks, POLL_MS);
    return () => clearInterval(pollRef.current);
  }, []);

  const s = {
    wrapper: {
      background: "#fff",
      minHeight: "100vh",
      fontFamily: "'Segoe UI','Noto Sans','Trebuchet MS',sans-serif",
      margin: 0, padding: 0,
    },
    headerBar:   { background: "#CC0000", textAlign: "center", padding: "10px 0 2px" },
    headerTitle: { color: "#fff", fontSize: 32, fontWeight: 800, letterSpacing: 4, margin: 0 },
    subheader:   {
      background: "#CC0000",
      display: "flex", justifyContent: "space-between", alignItems: "center",
      padding: "4px 28px 12px", color: "#fff", fontSize: 16, fontWeight: 600,
    },
    table: { width: "100%", borderCollapse: "collapse" },
    th: {
      background: "#2A2A2A", color: "#fff", fontSize: 15, fontWeight: 700,
      padding: "10px 8px", textAlign: "center",
      borderLeft: "5px solid #fff", borderRight: "5px solid #fff",
      borderTop: "none", borderBottom: "none",
    },
    td: (bg) => ({
      padding: "9px 10px", fontSize: 15, fontWeight: 600,
      textAlign: "center", color: "#fff", background: bg,
      borderLeft: "5px solid #fff", borderRight: "5px solid #fff",
      borderTop: "none", borderBottom: "none",
    }),
    dockTd: (bg) => ({
      padding: "9px 10px", fontSize: 18, fontWeight: 800,
      textAlign: "center", color: "#fff", background: bg,
      borderLeft: "5px solid #fff", borderRight: "5px solid #fff",
      borderTop: "none", borderBottom: "none",
    }),
    timerTd: (bg) => ({
      padding: "9px 10px", fontSize: 16, fontWeight: 700,
      textAlign: "center", color: "#fff", background: bg,
      letterSpacing: 1, fontFamily: "'Segoe UI', sans-serif",
      borderLeft: "5px solid #fff", borderRight: "5px solid #fff",
      borderTop: "none", borderBottom: "none",
    }),
    empty: { color: "rgba(255,255,255,0.3)", fontSize: 13 },
    statusBar: {
      background: "#F0F0F0", padding: "6px 28px",
      display: "flex", justifyContent: "space-between", alignItems: "center",
      fontSize: 12, color: "#555",
    },
    dot: (ok) => ({
      display: "inline-block", width: 8, height: 8,
      borderRadius: "50%", background: ok ? "#44FF88" : "#FF4444",
      marginRight: 6, verticalAlign: "middle",
    }),
  };

  return (
    <div style={s.wrapper}>
      <div style={s.headerBar}>
        <h1 style={s.headerTitle}>CMS1</h1>
      </div>
      <div style={s.subheader}>
        <span>Pending in Queue: {data.pendingInQueue}</span>
        <span>Today Total Truck: {data.todayTotalTruck}</span>
      </div>

      <table style={s.table}>
        <thead>
          <tr>
            <th style={{ ...s.th, width:"7%"  }}>Dock</th>
            <th style={{ ...s.th, width:"8%"  }}>Token</th>
            <th style={{ ...s.th, width:"18%" }}>GE No.</th>
            <th style={{ ...s.th, width:"16%" }}>Truck</th>
            <th style={{ ...s.th, width:"37%" }}>Driver</th>
            <th style={{ ...s.th, width:"14%" }}>Timer</th>
          </tr>
        </thead>
        <tbody>
          {data.docks.map((d) => {
            const bg = rowColor(d.timerSeconds);
            return (
              <tr key={d.dock}>
                <td style={s.dockTd(bg)}>{d.dock}</td>
                <td style={s.td(bg)}>{d.token  || <span style={s.empty}>—</span>}</td>
                <td style={s.td(bg)}>{d.geNo   || <span style={s.empty}>—</span>}</td>
                <td style={s.td(bg)}>{d.truck  || <span style={s.empty}>—</span>}</td>
                <td style={s.td(bg)}>{d.driver || <span style={s.empty}>—</span>}</td>
                <td style={s.timerTd(bg)}>{formatTimer(d.timerSeconds)}</td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <div style={s.statusBar}>
        <span><span style={s.dot(connected)} />{connected ? "Live — API connected" : "API unreachable — check server"}</span>
        <span>Last updated: {lastUpdate.toLocaleTimeString()}</span>
        <span>Refreshes every {POLL_MS/1000}s</span>
      </div>
    </div>
  );
}
