"use client";

import React, { useState, useMemo } from "react";
import {
  calculateArchitectureEstimate,
  getScopingAdvice,
  ArchitectureConfig,
  EstimationResult,
} from "@/lib/calculator";

export default function Home() {
  const [config, setConfig] = useState<ArchitectureConfig>({
    projectName: "NextGen AI Platform",
    projectType: "AI_AGENTS",
    scaleTier: "GROWTH",
    selectedFrontend: ["Next.js 15 App Router"],
    selectedBackend: ["FastAPI Python", "Go Microservices"],
    selectedDatabase: ["PostgreSQL HA", "Redis Cluster", "pgvector / Milvus"],
    selectedAI: ["Multi-Agent Swarm", "RAG Vector Index"],
    cynbitIntegrations: ["Cynbit Studio Engine", "TenantEase Multi-Tenant"],
    securityLevel: "Enterprise Hardened",
  });

  const [currency, setCurrency] = useState<"USD" | "INR">("USD");
  const [copiedBlueprint, setCopiedBlueprint] = useState(false);
  const [ariaPrompt, setAriaPrompt] = useState("");
  const [isAriaLoading, setIsAriaLoading] = useState(false);
  const [chatMessages, setChatMessages] = useState<Array<{ sender: string; text: string; recs?: string[] }>>([
    {
      sender: "Aria AI Architect",
      text: "System Telemetry Alert: Detected high-frequency RAG queries across active layers. Provisioning dedicated pgvector replica with HNSW indexing to cap p99 latency under 35ms.",
      recs: ["Provision HNSW indexing for pgvector", "Enable Envoy mTLS v1.3 zero-trust", "Auto-reclaim idle worker pods"],
    },
  ]);

  // Real-time calculation based on selected configuration
  const estimate: EstimationResult = useMemo(() => {
    return calculateArchitectureEstimate(config);
  }, [config]);

  // Currency multiplier (1 USD ~ 83.35 INR)
  const usdToInr = 83.35;

  // Toggle array item helper
  const toggleArrayItem = (key: keyof ArchitectureConfig, item: string) => {
    const current = (config[key] as string[]) || [];
    if (current.includes(item)) {
      if (current.length > 1) {
        setConfig({ ...config, [key]: current.filter((x) => x !== item) });
      }
    } else {
      setConfig({ ...config, [key]: [...current, item] });
    }
  };

  // Archetype selection helper
  const archetypes = [
    {
      id: "AI_AGENTS" as const,
      name: "Autonomous AI Swarms",
      badge: "Multi-Agent",
      badgeColor: "bg-[#00f2fe] text-[#002022]",
      desc: "Multi-agent LangGraph orchestrator, high-throughput vector store, self-healing runtime.",
      metric: "Concurrency: 25k req/s",
      icon: "psychology",
    },
    {
      id: "ENTERPRISE_SAAS" as const,
      name: "Enterprise SaaS",
      badge: "SOC2 / HIPAA",
      badgeColor: "bg-[#5c03cb]/40 text-[#d2bbff]",
      desc: "RLS multi-tenancy, strict cryptographic tenant boundary, role-based audit telemetry.",
      metric: "Isolation: Row-Level SLA",
      icon: "domain",
    },
    {
      id: "FULLSTACK_WEB_MOBILE" as const,
      name: "Full-Stack Web & Mobile",
      badge: "Ultra-Fast Edge",
      badgeColor: "bg-[#282a30] text-[#00dce6]",
      desc: "Cross-platform unified GraphQL, edge-rendered hydration, offline sync primitives.",
      metric: "Lighthouse: 99+ Core Vitals",
      icon: "devices",
    },
    {
      id: "CLOUD_MIGRATION" as const,
      name: "Cloud Modernization",
      badge: "Kubernetes Mesh",
      badgeColor: "bg-[#67f4b7]/20 text-[#67f4b7]",
      desc: "Containerization of monolithic cores, zero-downtime database cutover, Istio mTLS.",
      metric: "Cutover: Zero Downtime",
      icon: "cloud_sync",
    },
  ];

  // Scale tiers helper
  const tiers = [
    {
      id: "MVP" as const,
      title: "MVP / Seed",
      usd: "$12K – $25K",
      inr: "₹10.0L – ₹20.8L",
      throughput: "1.5M Requests / Month",
    },
    {
      id: "GROWTH" as const,
      title: "Growth Scale",
      usd: "$45K – $90K",
      inr: "₹37.5L – ₹75.0L",
      throughput: "10M Requests / Month",
    },
    {
      id: "ENTERPRISE" as const,
      title: "Enterprise Sovereign",
      usd: "$150K+ Custom",
      inr: "₹1.25Cr+ Custom",
      throughput: "100M+ Requests / Month",
    },
  ];

  // Active component count
  const activeComponentCount =
    config.selectedFrontend.length +
    config.selectedBackend.length +
    config.selectedDatabase.length +
    config.selectedAI.length +
    config.cynbitIntegrations.length;

  // Handle Aria AI submit
  const handleAriaSubmit = async (promptOverride?: string) => {
    const query = promptOverride || ariaPrompt;
    if (!query.trim()) return;

    setChatMessages((prev) => [...prev, { sender: "You", text: query }]);
    setAriaPrompt("");
    setIsAriaLoading(true);

    try {
      const res = await fetch("/api/scoping-agent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: query, currentConfig: config }),
      });
      if (!res.ok) throw new Error("Fallback to client engine");
      const data = await res.json();
      setChatMessages((prev) => [
        ...prev,
        {
          sender: "Aria AI Architect",
          text: data.reply || "Synthesized architecture plan.",
          recs: data.recommendations,
        },
      ]);
    } catch {
      // Client-side fallback for static export / GitHub Pages
      const fallback = getScopingAdvice(query);
      setChatMessages((prev) => [
        ...prev,
        {
          sender: "Aria AI Architect",
          text: fallback.reply,
          recs: fallback.recommendations,
        },
      ]);
    } finally {
      setIsAriaLoading(false);
    }
  };

  // Copy Blueprint
  const copyBlueprint = () => {
    const blueprint = `# Cynbit Architecture & Scoping Blueprint
Project: ${config.projectName}
Archetype: ${config.projectType} | Scale Tier: ${config.scaleTier}
Security Level: ${config.securityLevel}

## Configured Technology Stack
Frontend: ${config.selectedFrontend.join(", ")}
Backend: ${config.selectedBackend.join(", ")}
Data & Storage: ${config.selectedDatabase.join(", ")}
AI Orchestration: ${config.selectedAI.join(", ")}
Cynbit Proprietary Fabric: ${config.cynbitIntegrations.join(", ")}

## Financial & Timeline Projections
Timeline: ${estimate.estimatedWeeksMin} - ${estimate.estimatedWeeksMax} Weeks (65% accelerated with Cynbit blueprints)
Project Budget: $${estimate.estimatedCostUsdMin.toLocaleString()} - $${estimate.estimatedCostUsdMax.toLocaleString()} USD (₹${(estimate.estimatedCostInrMin / 100000).toFixed(1)}L - ₹${(estimate.estimatedCostInrMax / 100000).toFixed(1)}L INR)
Monthly Cloud OPEX: ~$${estimate.monthlyCloudOpexUsd.toLocaleString()}/mo (₹${Math.round(estimate.monthlyCloudOpexUsd * usdToInr).toLocaleString()}/mo)
Complexity Index: ${estimate.complexityScore} / 100 (${estimate.feasibilityRating})

## Recommended Engineering Squad
${estimate.teamComposition.map((t) => `- ${t}`).join("\n")}
`;
    navigator.clipboard.writeText(blueprint);
    setCopiedBlueprint(true);
    setTimeout(() => setCopiedBlueprint(false), 2500);
  };

  // SVG Gauge calculations
  const gaugeCircumference = 138;
  const gaugeOffset = gaugeCircumference - (gaugeCircumference * estimate.complexityScore) / 100;

  return (
    <div className="min-h-screen flex flex-col bg-[#0b0d13] text-[#e2e2eb] cyber-grid-canvas">
      {/* ================= TOP APP BAR / NAVIGATION ================= */}
      <header className="bg-[#111319]/90 border-b border-[#3a494b]/60 sticky top-0 z-50 backdrop-blur-md">
        <div className="flex justify-between items-center w-full px-4 sm:px-8 lg:px-10 h-16 max-w-[1680px] mx-auto">
          {/* Brand & Version */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#1e1f26] border border-[#00f2fe]/40 flex items-center justify-center shadow-[0_0_14px_rgba(0,242,254,0.3)]">
                <span className="material-symbols-outlined text-[#00f2fe] text-[20px]">hub</span>
              </div>
              <div className="flex flex-col">
                <span className="font-space font-bold tracking-wider text-[#e0fdff] text-base leading-tight">
                  CYNBIT{" "}
                  <span className="text-[#00f2fe] font-mono-code text-[12px] font-normal tracking-normal">
                    // ARCHITECTURE STUDIO
                  </span>
                </span>
                <span className="text-[10px] font-mono-code text-[#849495] leading-none">
                  BUILD v2.4.8 — CORE ENGINE
                </span>
              </div>
            </div>

            {/* Live Edge Status Pill */}
            <div className="hidden xl:flex items-center gap-2 px-3 py-1 rounded-full bg-[#1e1f26] border border-[#4edea3]/30">
              <span className="w-2 h-2 rounded-full bg-[#4edea3] neon-pulse-emerald"></span>
              <span className="text-[11px] font-medium text-[#4edea3]">
                Live Edge Engine Active • 14ms latency
              </span>
            </div>
          </div>

          {/* Center Navigation Pill Tabs */}
          <nav className="hidden lg:flex items-center gap-4 border border-[#3a494b]/60 rounded-full px-4 py-1.5 bg-[#0c0e14]/80 backdrop-blur-sm text-sm">
            <a
              href="#configurator"
              className="text-[#00f2fe] border-b-2 border-[#00f2fe] pb-0.5 font-medium flex items-center gap-1.5 transition-colors"
            >
              <span className="material-symbols-outlined text-[16px]">account_tree</span>
              <span>Configurator</span>
            </a>
            <a
              href="#topology"
              className="text-[#b9cacb] hover:text-[#e2e2eb] transition-colors flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-[16px]">lan</span>
              <span>Topology</span>
            </a>
            <a
              href="#aria"
              className="text-[#b9cacb] hover:text-[#e2e2eb] transition-colors flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-[16px]">auto_awesome</span>
              <span>Aria AI</span>
            </a>
            <a
              href="#telemetry"
              className="text-[#b9cacb] hover:text-[#e2e2eb] transition-colors flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-[16px]">monitoring</span>
              <span>Telemetry</span>
            </a>
          </nav>

          {/* Right Control Matrix: Currency, Export Blueprint & User */}
          <div className="flex items-center gap-3">
            {/* Currency Segmented Switch */}
            <div className="flex items-center bg-[#1e1f26] rounded-lg p-0.5 border border-[#3a494b] text-[11px] font-semibold">
              <button
                onClick={() => setCurrency("USD")}
                className={`px-2.5 py-1 rounded transition-all ${
                  currency === "USD"
                    ? "bg-[#00f2fe] text-[#002022] font-bold shadow-[0_0_8px_rgba(0,242,254,0.4)]"
                    : "text-[#b9cacb] hover:text-[#e2e2eb]"
                }`}
              >
                USD $
              </button>
              <button
                onClick={() => setCurrency("INR")}
                className={`px-2.5 py-1 rounded transition-all ${
                  currency === "INR"
                    ? "bg-[#00f2fe] text-[#002022] font-bold shadow-[0_0_8px_rgba(0,242,254,0.4)]"
                    : "text-[#b9cacb] hover:text-[#e2e2eb]"
                }`}
              >
                INR ₹
              </button>
            </div>

            {/* Trailing Primary Action: Export Blueprint */}
            <button
              onClick={copyBlueprint}
              className="relative group overflow-hidden rounded-lg px-3.5 py-1.5 bg-[#1e1f26] border-gradient-cyan-violet shadow-[0_0_16px_rgba(0,242,254,0.2)] hover:shadow-[0_0_24px_rgba(0,242,254,0.5)] transition-all active:scale-[0.98]"
            >
              <span className="flex items-center gap-1.5 text-[#e0fdff] font-space text-xs font-semibold">
                <span className="material-symbols-outlined text-[16px]">
                  {copiedBlueprint ? "check_circle" : "download_for_offline"}
                </span>
                <span>{copiedBlueprint ? "Blueprint Copied!" : "Export Blueprint"}</span>
              </span>
            </button>

            {/* User Architect Avatar & Glyph */}
            <div className="hidden sm:flex items-center gap-2 pl-2 border-l border-[#3a494b]/60">
              <div className="relative">
                <div className="w-8 h-8 rounded-full bg-[#1e1f26] border border-[#00f2fe]/50 flex items-center justify-center font-bold text-xs text-[#00f2fe]">
                  NK
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-[#4edea3] rounded-full border-2 border-[#0c0e14]"></span>
              </div>
              <div className="hidden 2xl:flex flex-col text-left">
                <span className="text-xs font-medium text-[#e2e2eb] leading-tight">Naman Kalia</span>
                <span className="text-[10px] font-mono-code text-[#b9cacb] leading-none">
                  Chief Cloud Architect
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* ================= HERO SECTION ================= */}
      <section className="relative pt-10 pb-8 px-4 sm:px-8 border-b border-[#3a494b]/40 overflow-hidden">
        {/* Glow Backdrop Orbs */}
        <div className="absolute -top-24 left-1/4 w-96 h-96 bg-[#00f2fe]/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#5c03cb]/15 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-6xl mx-auto flex flex-col items-center text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#191b22] border border-[#00f2fe]/30 mb-4 shadow-[0_0_12px_rgba(0,242,254,0.15)]">
            <span className="material-symbols-outlined text-[#00f2fe] text-[16px]">bolt</span>
            <span className="text-[11px] font-mono-code font-semibold tracking-wider text-[#e0fdff]">
              CYNBIT ADAPTIVE SYNTHESIS ENGINE v4.2
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-space font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#e0fdff] via-[#00f2fe] to-[#d2bbff] tracking-tight max-w-4xl">
            Architect Your System. Estimate in Real Time.
          </h1>

          <p className="mt-3 text-sm sm:text-base text-[#b9cacb] max-w-2xl leading-relaxed">
            Deterministic cloud orchestration, multi-agent AI framework sizing, and zero-waste
            infrastructure modeling tailored for high-scale enterprise deployments.
          </p>

          {/* Three Telemetry Metric Floating Pills */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-3 w-full max-w-4xl">
            {/* Metric Pill 1 */}
            <div className="flex items-center gap-3 p-3 rounded-lg bg-[#191b22]/90 border border-[#3a494b] hover:border-[#00f2fe]/50 transition-all shadow-sm">
              <div className="w-8 h-8 rounded bg-[#00f2fe]/10 flex items-center justify-center text-[#00f2fe]">
                <span className="material-symbols-outlined text-[18px]">currency_exchange</span>
              </div>
              <div className="text-left">
                <div className="text-xs font-semibold text-[#e0fdff]">Real-time USD / INR Engine</div>
                <div className="text-mono-code text-[11px] text-[#b9cacb]">
                  {currency === "USD" ? "1 USD = 83.35 INR [Synced]" : "1 INR = 0.012 USD [Real-Time]"}
                </div>
              </div>
            </div>

            {/* Metric Pill 2 */}
            <div className="flex items-center gap-3 p-3 rounded-lg bg-[#191b22]/90 border border-[#3a494b] hover:border-[#d2bbff]/50 transition-all shadow-sm">
              <div className="w-8 h-8 rounded bg-[#5c03cb]/20 flex items-center justify-center text-[#d2bbff]">
                <span className="material-symbols-outlined text-[18px]">security</span>
              </div>
              <div className="text-left">
                <div className="text-xs font-semibold text-[#d2bbff]">Deterministic Cost & Latency</div>
                <div className="text-mono-code text-[11px] text-[#b9cacb]">p99 Target &lt; 40ms Edge SLA</div>
              </div>
            </div>

            {/* Metric Pill 3 */}
            <div className="flex items-center gap-3 p-3 rounded-lg bg-[#191b22]/90 border border-[#3a494b] hover:border-[#4edea3]/50 transition-all shadow-sm">
              <div className="w-8 h-8 rounded bg-[#67f4b7]/10 flex items-center justify-center text-[#4edea3]">
                <span className="material-symbols-outlined text-[18px]">energy_savings_leaf</span>
              </div>
              <div className="text-left">
                <div className="text-xs font-semibold text-[#e1ffec]">Zero-Waste FinOps Topology</div>
                <div className="text-mono-code text-[11px] text-[#b9cacb]">Auto-reclaims idle pods (-28%)</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= MAIN TWO-COLUMN WORKSPACE ================= */}
      <main className="px-4 sm:px-8 py-8 max-w-[1680px] mx-auto w-full flex-1">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* ================= LEFT COLUMN: ARCHITECTURE CONFIGURATOR (7 Cols) ================= */}
          <section className="lg:col-span-7 flex flex-col gap-6" id="configurator">
            {/* Module Header */}
            <div className="flex items-center justify-between pb-2 border-b border-[#3a494b]/60">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#00f2fe]">tune</span>
                <h2 className="font-space font-semibold text-xl text-[#e0fdff]">
                  Architecture Configurator
                </h2>
              </div>
              <span className="text-[11px] font-mono-code text-[#849495]">STEP 01 — TARGET TOPOLOGY</span>
            </div>

            {/* 1. Core System Archetype Selector Cards */}
            <div>
              <label className="text-[11px] font-mono-code text-[#b9cacb] mb-2 block tracking-wider uppercase">
                1. Select Core System Archetype
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {archetypes.map((arch) => {
                  const isSelected = config.projectType === arch.id;
                  return (
                    <button
                      key={arch.id}
                      onClick={() => setConfig({ ...config, projectType: arch.id })}
                      className={`text-left p-4 rounded-lg transition-all relative flex flex-col justify-between group ${
                        isSelected
                          ? "bg-[#1e1f26] border-2 border-[#00f2fe] shadow-[0_0_16px_rgba(0,242,254,0.25)]"
                          : "bg-[#191b22] border border-[#3a494b] hover:border-[#849495] hover:bg-[#1e1f26]"
                      }`}
                    >
                      <div>
                        <div className="flex justify-between items-start mb-2">
                          <div
                            className={`w-9 h-9 rounded flex items-center justify-center transition-transform group-hover:scale-105 ${
                              isSelected
                                ? "bg-[#00f2fe]/15 text-[#00f2fe]"
                                : "bg-[#282a30] text-[#b9cacb]"
                            }`}
                          >
                            <span className="material-symbols-outlined text-[22px]">{arch.icon}</span>
                          </div>
                          <span
                            className={`px-2 py-0.5 rounded text-[11px] font-semibold ${arch.badgeColor}`}
                          >
                            {arch.badge}
                          </span>
                        </div>
                        <h3
                          className={`font-space font-semibold text-base ${
                            isSelected ? "text-[#e0fdff]" : "text-[#e2e2eb]"
                          }`}
                        >
                          {arch.name}
                        </h3>
                        <p className="text-xs text-[#b9cacb] mt-1 leading-relaxed">{arch.desc}</p>
                      </div>
                      <div className="mt-3 pt-2 border-t border-[#3a494b]/30 flex items-center justify-between text-mono-code text-[11px]">
                        <span className={isSelected ? "text-[#00f2fe]" : "text-[#849495]"}>
                          {arch.metric}
                        </span>
                        <span
                          className={`material-symbols-outlined text-[16px] ${
                            isSelected ? "text-[#00f2fe]" : "text-[#849495]"
                          }`}
                        >
                          {isSelected ? "check_circle" : "radio_button_unchecked"}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 2. Scale & Workload Velocity Tier */}
            <div className="bg-[#191b22] p-4 rounded-lg border border-[#3a494b]">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-3">
                <div>
                  <span className="text-[11px] font-mono-code text-[#b9cacb] block tracking-wider uppercase">
                    2. Scale & Workload Velocity Tier
                  </span>
                  <span className="text-xs text-[#849495]">
                    Calibrates redundancy, multi-region routing & throughput resilience
                  </span>
                </div>
                <span className="text-mono-code text-xs text-[#00f2fe] font-semibold mt-1 sm:mt-0">
                  {config.scaleTier === "MVP" && "1.5M Requests / Month"}
                  {config.scaleTier === "GROWTH" && "10M Requests / Month"}
                  {config.scaleTier === "ENTERPRISE" && "100M+ Requests / Month"}
                </span>
              </div>

              {/* Tier Segments */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-1.5 bg-[#0c0e14] p-1.5 rounded-lg border border-[#3a494b]">
                {tiers.map((t) => {
                  const isSelected = config.scaleTier === t.id;
                  return (
                    <button
                      key={t.id}
                      onClick={() => setConfig({ ...config, scaleTier: t.id })}
                      className={`px-3 py-2.5 rounded text-left transition-all ${
                        isSelected
                          ? "bg-[#1e1f26] border border-[#00f2fe]/60 shadow-[0_0_12px_rgba(0,242,254,0.2)]"
                          : "text-[#b9cacb] hover:text-[#e2e2eb] hover:bg-[#1e1f26]"
                      }`}
                    >
                      <div
                        className={`text-sm font-semibold ${
                          isSelected ? "text-[#e0fdff]" : "text-[#e2e2eb]"
                        }`}
                      >
                        {t.title}
                      </div>
                      <div
                        className={`text-mono-code text-[11px] ${
                          isSelected ? "text-[#00f2fe]" : "text-[#849495]"
                        }`}
                      >
                        {currency === "USD" ? t.usd : t.inr}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 3. Component Selection Matrix */}
            <div className="bg-[#191b22] p-4 rounded-lg border border-[#3a494b] flex flex-col gap-4">
              <div className="flex items-center justify-between pb-2 border-b border-[#3a494b]/40">
                <span className="text-[11px] font-mono-code text-[#b9cacb] tracking-wider uppercase">
                  3. Technology Component Stack
                </span>
                <span className="text-mono-code text-[11px] text-[#00f2fe]">
                  {activeComponentCount} Selected
                </span>
              </div>

              {/* Category 1: Frontend */}
              <div>
                <div className="text-[11px] font-mono-code text-[#849495] mb-2 flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[14px]">desktop_windows</span>
                  FRONTEND & CLIENT RUNTIME
                </div>
                <div className="flex flex-wrap gap-2">
                  {["Next.js 15 App Router", "React 19 Client", "Flutter / Native Swift"].map((item) => {
                    const active = config.selectedFrontend.includes(item);
                    return (
                      <button
                        key={item}
                        onClick={() => toggleArrayItem("selectedFrontend", item)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all ${
                          active
                            ? "border border-[#00f2fe] bg-[#00f2fe]/10 text-[#00f2fe] shadow-[0_0_8px_rgba(0,242,254,0.25)]"
                            : "border border-[#3a494b] bg-[#1e1f26] text-[#b9cacb] hover:text-[#e2e2eb]"
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            active ? "bg-[#00f2fe]" : "bg-[#849495]"
                          }`}
                        ></span>
                        {item}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Category 2: Compute */}
              <div>
                <div className="text-[11px] font-mono-code text-[#849495] mb-2 flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[14px]">memory</span>
                  BACKEND & COMPUTE FABRIC
                </div>
                <div className="flex flex-wrap gap-2">
                  {["FastAPI Python", "Go Microservices", "Node.js / Bun Core"].map((item) => {
                    const active = config.selectedBackend.includes(item);
                    return (
                      <button
                        key={item}
                        onClick={() => toggleArrayItem("selectedBackend", item)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all ${
                          active
                            ? "border border-[#00f2fe] bg-[#00f2fe]/10 text-[#00f2fe] shadow-[0_0_8px_rgba(0,242,254,0.25)]"
                            : "border border-[#3a494b] bg-[#1e1f26] text-[#b9cacb] hover:text-[#e2e2eb]"
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            active ? "bg-[#00f2fe]" : "bg-[#849495]"
                          }`}
                        ></span>
                        {item}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Category 3: Data & Storage */}
              <div>
                <div className="text-[11px] font-mono-code text-[#849495] mb-2 flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[14px]">database</span>
                  PERSISTENCE & CACHE TIERS
                </div>
                <div className="flex flex-wrap gap-2">
                  {["PostgreSQL HA", "Redis Cluster", "pgvector / Milvus"].map((item) => {
                    const active = config.selectedDatabase.includes(item);
                    return (
                      <button
                        key={item}
                        onClick={() => toggleArrayItem("selectedDatabase", item)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all ${
                          active
                            ? "border border-[#00f2fe] bg-[#00f2fe]/10 text-[#00f2fe] shadow-[0_0_8px_rgba(0,242,254,0.25)]"
                            : "border border-[#3a494b] bg-[#1e1f26] text-[#b9cacb] hover:text-[#e2e2eb]"
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            active ? "bg-[#00f2fe]" : "bg-[#849495]"
                          }`}
                        ></span>
                        {item}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Category 4: AI & Intelligence */}
              <div>
                <div className="text-[11px] font-mono-code text-[#849495] mb-2 flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[14px]">neurology</span>
                  INTELLIGENCE & AGENT ORCHESTRATION
                </div>
                <div className="flex flex-wrap gap-2">
                  {["Multi-Agent Swarm", "RAG Vector Index", "Local LLM / Ollama"].map((item) => {
                    const active = config.selectedAI.includes(item);
                    return (
                      <button
                        key={item}
                        onClick={() => toggleArrayItem("selectedAI", item)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all ${
                          active
                            ? "border border-[#00f2fe] bg-[#00f2fe]/10 text-[#00f2fe] shadow-[0_0_8px_rgba(0,242,254,0.25)]"
                            : "border border-[#3a494b] bg-[#1e1f26] text-[#b9cacb] hover:text-[#e2e2eb]"
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            active ? "bg-[#00f2fe]" : "bg-[#849495]"
                          }`}
                        ></span>
                        {item}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Category 5: Cynbit Proprietary Fabric */}
              <div>
                <div className="text-[11px] font-mono-code text-[#d2bbff] mb-2 flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[14px]">stars</span>
                  CYNBIT PROPRIETARY FABRIC
                </div>
                <div className="flex flex-wrap gap-2">
                  {["Cynbit Studio Engine", "TenantEase Multi-Tenant", "Revio Billing Fabric"].map((item) => {
                    const active = config.cynbitIntegrations.includes(item);
                    return (
                      <button
                        key={item}
                        onClick={() => toggleArrayItem("cynbitIntegrations", item)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all ${
                          active
                            ? "border border-[#d2bbff] bg-[#5c03cb]/20 text-[#d2bbff] shadow-[0_0_8px_rgba(144,85,255,0.25)]"
                            : "border border-[#3a494b] bg-[#1e1f26] text-[#b9cacb] hover:text-[#e2e2eb]"
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            active ? "bg-[#d2bbff]" : "bg-[#849495]"
                          }`}
                        ></span>
                        {item}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </section>

          {/* ================= RIGHT COLUMN: LIVE ESTIMATION DECK & VISUALIZER (5 Cols) ================= */}
          <section className="lg:col-span-5 flex flex-col gap-6" id="telemetry">
            {/* Bento Telemetry Metric Cards */}
            <div className="grid grid-cols-2 gap-3">
              {/* Card 1: Estimated Timeline */}
              <div className="p-4 rounded-lg bg-[#191b22] border border-[#3a494b] relative overflow-hidden">
                <div className="text-[11px] font-mono-code text-[#849495] flex items-center justify-between">
                  <span>TIMELINE</span>
                  <span className="material-symbols-outlined text-[16px] text-[#00f2fe]">speed</span>
                </div>
                <div className="mt-1 font-mono-code text-xl font-bold text-[#e0fdff]">
                  {estimate.estimatedWeeksMin} - {estimate.estimatedWeeksMax} Weeks
                </div>
                <div className="mt-2 flex items-center gap-1.5 text-[11px] font-mono-code text-[#4edea3]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#4edea3]"></span>
                  <span>65% faster with Cynbit blueprints</span>
                </div>
              </div>

              {/* Card 2: Budget Range */}
              <div className="p-4 rounded-lg bg-[#191b22] border border-[#3a494b] relative overflow-hidden">
                <div className="text-[11px] font-mono-code text-[#849495] flex items-center justify-between">
                  <span>PROJECT BUDGET</span>
                  <span className="material-symbols-outlined text-[16px] text-[#d2bbff]">
                    monetization_on
                  </span>
                </div>
                <div className="mt-1 font-mono-code text-lg sm:text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#00f2fe] to-[#d2bbff]">
                  {currency === "USD"
                    ? `$${estimate.estimatedCostUsdMin.toLocaleString()} – $${estimate.estimatedCostUsdMax.toLocaleString()}`
                    : `₹${(estimate.estimatedCostInrMin / 100000).toFixed(1)}L – ₹${(
                        estimate.estimatedCostInrMax / 100000
                      ).toFixed(1)}L`}
                </div>
                <div className="mt-2 flex items-center gap-1.5 text-[11px] font-mono-code text-[#4edea3]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#4edea3]"></span>
                  <span>18.4% FinOps Optimized</span>
                </div>
              </div>

              {/* Card 3: Monthly Cloud OPEX */}
              <div className="p-4 rounded-lg bg-[#191b22] border border-[#3a494b] relative overflow-hidden">
                <div className="text-[11px] font-mono-code text-[#849495] flex items-center justify-between">
                  <span>CLOUD OPEX</span>
                  <span className="material-symbols-outlined text-[16px] text-[#849495]">cloud</span>
                </div>
                <div className="mt-1 font-mono-code text-xl font-bold text-[#e2e2eb]">
                  {currency === "USD"
                    ? `$${estimate.monthlyCloudOpexUsd.toLocaleString()} / mo`
                    : `₹${Math.round(estimate.monthlyCloudOpexUsd * usdToInr).toLocaleString()} / mo`}
                </div>
                <div className="mt-2 text-[11px] font-mono-code text-[#b9cacb] truncate">
                  AWS/GCP serverless & DB cap
                </div>
              </div>

              {/* Card 4: Radial Complexity Gauge */}
              <div className="p-4 rounded-lg bg-[#191b22] border border-[#3a494b] flex items-center justify-between relative overflow-hidden">
                <div>
                  <div className="text-[11px] font-mono-code text-[#849495]">COMPLEXITY</div>
                  <div className="font-mono-code text-xl font-bold text-[#00f2fe] mt-1">
                    {estimate.complexityScore}{" "}
                    <span className="text-xs font-normal text-[#849495]">/ 100</span>
                  </div>
                  <div className="text-[11px] font-mono-code text-[#b9cacb] mt-1">
                    {estimate.feasibilityRating} Density
                  </div>
                </div>

                {/* SVG Radial Progress Ring */}
                <div className="relative w-14 h-14 flex items-center justify-center">
                  <svg className="w-14 h-14 transform -rotate-90">
                    <circle
                      cx="28"
                      cy="28"
                      fill="none"
                      r="22"
                      stroke="#1F2536"
                      strokeWidth="4"
                    />
                    <circle
                      cx="28"
                      cy="28"
                      fill="none"
                      r="22"
                      stroke="url(#cyan-violet-grad)"
                      strokeDasharray={gaugeCircumference}
                      strokeDashoffset={gaugeOffset}
                      strokeLinecap="round"
                      strokeWidth="4"
                      className="transition-all duration-700 ease-out"
                    />
                    <defs>
                      <linearGradient id="cyan-violet-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#00F2FE" />
                        <stop offset="100%" stopColor="#9055FF" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <span className="material-symbols-outlined absolute text-[16px] text-[#00f2fe]">
                    hub
                  </span>
                </div>
              </div>
            </div>

            {/* Interactive Architecture Topology Canvas */}
            <div className="rounded-lg bg-[#191b22] border border-[#3a494b] overflow-hidden" id="topology">
              <div className="p-3.5 border-b border-[#3a494b]/60 flex items-center justify-between bg-[#1e1f26]/60">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#00f2fe] text-[18px]">schema</span>
                  <span className="font-space font-semibold text-[#e0fdff] text-sm">
                    Synthesized Mesh Topology
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#4edea3] neon-pulse-emerald"></span>
                  <span className="text-mono-code text-[11px] text-[#b9cacb]">Live Flow</span>
                </div>
              </div>

              {/* Topological Node Canvas */}
              <div className="p-4 bg-[#0c0e14] relative min-h-[300px] flex flex-col justify-between cyber-grid-canvas">
                {/* SVG Connector Lines Overlay */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 1 }}>
                  <path
                    className="topology-flow-line"
                    d="M 120 44 L 120 80"
                    opacity="0.6"
                    stroke="#00F2FE"
                    strokeWidth="1.5"
                  />
                  <path
                    className="topology-flow-line"
                    d="M 120 130 L 120 166"
                    opacity="0.6"
                    stroke="#00F2FE"
                    strokeWidth="1.5"
                  />
                  <path
                    className="topology-flow-line"
                    d="M 120 216 L 120 252"
                    opacity="0.7"
                    stroke="#9055FF"
                    strokeWidth="1.5"
                  />
                </svg>

                {/* Layer 1: Edge CDN */}
                <div className="relative z-10 flex items-center justify-between">
                  <div className="flex items-center gap-2.5 p-2 rounded-lg bg-[#1e1f26] border border-[#00f2fe]/40 shadow-[0_0_10px_rgba(0,242,254,0.15)] w-64">
                    <div className="w-7 h-7 rounded bg-[#00f2fe]/20 flex items-center justify-center text-[#00f2fe]">
                      <span className="material-symbols-outlined text-[16px]">public</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs font-semibold text-[#e0fdff]">
                        Edge CDN / Cloudflare
                      </span>
                      <span className="text-[10px] font-mono-code text-[#849495]">
                        Anycast SSL • DDoS Guard
                      </span>
                    </div>
                  </div>
                  <span className="text-mono-code text-[10px] px-2 py-0.5 rounded bg-[#1e1f26] border border-[#3a494b] text-[#4edea3]">
                    p99 &lt; 14ms
                  </span>
                </div>

                {/* Layer 2: API Gateway */}
                <div className="relative z-10 flex items-center justify-between">
                  <div className="flex items-center gap-2.5 p-2 rounded-lg bg-[#1e1f26] border border-[#3a494b] hover:border-[#00f2fe]/50 transition-colors w-64">
                    <div className="w-7 h-7 rounded bg-[#373940] flex items-center justify-center text-[#e0fdff]">
                      <span className="material-symbols-outlined text-[16px]">alt_route</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs font-semibold text-[#e2e2eb]">Envoy Gateway Mesh</span>
                      <span className="text-[10px] font-mono-code text-[#849495]">
                        JWT Auth • Rate Limiting
                      </span>
                    </div>
                  </div>
                  <span className="text-mono-code text-[10px] px-2 py-0.5 rounded bg-[#1e1f26] border border-[#3a494b] text-[#849495]">
                    mTLS v1.3
                  </span>
                </div>

                {/* Layer 3: Compute & Swarm */}
                <div className="relative z-10 flex items-center justify-between">
                  <div className="flex items-center gap-2.5 p-2 rounded-lg bg-[#1e1f26] border border-[#00f2fe]/40 w-64">
                    <div className="w-7 h-7 rounded bg-[#00f2fe]/20 flex items-center justify-center text-[#00f2fe]">
                      <span className="material-symbols-outlined text-[16px]">terminal</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs font-semibold text-[#e0fdff]">
                        {config.selectedBackend[0] || "Worker Pods"}
                      </span>
                      <span className="text-[10px] font-mono-code text-[#849495]">
                        Autoscaling HPA (3..30)
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 p-1 px-2 rounded-lg bg-[#1e1f26] border border-[#d2bbff] shadow-[0_0_10px_rgba(144,85,255,0.25)]">
                    <span className="material-symbols-outlined text-[13px] text-[#d2bbff]">
                      auto_fix_high
                    </span>
                    <span className="text-mono-code text-[10px] text-[#d2bbff]">Swarm Active</span>
                  </div>
                </div>

                {/* Layer 4: Data & Vector */}
                <div className="relative z-10 flex items-center justify-between">
                  <div className="flex items-center gap-2.5 p-2 rounded-lg bg-[#1e1f26] border border-[#d2bbff]/40 w-64">
                    <div className="w-7 h-7 rounded bg-[#5c03cb]/30 flex items-center justify-center text-[#d2bbff]">
                      <span className="material-symbols-outlined text-[16px]">database</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs font-semibold text-[#d2bbff]">
                        {config.selectedDatabase[0] || "PostgreSQL"}
                      </span>
                      <span className="text-[10px] font-mono-code text-[#849495]">
                        HNSW Index • HA Replica
                      </span>
                    </div>
                  </div>
                  <span className="text-mono-code text-[10px] px-2 py-0.5 rounded bg-[#1e1f26] border border-[#3a494b] text-[#4edea3]">
                    HA Active
                  </span>
                </div>
              </div>
            </div>

            {/* Aria AI Solution Architect Consultation Widget */}
            <div className="rounded-lg bg-[#191b22] border border-[#3a494b] p-4 flex flex-col gap-3" id="aria">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-[#5c03cb]/40 border border-[#d2bbff] flex items-center justify-center text-[#d2bbff] shadow-[0_0_10px_rgba(144,85,255,0.3)]">
                    <span className="material-symbols-outlined text-[18px]">smart_toy</span>
                  </div>
                  <div>
                    <span className="text-sm font-semibold text-[#e0fdff] block leading-tight">
                      Aria AI Architect
                    </span>
                    <span className="text-mono-code text-[10px] text-[#4edea3]">
                      Synthesizing System Blueprint
                    </span>
                  </div>
                </div>
                <span className="text-[11px] font-mono-code px-2 py-0.5 rounded bg-[#1e1f26] border border-[#3a494b] text-[#849495]">
                  v4.2 PRO
                </span>
              </div>

              {/* Real-time Advice Alert / Chat Dialog */}
              <div className="max-h-48 overflow-y-auto space-y-2 pr-1">
                {chatMessages.map((msg, i) => (
                  <div
                    key={i}
                    className={`p-2.5 rounded text-xs leading-relaxed ${
                      msg.sender === "You"
                        ? "bg-[#1e1f26] border border-[#3a494b] text-[#e2e2eb] ml-6"
                        : "bg-[#1e1f26]/90 border-l-2 border-[#00f2fe] text-[#b9cacb] mr-2"
                    }`}
                  >
                    <div className="font-semibold text-[#e0fdff] text-[11px] mb-0.5 font-space">
                      {msg.sender}:
                    </div>
                    <p>{msg.text}</p>
                    {msg.recs && msg.recs.length > 0 && (
                      <div className="mt-2 pt-2 border-t border-[#3a494b]/40 flex flex-wrap gap-1">
                        {msg.recs.map((rec, rIdx) => (
                          <span
                            key={rIdx}
                            className="text-[10px] font-mono-code px-1.5 py-0.5 rounded bg-[#0c0e14] text-[#4edea3]"
                          >
                            ✓ {rec}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
                {isAriaLoading && (
                  <div className="text-xs font-mono-code text-[#00f2fe] animate-pulse">
                    Aria is synthesizing architectural changes...
                  </div>
                )}
              </div>

              {/* Prompt Bar & Quick Action Chips */}
              <div className="flex flex-col gap-2 mt-1">
                <div className="relative flex items-center">
                  <input
                    value={ariaPrompt}
                    onChange={(e) => setAriaPrompt(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleAriaSubmit()}
                    type="text"
                    placeholder="Ask Aria to optimize cost, add compliance, or generate Terraform..."
                    className="w-full bg-[#0c0e14] border border-[#3a494b] rounded-lg pl-3 pr-24 py-2 text-xs text-[#e2e2eb] placeholder:text-[#849495] focus:border-[#00f2fe] focus:outline-none focus:ring-1 focus:ring-[#00f2fe]"
                  />
                  <button
                    onClick={() => handleAriaSubmit()}
                    disabled={isAriaLoading || !ariaPrompt.trim()}
                    className="absolute right-1 px-3 py-1 rounded bg-[#00f2fe] text-[#002022] text-xs font-bold hover:shadow-[0_0_10px_rgba(0,242,254,0.4)] transition-all disabled:opacity-40"
                  >
                    Synthesize
                  </button>
                </div>

                {/* 1-Click Prompt Chips */}
                <div className="flex flex-wrap gap-1.5">
                  <button
                    onClick={() => handleAriaSubmit("Run Cost Optimization on current stack")}
                    className="text-[10px] font-mono-code px-2 py-1 rounded bg-[#1e1f26] hover:bg-[#282a30] border border-[#3a494b] text-[#b9cacb] hover:text-[#00f2fe] transition-colors flex items-center gap-1"
                  >
                    <span className="material-symbols-outlined text-[12px] text-[#00f2fe]">
                      auto_fix_normal
                    </span>{" "}
                    Run Cost Optimization
                  </button>
                  <button
                    onClick={() => handleAriaSubmit("Add HIPAA Encryption & SOC2 Audit Trail")}
                    className="text-[10px] font-mono-code px-2 py-1 rounded bg-[#1e1f26] hover:bg-[#282a30] border border-[#3a494b] text-[#b9cacb] hover:text-[#d2bbff] transition-colors flex items-center gap-1"
                  >
                    <span className="material-symbols-outlined text-[12px] text-[#d2bbff]">
                      verified_user
                    </span>{" "}
                    Add HIPAA Encryption
                  </button>
                  <button
                    onClick={() => handleAriaSubmit("Export Terraform Infrastructure Blueprint")}
                    className="text-[10px] font-mono-code px-2 py-1 rounded bg-[#1e1f26] hover:bg-[#282a30] border border-[#3a494b] text-[#b9cacb] hover:text-[#4edea3] transition-colors flex items-center gap-1"
                  >
                    <span className="material-symbols-outlined text-[12px] text-[#4edea3]">
                      terminal
                    </span>{" "}
                    Export Terraform
                  </button>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>

      {/* ================= DOCKED BOTTOM STATUS BAR ================= */}
      <footer className="border-t border-[#3a494b]/40 bg-[#0c0e14] px-4 sm:px-8 py-3 text-xs text-[#b9cacb]">
        <div className="max-w-[1680px] mx-auto flex flex-col md:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-4 text-[11px] font-mono-code flex-wrap justify-center">
            <span className="flex items-center gap-1.5 text-[#e0fdff]">
              <span className="w-2 h-2 rounded-full bg-[#00f2fe]"></span> CYNBIT ORCHESTRATION KERNEL:
              ONLINE
            </span>
            <span className="text-[#849495]">|</span>
            <span className="text-[#849495]">Region: us-east-1 (N. Virginia)</span>
            <span className="text-[#849495]">|</span>
            <span className="text-[#4edea3]">Mesh Consensus: 99.999% Deterministic</span>
          </div>
          <div className="flex items-center gap-4 text-[11px] font-mono-code text-[#849495]">
            <span>© 2026 CYNBIT TECHNOLOGIES INC. ALL RIGHTS RESERVED.</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
