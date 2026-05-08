"use client";

import React from "react";
import { Signal } from "./SignalCard";

interface MiniPlayerProps {
  currentSignal: Signal;
  currentIndex: number;
  total: number;
  isPlaying: boolean;
  progress: number;
  onTogglePlay: () => void;
  onNext: () => void;
  onPrev: () => void;
}

export const MiniPlayer: React.FC<MiniPlayerProps> = ({
  currentSignal,
  currentIndex,
  total,
  isPlaying,
  progress,
  onTogglePlay,
  onNext,
  onPrev,
}) => {
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  };

  const parseDur = (t: string) => {
    const [m, s] = t.split(":").map(Number);
    return m * 60 + s;
  };

  const duration = parseDur(currentSignal.audio);
  const headlineText = currentSignal.headline
    .map((p) => (typeof p === "string" ? p : p.em))
    .join("")
    .replace(/\s+/g, " ")
    .trim();

  return (
    <div className="mini-player" id="miniPlayer">
      <div className="mini-row">
        <div className="mini-art">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 12c0-4.97 4.03-9 9-9s9 4.03 9 9"/>
            <path d="M3 12v3a3 3 0 0 0 3 3h1v-6H6a3 3 0 0 0-3 3z" fill="currentColor"/>
            <path d="M21 12v3a3 3 0 0 1-3 3h-1v-6h1a3 3 0 0 1 3 3z" fill="currentColor"/>
          </svg>
        </div>
        <div className="mini-meta">
          <div className="mini-label" id="miniQueue">Now Playing · Queue {String(currentIndex + 1).padStart(2, "0")}/{String(total).padStart(2, "0")}</div>
          <div className="mini-title" id="miniTitle">{headlineText}</div>
        </div>
        <div className="mini-controls">
          <button className="mini-btn" title="Previous" onClick={onPrev} disabled={currentIndex === 0}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
              <path d="M6 6h2v12H6zm3.5 6 8.5 6V6z"/>
            </svg>
          </button>
          <button className="mini-btn primary" id="miniPlay" title="Play/Pause" onClick={onTogglePlay}>
            {isPlaying ? (
              <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor"><path d="M6 5h4v14H6zm8 0h4v14h-4z"/></svg>
            ) : (
              <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
            )}
          </button>
          <button className="mini-btn" title="Next" onClick={onNext} disabled={currentIndex === total - 1}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
              <path d="M16 6h2v12h-2zM6 18l8.5-6L6 6z"/>
            </svg>
          </button>
        </div>
      </div>
      <div className="mini-progress">
        <div className="mini-progress-fill" id="miniProgress" style={{ width: `${progress * 100}%` }}></div>
      </div>
      <div className="mini-foot">
        <span id="miniTime">{formatTime(progress * duration)} / {currentSignal.audio}</span>
        <span className="mini-queue">Queue ↑</span>
      </div>
    </div>
  );
};
