import React, { useCallback, useRef, useState } from "react";
import { Clapperboard, Play } from "lucide-react";
import { formatBytes } from "../utils";

export const UploadSection = ({
  file,
  setFile,
  error,
  setError,
  loading,
  handleSubmit,
}) => {
  const fileRef = useRef();
  const [dragOver, setDragOver] = useState(false);

  const handleFile = (f) => {
    if (!f) return;
    setFile(f);
    setError("");
  };

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setDragOver(false);
    const f = e.dataTransfer.files[0];
    if (f) handleFile(f);
  }, []);

  return (
    <>
      <div>
        <div className="section-label">new upload</div>
        <div
          className={`upload-zone ${dragOver ? "drag-over" : ""}`}
          onClick={() => fileRef.current?.click()}
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
        >
          <div className="upload-icon">
            <Clapperboard />
          </div>
          <div className="upload-title">Drop your lecture video</div>
          <div className="upload-sub">
            drag & drop or <span>click to browse</span> · mp4, mov, avi, mkv
          </div>
          <input
            ref={fileRef}
            type="file"
            accept="video/*"
            style={{ display: "none" }}
            onChange={(e) => handleFile(e.target.files[0])}
          />
        </div>

        {file && (
          <div className="file-selected">
            <div className="file-info">
              <div className="file-icon"><Play size={14} fill="currentColor"/></div>
              <div>
                <div className="file-name">{file.name}</div>
                <div className="file-size">{formatBytes(file.size)}</div>
              </div>
            </div>
            <button className="clear-btn" onClick={() => setFile(null)}>
              remove
            </button>
          </div>
        )}

        {error && <div className="error-box">⚠ {error}</div>}

        {loading && (
          <div className="progress-wrap">
            <div className="progress-label">
              <div className="pulse" />
              processing · transcribing audio and generating notes...
            </div>
            <div className="progress-bar-bg">
              <div className="progress-bar" />
            </div>
          </div>
        )}

        <button
          className="submit-btn"
          onClick={handleSubmit}
          disabled={!file || loading}
        >
          {loading ? "Processing..." : "Generate Notes →"}
        </button>
      </div>
    </>
  );
};
