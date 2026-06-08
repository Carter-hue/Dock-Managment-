import { useState } from "react";
import CMS1DockDisplay from "./CMS1DockDisplay";
import DataEntry from "./DataEntry";

export default function App() {
  const [page, setPage] = useState("display");

  const btnStyle = {
    position: "fixed", bottom: 20, right: 20, zIndex: 999,
    background: "#CC0000", color: "#fff", border: "none",
    borderRadius: 6, padding: "12px 20px", fontSize: 13,
    fontWeight: 700, cursor: "pointer", letterSpacing: 1,
    boxShadow: "0 4px 12px rgba(0,0,0,0.4)",
  };

  return (
    <>
      {page === "display" ? <CMS1DockDisplay /> : <DataEntry />}
      <button style={btnStyle} onClick={() => setPage(page === "display" ? "entry" : "display")}>
        {page === "display" ? "➕  DATA ENTRY" : "📺  VIEW DISPLAY"}
      </button>
    </>
  );
}
