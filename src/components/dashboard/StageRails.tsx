"use client";

import React from "react";

interface StageRailProps {
  currentIndex: number;
  total: number;
  onNavigate: (index: number, dir?: "up" | "down") => void;
}

export const StageRailLeft: React.FC<StageRailProps> = ({
  currentIndex,
  total,
  onNavigate,
}) => {
  return (
    <aside className="rail-l">
      <div className="index-num">
        <span id="idxNow">{String(currentIndex + 1).padStart(2, "0")}</span>
        <span className="total" id="idxTotal">/{String(total).padStart(2, "0")}</span>
      </div>
      <div className="index-meta">Daily Intel</div>
      <div className="dots-col" id="dotsCol">
        {Array.from({ length: total }).map((_, i) => (
          <div
            key={i}
            className={`dot ${i === currentIndex ? "active" : i < currentIndex ? "read" : ""}`}
            title={`Signal ${String(i + 1).padStart(2, "0")}`}
            onClick={() => onNavigate(i)}
          />
        ))}
      </div>
      <div className="key-hint">
        <kbd>↑</kbd><kbd>↓</kbd><br />navigate
      </div>
    </aside>
  );
};

export const StageRailRight: React.FC<StageRailProps & { onTogglePlay: () => void }> = ({
  currentIndex,
  total,
  onNavigate,
}) => {
  return (
    <aside className="rail-r">
      <button
        className={`nav-btn ${currentIndex === 0 ? "disabled" : ""}`}
        id="prevBtn"
        title="Previous (↑)"
        onClick={() => onNavigate(currentIndex - 1, "up")}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M18 15l-6-6-6 6"/>
        </svg>
      </button>
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div className="index-meta" style={{ color: "var(--accent)" }}>Signal</div>
      </div>
      <button
        className={`nav-btn ${currentIndex === total - 1 ? "disabled" : ""}`}
        id="nextBtn"
        title="Next (↓)"
        onClick={() => onNavigate(currentIndex + 1, "down")}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M6 9l6 6 6-6"/>
        </svg>
      </button>
      <div className="key-hint" style={{ marginTop: "14px" }}>
        <kbd>SPACE</kbd><br />play/pause
      </div>
    </aside>
  );
};
