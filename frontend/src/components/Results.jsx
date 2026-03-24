import React, { useState } from "react";
import { renderMarkdown } from "../utils";
import {
  ArrowDownToLine,
  Check,
  CircleCheck,
  Clipboard,
  FileText,
  Plus,
  StickyNote,
} from "lucide-react";

export const ResultsSection = ({
  activeTab,
  setActiveTab,
  result,
  handleDownload,
  reset,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(result.text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };
  return (
    <>
      <div className="results">
        <div className="result-header">
          <div className="result-title">
            Your <span>Notes</span>
          </div>
          <div className="badge">
            <CircleCheck size={14} /> complete
          </div>
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
            <div className="transcript-text">
              <button className="copy-btn" onClick={handleCopy}>
                {copied ? <Check size={14} /> : <Clipboard size={14} />}
                {copied ? "Copied" : "Copy"}
              </button>
              {result.text}
            </div>
          )}
        </div>

        <div className="download-bar">
          <div className="download-info">
            <div className="download-icon">
              <FileText size={16} fill="#fff" />
            </div>
            <div>
              <div style={{ color: "var(--text)", fontWeight: 500 }}>
                notes.pdf
              </div>
              <div>ready to download</div>
            </div>
          </div>
          <button className="download-btn" onClick={handleDownload}>
            <ArrowDownToLine size={16} /> Download PDF
          </button>
        </div>

        <button className="new-btn" onClick={reset}>
          <Plus size={14} /> new upload
        </button>
      </div>
    </>
  );
};
