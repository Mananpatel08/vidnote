import React from "react";
import { formatBytes, timeAgo } from "../utils";
import { ArrowRight, History } from "lucide-react";

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
            <History size={22} />
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
                <div className="history-arrow">
                  <ArrowRight size={14} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};
