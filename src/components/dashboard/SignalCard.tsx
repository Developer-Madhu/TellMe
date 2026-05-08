"use client";

import React from "react";

export interface Signal {
  cat: string;
  catColor: string;
  tags: string[];
  read: string;
  time: string;
  headline: (string | { em: string })[];
  deck: string;
  audio: string;
  sources: { name: string; color: string }[];
  saves: number;
  reads: number;
}

interface SignalCardProps {
  signal: Signal;
  currentIndex: number;
  total: number;
  isPlaying: boolean;
  progress: number;
  transitionState: "leaving-up" | "leaving-down" | "entering-up" | "entering-down" | null;
  onTogglePlay: () => void;
  onSeek: (progress: number) => void;
}

export const SignalCard: React.FC<SignalCardProps> = ({
  signal,
  currentIndex,
  total,
  isPlaying,
  progress,
  transitionState,
  onTogglePlay,
  onSeek,
}) => {
  const barsCount = 64;
  const currentBar = Math.floor(progress * barsCount);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  };

  const parseDur = (t: string) => {
    const [m, s] = t.split(":").map(Number);
    return m * 60 + s;
  };

  const duration = parseDur(signal.audio);

  return (
    <article className={`card ${transitionState || ""}`} id="card">
      <div className="card-corner">
        Signal {String(currentIndex + 1).padStart(2, "0")}/{String(total).padStart(2, "0")}
        <span className="signal-bars"><span></span><span></span><span></span><span></span></span>
      </div>
      <div className="card-tags">
        <span className="tag primary">{signal.cat}</span>
        {signal.tags.map((tag, i) => (
          <span key={i} className="tag">{tag}</span>
        ))}
        <span className="tag read-time">{signal.read}</span>
        <span className="tag timestamp">{signal.time}</span>
      </div>

      <h1 className="headline">
        {signal.headline.map((part, i) =>
          typeof part === "string" ? (
            part
          ) : (
            <span key={i} className="em">
              {part.em}
            </span>
          )
        )}
      </h1>

      <p className="deck" dangerouslySetInnerHTML={{ __html: signal.deck }} />

      <div className="audio">
        <button className="play-btn" onClick={onTogglePlay} aria-label="Play summary">
          {isPlaying ? (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M6 5h4v14H6zm8 0h4v14h-4z"/></svg>
          ) : (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
          )}
        </button>

        <div className="audio-mid">
          <div className="audio-status">
            <span className="live"></span>
            {isPlaying ? 'Audio Summary Playing' : 'Audio Summary Active'}
            <span className="speed">1.0×</span>
          </div>
          <div className="wave" id="wave" onClick={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const p = (e.clientX - rect.left) / rect.width;
            onSeek(Math.max(0, Math.min(1, p)));
          }}>
            {Array.from({ length: barsCount }).map((_, i) => {
              const h = 14 + Math.abs(Math.sin(i * 0.7 + currentIndex) * 8) + (i % 5 === 0 ? 4 : 0);
              return (
                <div
                  key={i}
                  className={`wave-bar ${i < currentBar ? "played" : i === currentBar ? "current" : ""}`}
                  style={{ height: `${Math.min(22, h)}px` }}
                ></div>
              );
            })}
          </div>
        </div>

        <div className="audio-time">
          <span className="now">{formatTime(progress * duration)}</span><br />
          {signal.audio}
        </div>
      </div>

      <div className="sources">
        <span className="sources-label">Sources</span>
        {signal.sources.map((src, i) => (
          <button key={i} className="source-chip" style={{ "--src-color": src.color } as React.CSSProperties}>
            <span className="src-dot"></span>{src.name}
          </button>
        ))}
      </div>

      <div className="card-foot">
        <span className="foot-stat">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
          </svg>
          {signal.saves.toLocaleString()}
        </span>
        <span className="foot-stat">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
          </svg>
          {signal.reads.toLocaleString()}
        </span>
        <span className="foot-stat">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M21 11.5a8.4 8.4 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.4 8.4 0 0 1-3.8-.9L3 21l1.9-5.7a8.4 8.4 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.4 8.4 0 0 1 3.8-.9h.5a8.5 8.5 0 0 1 8 8z"/>
          </svg>
          Discuss
        </span>
        <span className="foot-spacer"></span>
        <span className="foot-action">Open Brief →</span>
      </div>
    </article>
  );
};
