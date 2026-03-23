import React from "react";

export const Header = ({ view, setView, result }) => {
  return (
    <>
      <header className="header">
        <div className="header-left">
          <div className="logo">
            <span className="logo-dot" />
            VidNote
          </div>
          <div className="tagline">video → transcript → notes → pdf</div>
        </div>
        <nav className="nav">
          <button
            className={`nav-btn ${view === "upload" ? "active" : ""}`}
            onClick={() => setView("upload")}
          >
            upload
          </button>
          <button
            className={`nav-btn ${view === "results" ? "active" : ""}`}
            onClick={() => result && setView("results")}
            style={{ opacity: result ? 1 : 0.4 }}
          >
            results
          </button>
          <button
            className={`nav-btn ${view === "history" ? "active" : ""}`}
            onClick={() => setView("history")}
          >
            history
          </button>
        </nav>
      </header>
    </>
  );
};
