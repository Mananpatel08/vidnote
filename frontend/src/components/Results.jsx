import React from "react";
import { renderMarkdown } from "../utils";

export const ResultsSection = ({
  activeTab,
  setActiveTab,
  result,
  handleDownload,
  reset,
}) => {
  return (
    <>
      <div className="results">
        <div className="result-header">
          <div className="result-title">
            Your <span>Notes</span>
          </div>
          <div className="badge">✓ complete</div>
        </div>

        <div className="tabs">
          <button
            className={`tab ${activeTab === "notes" ? "active" : ""}`}
            onClick={() => setActiveTab("notes")}
          >
            notes.md
          </button>
          <button
            className={`tab ${activeTab === "transcript" ? "active" : ""}`}
            onClick={() => setActiveTab("transcript")}
          >
            transcript.txt
          </button>
        </div>

        <div className="panel">
          {activeTab === "notes" && (
            <div
              className="notes-content"
              dangerouslySetInnerHTML={{
                __html: renderMarkdown(result.notes),
              }}
            />
          )}
          {activeTab === "transcript" && (
            <div className="transcript-text">{result.text}</div>
          )}
        </div>

        <div className="download-bar">
          <div className="download-info">
            <div className="download-icon">📄</div>
            <div>
              <div style={{ color: "var(--text)", fontWeight: 500 }}>
                notes.pdf
              </div>
              <div>ready to download</div>
            </div>
          </div>
          <button className="download-btn" onClick={handleDownload}>
            ↓ Download PDF
          </button>
        </div>

        <button className="new-btn" onClick={reset}>
          + new upload
        </button>
      </div>
    </>
  );
};
