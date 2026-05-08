"use client";

import React, { useState } from "react";
import { Search, Bookmark, Settings } from "lucide-react";

const CATEGORIES = [
  { id: "all", name: "All Signals", count: 42, color: "oklch(0.55 0.18 295)" },
  { id: "ai", name: "AI", count: 12, color: "oklch(0.62 0.16 30)" },
  { id: "startups", name: "Startups", count: 8, color: "oklch(0.68 0.14 145)" },
  { id: "politics", name: "Politics", count: 6, color: "oklch(0.60 0.16 25)" },
  { id: "markets", name: "Markets", count: 5, color: "oklch(0.65 0.14 80)" },
  { id: "science", name: "Science", count: 4, color: "oklch(0.60 0.14 220)" },
  { id: "climate", name: "Climate", count: 3, color: "oklch(0.62 0.14 175)" },
  { id: "culture", name: "Culture", count: 4, color: "oklch(0.62 0.14 340)" },
];

export const Header: React.FC = () => {
  const [activeCat, setActiveCat] = useState("all");

  return (
    <header className="header" data-screen-label="header">
      <div className="header-row">
        <div className="logo">
          <div className="logo-mark"></div>
          <div>
            <div className="logo-text">High<span className="dot">·</span>Signal</div>
            <div className="logo-sub">Daily Intel · 07 May</div>
          </div>
        </div>

        <div className="divider-v"></div>

        <nav className="cats" id="cats">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCat(cat.id)}
              className={`cat ${activeCat === cat.id ? "active" : ""}`}
              data-cat={cat.id}
            >
              <span className="cat-icon" style={{ "--c": cat.color } as React.CSSProperties}></span>
              {cat.name} <span className="count">{cat.count}</span>
            </button>
          ))}
        </nav>

        <div className="header-tools">
          <span className="pulse-pill"><span className="pulse-dot"></span>Live</span>
          <div className="search-pill">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              <circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>
            </svg>
            Search signals…
            <kbd>⌘K</kbd>
          </div>
          <button className="icon-btn" title="Bookmarks">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
              <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
            </svg>
          </button>
          <button className="icon-btn" title="Settings">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
              <circle cx="12" cy="12" r="3"/>
              <path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 0 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 0 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 0 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 0 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/>
            </svg>
          </button>
          <button className="icon-btn" title="Profile" style={{ background: "linear-gradient(135deg, oklch(0.70 0.14 295), oklch(0.50 0.18 295))", color: "white", fontWeight: 700, fontSize: "11px" }}>JS</button>
        </div>
      </div>
    </header>
  );
};
