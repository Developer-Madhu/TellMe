import React from "react";
import { Header } from "@/components/dashboard/Header";
import { SignalFeed } from "@/components/dashboard/SignalFeed";
import { Signal } from "@/components/dashboard/SignalCard";
import { supabase } from "@/lib/supabase";
import "./dashboard-fidelity.css";

// This is a Server Component
export default async function DashboardPage() {
  // Fetch the 10 most recent records from news_signals
  const { data: rawSignals, error } = await supabase
    .from("news_signals")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(10);

  if (error) {
    console.error("Error fetching signals:", error);
  }

  // Map database records to the Signal interface used by components
  const signals: Signal[] = (rawSignals || []).map((s: any) => ({
    cat: s.category_tags?.[0] || "General",
    catColor: "oklch(0.55 0.18 295)", // Fallback color
    tags: s.category_tags || [],
    read: "5 MIN READ", // Mock or calculate from summary length
    time: s.created_at ? new Date(s.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "Just now",
    // Handle headline as string or array as expected by SignalCard
    headline: [s.headline || "Untitled Signal"],
    deck: s.summary_text || "No summary available.",
    audio: "05:00", // Mock duration until we have actual audio metadata
    sources: (s.source_links || []).map((link: string | { name: string, color: string }) => 
      typeof link === "string" 
        ? { name: new URL(link).hostname.replace("www.", ""), color: "oklch(0.55 0.14 250)" }
        : link
    ),
    saves: 0,
    reads: 0,
  }));

  return (
    <div className="flex h-screen overflow-hidden bg-[var(--bg)] text-[var(--ink)] flex-col">
      <Header />
      <div className="flex-1 relative overflow-hidden">
        <SignalFeed initialSignals={signals} />
      </div>
    </div>
  );
}
