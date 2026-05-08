"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { Header } from "@/components/dashboard/Header";
import { StageRailLeft, StageRailRight } from "@/components/dashboard/StageRails";
import { SignalCard, Signal } from "@/components/dashboard/SignalCard";
import { MiniPlayer } from "@/components/dashboard/MiniPlayer";
import "./dashboard-fidelity.css";

const SIGNALS: Signal[] = [
  {
    cat: "AI",
    catColor: "oklch(0.62 0.16 30)",
    tags: ["Neural Nets", "Research"],
    read: "7 MIN READ",
    time: "14m ago",
    headline: ['The LLM Architectural Shift ', 'reshaping ', { em: "synthetic reasoning"}, ' from the ground up'],
    deck: 'Three labs published converging results this week showing that <b>state-space hybrids</b> outperform pure transformers on long-context retrieval at a fraction of the inference cost. The shift coincides with rising scrutiny over runtime economics — frontier models now burn more on serving than on training. Early benchmarks from DeepMind and Mistral suggest a <b>40-60% memory reduction</b> with comparable benchmark scores, while hardware partners are quietly retooling for the new memory-bandwidth profile. If the trend holds, the next generation of foundation models may look architecturally unrecognizable.',
    audio: "05:48",
    sources: [
      { name: "Nature Machine Intelligence", color: "oklch(0.55 0.16 145)" },
      { name: "DeepMind Labs", color: "oklch(0.55 0.16 250)" },
      { name: "ArXiv 2026.04881", color: "oklch(0.55 0.12 30)" },
    ],
    saves: 1240, reads: 18400,
  },
  {
    cat: "Startups",
    catColor: "oklch(0.68 0.14 145)",
    tags: ["Funding", "B2B"],
    read: "4 MIN READ",
    time: "32m ago",
    headline: ['Vertical AI agents quietly cross ', { em: "$2B" }, ' in committed ARR'],
    deck: 'A new tracker compiled from 14 enterprise CIO surveys puts vertical-specific agent platforms — legal, claims, revenue ops — past the threshold institutional buyers use to declare a category "real." <b>Median contract size tripled</b> in two quarters, and a third of deals now include a clawback tied to measurable hours-saved. The wedge looks durable: horizontal copilots are losing share inside accounts that adopted vertical tooling first. Two firms are preparing growth rounds at multiples that would have been unthinkable in early 2025.',
    audio: "04:12",
    sources: [
      { name: "Pitchbook", color: "oklch(0.55 0.14 30)" },
      { name: "The Information", color: "oklch(0.50 0.10 280)" },
      { name: "CIO Quarterly", color: "oklch(0.55 0.14 200)" },
    ],
    saves: 821, reads: 9600,
  },
  {
    cat: "Markets",
    catColor: "oklch(0.65 0.14 80)",
    tags: ["Macro", "Fed Watch"],
    read: "6 MIN READ",
    time: "1h ago",
    headline: ['Real yields invert the ', { em: "narrative" }, ' as commodities decouple'],
    deck: 'For the first time since 2019, the ten-year real yield is rising while broad commodity indices fall — a configuration that historically precedes either policy missteps or productivity surprises. <b>Three of the last four occurrences</b> resolved into multi-quarter equity rallies, but only after a sharp credit repricing first. Strategists at JPM and BlackRock are split: one camp reads the divergence as a signal of soft-landing-with-AI-tailwind; the other warns of a hidden duration build inside private credit that has yet to be tested.',
    audio: "06:21",
    sources: [
      { name: "Bloomberg Terminal", color: "oklch(0.55 0.14 30)" },
      { name: "FRED St. Louis", color: "oklch(0.55 0.14 250)" },
      { name: "JPM Research", color: "oklch(0.50 0.10 220)" },
    ],
    saves: 612, reads: 7200,
  },
  {
    cat: "Science",
    catColor: "oklch(0.60 0.14 220)",
    tags: ["Biotech", "CRISPR"],
    read: "5 MIN READ",
    time: "2h ago",
    headline: ['In-vivo base editing posts a ', { em: "durable" }, ' 18-month response curve'],
    deck: 'Verve Therapeutics and a Mass General consortium reported that a one-shot in-vivo base edit targeting PCSK9 has held LDL reductions above 55% across the full 18-month follow-up cohort with no off-target events flagged by long-read sequencing. <b>If the safety profile holds at 36 months</b>, the regulatory pathway becomes substantially shorter than first projected — and several payors have begun preliminary actuarial work. Competing programs targeting ANGPTL3 and Lp(a) are watching the readout closely; their trial designs were modeled on these endpoints.',
    audio: "05:02",
    sources: [
      { name: "NEJM", color: "oklch(0.55 0.14 30)" },
      { name: "Verve Therapeutics", color: "oklch(0.55 0.14 145)" },
      { name: "FDA Briefing", color: "oklch(0.50 0.10 250)" },
    ],
    saves: 488, reads: 5400,
  },
  {
    cat: "Politics",
    catColor: "oklch(0.60 0.16 25)",
    tags: ["Policy", "EU"],
    read: "3 MIN READ",
    time: "3h ago",
    headline: ['Brussels softens AI Act enforcement ', { em: "as compliance costs" }, ' bite mid-market'],
    deck: 'A leaked Commission memo circulating among member-state delegations proposes a 14-month enforcement holiday for general-purpose AI obligations affecting firms under €500M revenue, citing "unintended drag on European foundation-model competitiveness." <b>The proposal is contested:</b> three commissioners support it openly, two have signaled they will block, and the rest are negotiating carve-outs for high-risk deployments. A final vote is expected before the July recess. The memo also hints at a renewed sandbox regime modeled on the UK approach.',
    audio: "03:34",
    sources: [
      { name: "Politico EU", color: "oklch(0.55 0.14 30)" },
      { name: "Reuters", color: "oklch(0.50 0.10 30)" },
      { name: "EC Press Corps", color: "oklch(0.55 0.14 250)" },
    ],
    saves: 318, reads: 4100,
  },
  {
    cat: "Climate",
    catColor: "oklch(0.62 0.14 175)",
    tags: ["Energy", "Grid"],
    read: "5 MIN READ",
    time: "4h ago",
    headline: ['Geothermal-as-a-service contracts cross ', { em: "1 GW" }, ' in datacenter pipeline'],
    deck: 'Fervo, Eavor, and a quieter cohort of next-gen geothermal developers have collectively signed power-purchase agreements totaling over a gigawatt with hyperscaler customers — a number that crossed the threshold this quarter without much fanfare. <b>The economics now pencil</b> below combined-cycle gas in five US states, and the firmness profile (24/7 baseload, sub-second ramp) has become a structural advantage as grid operators stop accepting intermittent-only matches for new datacenter loads. Project finance is following: green-loan spreads compressed 80bps in eight weeks.',
    audio: "04:55",
    sources: [
      { name: "Wood Mackenzie", color: "oklch(0.55 0.14 175)" },
      { name: "DOE Loan Office", color: "oklch(0.50 0.10 220)" },
      { name: "Heatmap News", color: "oklch(0.55 0.14 30)" },
    ],
    saves: 402, reads: 5800,
  },
];

type TransitionState = "leaving-up" | "leaving-down" | "entering-up" | "entering-down" | null;

export default function Dashboard() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0.38);
  const [transition, setTransition] = useState<TransitionState>(null);
  const wheelLock = useRef(false);

  const parseDur = (t: string) => {
    const [m, s] = t.split(":").map(Number);
    return m * 60 + s;
  };

  const handleNavigate = useCallback((newIndex: number, dir?: "up" | "down") => {
    if (newIndex < 0 || newIndex >= SIGNALS.length || newIndex === currentIndex || transition) return;

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
  }, [currentIndex, transition]);

  const togglePlay = useCallback(() => {
    setIsPlaying(prev => !prev);
  }, []);

  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setProgress(prev => {
        const dur = parseDur(SIGNALS[currentIndex].audio);
        const next = prev + 1 / dur;
        if (next >= 1) {
          if (currentIndex < SIGNALS.length - 1) {
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
  }, [isPlaying, currentIndex, handleNavigate]);

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

  return (
    <div className="h-full bg-[var(--bg)] text-[var(--ink)]">
      <Header />
      
      <main className="stage" onWheel={handleWheel}>
        <StageRailLeft 
          currentIndex={currentIndex}
          total={SIGNALS.length}
          onNavigate={(idx) => handleNavigate(idx)}
        />
        
        <section className="viewport" data-screen-label="card-viewport">
          <div className="card-frame">
            <SignalCard 
              signal={SIGNALS[currentIndex]}
              currentIndex={currentIndex}
              total={SIGNALS.length}
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
          total={SIGNALS.length}
          onNavigate={(idx, dir) => handleNavigate(idx, dir)}
          onTogglePlay={togglePlay}
        />
      </main>

      <MiniPlayer 
        currentSignal={SIGNALS[currentIndex]}
        currentIndex={currentIndex}
        total={SIGNALS.length}
        isPlaying={isPlaying}
        progress={progress}
        onTogglePlay={togglePlay}
        onNext={() => handleNavigate(currentIndex + 1, "down")}
        onPrev={() => handleNavigate(currentIndex - 1, "up")}
      />
    </div>
  );
}
