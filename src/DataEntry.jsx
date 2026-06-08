import { useState } from "react";

// ── Auto generate unique GE number ──
function generateGENumber() {
  const num = Math.floor(1000000000 + Math.random() * 9000000000);
  return `I${num}`;
}

const DOCK_NUMBERS = [
  "D1",
  "D2",
  "D3",
  "D4",
  "D5",
  "D6",
  "D7",
  "D8",
  "D9",
  "D10",
  "D11",
  "D12",
  "D13",
];
const API = "http://localhost:3001";
const EMPTY = { dock: "D1", token: "", truck: "", driver: "" };

export default function DataEntry() {
  const [form, setForm] = useState(EMPTY);
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value.toUpperCase() });
  }

  // ── ASSIGN — GE number auto generated here ──
  async function handleAssign() {
    if (!form.truck && !form.driver) {
      setStatus("error");
      setTimeout(() => setStatus(null), 2500);
      return;
    }
    setLoading(true);
    try {
      await fetch(`${API}/api/docks/assign`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          dock: form.dock,
          token: form.token,
          truck: form.truck,
          driver: form.driver,
          geNo: generateGENumber(), // ← auto generated ✅
        }),
      });
      setStatus("saved");
      setForm({ ...EMPTY, dock: form.dock });
    } catch {
      setStatus("error");
    }
    setLoading(false);
    setTimeout(() => setStatus(null), 2500);
  }

  // ── CLEAR — just send dock name ──
  async function handleClear() {
    setLoading(true);
    try {
      await fetch(`${API}/api/docks/clear`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ dock: form.dock }), // ← only dock name ✅
      });
      setStatus("cleared");
      setForm(EMPTY);
    } catch {
      setStatus("error");
    }
    setLoading(false);
    setTimeout(() => setStatus(null), 2500);
  }

  // ── RESET truck count ──
  async function handleReset() {
    await fetch(`${API}/api/reset/truckcount`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    });
  }

  const s = {
    page: {
      background: "#c9c8c8",
      minHeight: "100vh",
      fontFamily: "'Segoe UI', sans-serif",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      padding: "30px 16px",
    },
    header: {
      background: "#CC0000",
      width: "100%",
      maxWidth: 480,
      borderRadius: 6,
      textAlign: "center",
      padding: "14px 0 8px",
      marginBottom: 24,
    },
    headerTitle: {
      color: "#fff",
      fontSize: 24,
      fontWeight: 800,
      letterSpacing: 3,
      margin: 0,
    },
    headerSub: { color: "rgba(255,255,255,0.75)", fontSize: 12, marginTop: 3 },
    card: {
      background: "#2a2a2a",
      borderRadius: 8,
      padding: "24px 28px",
      width: "100%",
      maxWidth: 480,
    },
    label: {
      display: "block",
      color: "rgba(255,255,255,0.5)",
      fontSize: 11,
      fontWeight: 700,
      letterSpacing: 1,
      textTransform: "uppercase",
      marginBottom: 6,
    },
    select: {
      width: "100%",
      background: "#3a3a3a",
      border: "1px solid #555",
      borderRadius: 4,
      color: "#fff",
      fontSize: 17,
      fontWeight: 700,
      padding: "10px 12px",
      marginBottom: 20,
      outline: "none",
      boxSizing: "border-box",
    },
    input: {
      width: "100%",
      background: "#3a3a3a",
      border: "1px solid #555",
      borderRadius: 4,
      color: "#fff",
      fontSize: 15,
      fontWeight: 600,
      padding: "10px 12px",
      marginBottom: 18,
      outline: "none",
      boxSizing: "border-box",
    },
    divider: {
      border: "none",
      borderTop: "1px solid #444",
      margin: "4px 0 20px",
    },
    row: { display: "flex", gap: 10, marginTop: 4 },
    btnAssign: {
      flex: 1,
      background: "#CC0000",
      color: "#fff",
      border: "none",
      borderRadius: 4,
      padding: "13px 0",
      fontSize: 14,
      fontWeight: 700,
      cursor: loading ? "not-allowed" : "pointer",
      letterSpacing: 1,
      opacity: loading ? 0.7 : 1,
    },
    btnClear: {
      flex: 1,
      background: "#3a3a3a",
      color: "rgba(255,255,255,0.7)",
      border: "1px solid #555",
      borderRadius: 4,
      padding: "13px 0",
      fontSize: 14,
      fontWeight: 700,
      cursor: loading ? "not-allowed" : "pointer",
      letterSpacing: 1,
    },
    btnReset: {
      width: "100%",
      background: "#1a1a1a",
      color: "rgba(255,255,255,0.4)",
      border: "1px solid #444",
      borderRadius: 4,
      padding: "10px 0",
      fontSize: 12,
      fontWeight: 700,
      cursor: "pointer",
      letterSpacing: 1,
      marginTop: 10,
    },
    badge: (type) => ({
      borderRadius: 4,
      textAlign: "center",
      padding: "9px 0",
      fontSize: 13,
      fontWeight: 700,
      marginTop: 12,
      letterSpacing: 1,
      background:
        type === "saved"
          ? "#1A6B1A"
          : type === "cleared"
            ? "#E1AD01"
            : "#880000",
      color: "#fff",
    }),
  };

  return (
    <div style={s.page}>
      <div style={s.header}>
        <h1 style={s.headerTitle}>CMS1</h1>
        <div style={s.headerSub}>Data Entry — Server Room</div>
      </div>

      <div style={s.card}>
        <label style={s.label}>Select Dock</label>
        <select
          name="dock"
          value={form.dock}
          onChange={handleChange}
          style={s.select}
        >
          {DOCK_NUMBERS.map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </select>

        <hr style={s.divider} />

        <label style={s.label}>Token</label>
        <input
          style={s.input}
          name="token"
          value={form.token}
          onChange={handleChange}
          placeholder="e.g. 207A"
          autoComplete="off"
        />

        <label style={s.label}>Truck Number</label>
        <input
          style={s.input}
          name="truck"
          value={form.truck}
          onChange={handleChange}
          placeholder="e.g. MP13GA7147"
          autoComplete="off"
        />

        <label style={s.label}>Driver Name / Number</label>
        <input
          style={s.input}
          name="driver"
          value={form.driver}
          onChange={handleChange}
          placeholder="e.g. RAJKUMAR/9713211965"
          autoComplete="off"
        />

        <div style={s.row}>
          <button style={s.btnAssign} onClick={handleAssign} disabled={loading}>
            {loading ? "SAVING..." : "✓  ASSIGN DOCK"}
          </button>
          <button style={s.btnClear} onClick={handleClear} disabled={loading}>
            {loading ? "..." : "✕  CLEAR DOCK"}
          </button>
        </div>

        <button style={s.btnReset} onClick={handleReset}>
          ↺ RESET TODAY'S TRUCK COUNT TO ZERO
        </button>

        {status === "saved" && (
          <div style={s.badge("saved")}>✓ DOCK ASSIGNED — SHOWING ON TV</div>
        )}
        {status === "cleared" && (
          <div style={s.badge("cleared")}>✓ DOCK CLEARED SUCCESSFULLY</div>
        )}
        {status === "error" && (
          <div style={s.badge("error")}>✕ ERROR — CHECK TRUCK OR SERVER</div>
        )}
      </div>
    </div>
  );
}
