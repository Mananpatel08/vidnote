import React from "react";
import { formatBytes, timeAgo } from "../utils";

export const HistorySection = ({
  history,
  setResult,
  setView,
  setActiveTab,
}) => {
  return (
    <>
      <div>
        <div className="section-label">past uploads</div>
        {history.length === 0 ? (
          <div className="history-empty">
            <div style={{ fontSize: 28 }}>○</div>
            <div>no history yet</div>
          </div>
        ) : (
          <div className="history-list">
            {history.map((item, idx) => (
              <div
                key={item.id}
                className="history-item"
                onClick={() => {
                  setResult(item.data);
                  setView("results");
                  setActiveTab("notes");
                }}
              >
                <div className="history-item-left">
                  <div className="history-num">
                    {String(idx + 1).padStart(2, "0")}
                  </div>
                  <div>
                    <div className="history-name">{item.name}</div>
                    <div className="history-time">
                      {timeAgo(item.time)} · {formatBytes(item.size)}
                    </div>
                  </div>
                </div>
                <div className="history-arrow">→</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};
