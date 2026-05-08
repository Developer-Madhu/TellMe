"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { Header } from "@/components/dashboard/Header";
import { StageRailLeft, StageRailRight } from "@/components/dashboard/StageRails";
import { SignalCard, Signal } from "@/components/dashboard/SignalCard";
import { MiniPlayer } from "@/components/dashboard/MiniPlayer";

interface SignalFeedProps {
  initialSignals: Signal[];
}

type TransitionState = "leaving-up" | "leaving-down" | "entering-up" | "entering-down" | null;

export const SignalFeed: React.FC<SignalFeedProps> = ({ initialSignals }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [transition, setTransition] = useState<TransitionState>(null);
  const wheelLock = useRef(false);

  const signals = initialSignals;

  const parseDur = (t: string) => {
    if (!t) return 60;
    if (t.includes(":")) {
      const [m, s] = t.split(":").map(Number);
      return m * 60 + s;
    }
    return 60; // fallback
  };

  const handleNavigate = useCallback((newIndex: number, dir?: "up" | "down") => {
    if (newIndex < 0 || newIndex >= signals.length || newIndex === currentIndex || transition) return;

    const direction = dir || (newIndex > currentIndex ? "down" : "up");
    setTransition(direction === "down" ? "leaving-up" : "leaving-down");

    setTimeout(() => {
      setCurrentIndex(newIndex);
      setProgress(0);
      setTransition(direction === "down" ? "entering-up" : "entering-down");
      
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setTransition(null);
        });
      });
    }, 220);
  }, [currentIndex, transition, signals.length]);

  const togglePlay = useCallback(() => {
    setIsPlaying(prev => !prev);
  }, []);

  useEffect(() => {
    if (!isPlaying || signals.length === 0) return;

    const interval = setInterval(() => {
      setProgress(prev => {
        const dur = parseDur(signals[currentIndex].audio);
        const next = prev + 1 / dur;
        if (next >= 1) {
          if (currentIndex < signals.length - 1) {
            handleNavigate(currentIndex + 1, "down");
          } else {
            setIsPlaying(false);
          }
          return 0;
        }
        return next;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isPlaying, currentIndex, handleNavigate, signals]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.key === "ArrowDown" || e.key === "j") {
        e.preventDefault();
        handleNavigate(currentIndex + 1, "down");
      }
      if (e.key === "ArrowUp" || e.key === "k") {
        e.preventDefault();
        handleNavigate(currentIndex - 1, "up");
      }
      if (e.key === " ") {
        e.preventDefault();
        togglePlay();
      }
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [currentIndex, handleNavigate, togglePlay]);

  const handleWheel = useCallback((e: React.WheelEvent) => {
    if (wheelLock.current) return;
    if (Math.abs(e.deltaY) < 8) return;
    
    wheelLock.current = true;
    if (e.deltaY > 0) {
      handleNavigate(currentIndex + 1, "down");
    } else {
      handleNavigate(currentIndex - 1, "up");
    }
    
    setTimeout(() => {
      wheelLock.current = false;
    }, 480);
  }, [currentIndex, handleNavigate]);

  if (signals.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4">
        <div className="logo-mark opacity-50"></div>
        <p className="serif text-2xl text-[var(--ink-soft)] animate-pulse">
          Awaiting incoming signals...
        </p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <main className="stage" onWheel={handleWheel}>
        <StageRailLeft 
          currentIndex={currentIndex}
          total={signals.length}
          onNavigate={(idx) => handleNavigate(idx)}
        />
        
        <section className="viewport" data-screen-label="card-viewport">
          <div className="card-frame">
            <SignalCard 
              signal={signals[currentIndex]}
              currentIndex={currentIndex}
              total={signals.length}
              isPlaying={isPlaying}
              progress={progress}
              transitionState={transition}
              onTogglePlay={togglePlay}
              onSeek={setProgress}
            />
          </div>
        </section>

        <StageRailRight 
          currentIndex={currentIndex}
          total={signals.length}
          onNavigate={(idx, dir) => handleNavigate(idx, dir)}
          onTogglePlay={togglePlay}
        />
      </main>

      <MiniPlayer 
        currentSignal={signals[currentIndex]}
        currentIndex={currentIndex}
        total={signals.length}
        isPlaying={isPlaying}
        progress={progress}
        onTogglePlay={togglePlay}
        onNext={() => handleNavigate(currentIndex + 1, "down")}
        onPrev={() => handleNavigate(currentIndex - 1, "up")}
      />
    </div>
  );
};
