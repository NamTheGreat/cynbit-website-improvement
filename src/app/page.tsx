"use client";

import React, { useState, useMemo } from "react";
import {
  calculateArchitectureEstimate,
  getScopingAdvice,
  ArchitectureConfig,
  EstimationResult,
} from "@/lib/calculator";
import {
  Layers,
  Cpu,
  Database,
  Bot,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  DollarSign,
  TrendingUp,
  FileText,
  Sparkles,
  Send,
  ArrowRight,
  Server,
  Cloud,
  ChevronRight,
} from "lucide-react";

export default function Home() {
  const [config, setConfig] = useState<ArchitectureConfig>({
    projectName: "NextGen AI Platform",
    projectType: "AI_AGENTS",
    scaleTier: "GROWTH",
    selectedFrontend: ["Next.js 15 App Router", "Tailwind CSS"],
    selectedBackend: ["FastAPI (Python)", "Node.js (TypeScript)"],
    selectedDatabase: ["PostgreSQL", "Redis", "Vector DB (pgvector)"],
    selectedAI: ["Autonomous Multi-Agent Workflow", "RAG & Knowledge Index"],
    cynbitIntegrations: ["Cynbit Studio Evaluation"],
    securityLevel: "Enterprise Hardened",
  });

  const [activeTab, setActiveTab] = useState<"configure" | "topology" | "ai_assistant">("configure");
  const [chatMessage, setChatMessage] = useState("");
  const [chatHistory, setChatHistory] = useState<Array<{ sender: string; text: string; recs?: string[] }>>([
    {
      sender: "Aria Architecture Assistant",
      text: "Hello! I am your Cynbit AI Solution Architect. Ask me about your technical stack, cloud budget trade-offs, or integration patterns.",
    },
  ]);
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [copiedBlueprint, setCopiedBlueprint] = useState(false);

  // Real-time calculation
  const estimate: EstimationResult = useMemo(() => {
    return calculateArchitectureEstimate(config);
  }, [config]);

  // Toggle selection helper
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

  // AI chat handler
  const handleSendMessage = async () => {
    if (!chatMessage.trim()) return;
    const userMsg = chatMessage.trim();
    setChatHistory((prev) => [...prev, { sender: "You", text: userMsg }]);
    setChatMessage("");
    setIsChatLoading(true);

    try {
      const res = await fetch("/api/scoping-agent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMsg, currentConfig: config }),
      });
      if (!res.ok) throw new Error("API call failed, fallback to client engine");
      const data = await res.json();
      setChatHistory((prev) => [
        ...prev,
        { sender: data.agent || "Aria Architect", text: data.reply, recs: data.recommendations },
      ]);
    } catch {
      // Client-side fallback for static GitHub Pages hosting
      const fallback = getScopingAdvice(userMsg);
      setChatHistory((prev) => [
        ...prev,
        { sender: "Aria Architecture Assistant", text: fallback.reply, recs: fallback.recommendations },
      ]);
    } finally {
      setIsChatLoading(false);
    }
  };

  const copyBlueprint = () => {
    const blueprint = `# Cynbit Architecture & Scoping Blueprint
Project: ${config.projectName}
Type: ${config.projectType} | Scale: ${config.scaleTier}
Security: ${config.securityLevel}

## Tech Stack
Frontend: ${config.selectedFrontend.join(", ")}
Backend: ${config.selectedBackend.join(", ")}
Database: ${config.selectedDatabase.join(", ")}
AI Workflows: ${config.selectedAI.join(", ")}
Cynbit Integrations: ${config.cynbitIntegrations.join(", ")}

## Estimates
Timeline: ${estimate.estimatedWeeksMin} - ${estimate.estimatedWeeksMax} Weeks
Budget: $${estimate.estimatedCostUsdMin.toLocaleString()} - $${estimate.estimatedCostUsdMax.toLocaleString()} USD (₹${(estimate.estimatedCostInrMin / 100000).toFixed(1)}L - ₹${(estimate.estimatedCostInrMax / 100000).toFixed(1)}L INR)
Cloud Opex: ~$${estimate.monthlyCloudOpexUsd}/mo
Feasibility: ${estimate.feasibilityRating} (Complexity Score: ${estimate.complexityScore}/100)

## Recommended Team
${estimate.teamComposition.map((t) => `- ${t}`).join("\n")}
`;
    navigator.clipboard.writeText(blueprint);
    setCopiedBlueprint(true);
    setTimeout(() => setCopiedBlueprint(false), 2500);
  };

  return (
    <div className="flex-1 flex flex-col">
      {/* Top Navbar */}
      <header className="border-b border-gray-800/80 bg-gray-950/80 backdrop-blur sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center font-black text-white shadow-lg shadow-blue-500/30">
              C
            </div>
            <div>
              <span className="font-bold text-white tracking-tight">Cynbit Technologies</span>
              <span className="text-xs text-blue-400 block font-mono">Architecture Studio</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab("configure")}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                activeTab === "configure" ? "bg-blue-600 text-white" : "text-gray-400 hover:text-white"
              }`}
            >
              Stack Configurator
            </button>
            <button
              onClick={() => setActiveTab("topology")}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                activeTab === "topology" ? "bg-blue-600 text-white" : "text-gray-400 hover:text-white"
              }`}
            >
              Topology Map
            </button>
            <button
              onClick={() => setActiveTab("ai_assistant")}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition ${
                activeTab === "ai_assistant"
                  ? "bg-purple-600 text-white"
                  : "text-purple-400 hover:text-purple-300"
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              Aria AI Architect
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full">
        {/* Hero Banner */}
        <div className="mb-8 text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            New Website Capability • Interactive Full-Stack Project Estimator
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white mb-3">
            Design Your Architecture. <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-sky-300">Estimate in Real Time.</span>
          </h1>
          <p className="text-sm text-gray-400 leading-relaxed">
            Eliminating vague static contact forms. Configure your tech stack, integrate Cynbit proprietary software suites, visualize system topology, and get instant budget & timeline projections.
          </p>
        </div>

        {/* 2-Column Grid: Configurator vs Live Output Deck */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column (8 cols): Active Tab Views */}
          <div className="lg:col-span-7 space-y-6">
            {activeTab === "configure" && (
              <div className="space-y-6">
                {/* Project Overview Card */}
                <div className="glass-panel p-6 rounded-2xl">
                  <h3 className="text-base font-semibold text-white mb-4 flex items-center gap-2">
                    <Layers className="w-4 h-4 text-blue-400" />
                    1. Project Scope & Scale
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
                    {[
                      { id: "AI_AGENTS", label: "Autonomous AI Agents" },
                      { id: "ENTERPRISE_SAAS", label: "Enterprise SaaS" },
                      { id: "FULLSTACK_WEB_MOBILE", label: "Web & Mobile" },
                      { id: "CLOUD_MIGRATION", label: "Cloud Modernization" },
                    ].map((t) => (
                      <button
                        key={t.id}
                        onClick={() => setConfig({ ...config, projectType: t.id as any })}
                        className={`p-3 rounded-xl border text-xs font-medium text-left transition ${
                          config.projectType === t.id
                            ? "bg-blue-600/20 border-blue-500 text-white"
                            : "bg-gray-900/50 border-gray-800 text-gray-400 hover:border-gray-700"
                        }`}
                      >
                        {t.label}
                      </button>
                    ))}
                  </div>

                  {/* Scale Tier */}
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { id: "MVP", label: "Startup MVP", desc: "<10k DAU" },
                      { id: "GROWTH", label: "Growth Platform", desc: "10k-250k DAU" },
                      { id: "ENTERPRISE", label: "High-Availability", desc: "Multi-Region / 99.99%" },
                    ].map((s) => (
                      <button
                        key={s.id}
                        onClick={() => setConfig({ ...config, scaleTier: s.id as any })}
                        className={`p-3 rounded-xl border text-left transition ${
                          config.scaleTier === s.id
                            ? "bg-blue-600/20 border-blue-500 text-white"
                            : "bg-gray-900/50 border-gray-800 text-gray-400 hover:border-gray-700"
                        }`}
                      >
                        <div className="text-xs font-bold">{s.label}</div>
                        <div className="text-[10px] text-gray-500 mt-0.5">{s.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Tech Stack Selection */}
                <div className="glass-panel p-6 rounded-2xl space-y-5">
                  <h3 className="text-base font-semibold text-white flex items-center gap-2">
                    <Cpu className="w-4 h-4 text-blue-400" />
                    2. Select Architecture Components
                  </h3>

                  {/* Frontend */}
                  <div>
                    <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-2">
                      Client & Frontend Layer
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {[
                        "Next.js 15 App Router",
                        "React 19 Server Components",
                        "Tailwind CSS",
                        "React Native (Mobile)",
                        "Flutter SDK",
                      ].map((item) => (
                        <button
                          key={item}
                          onClick={() => toggleArrayItem("selectedFrontend", item)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition ${
                            config.selectedFrontend.includes(item)
                              ? "bg-blue-600/20 border-blue-500 text-blue-300"
                              : "bg-gray-900/40 border-gray-800 text-gray-400 hover:border-gray-700"
                          }`}
                        >
                          {config.selectedFrontend.includes(item) ? "✓ " : "+ "}
                          {item}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Backend & Compute */}
                  <div>
                    <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-2">
                      Backend & Compute Tier
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {[
                        "FastAPI (Python)",
                        "Node.js (TypeScript)",
                        "Go Microservices",
                        "Docker / ECS Containerized",
                        "Serverless Workers",
                      ].map((item) => (
                        <button
                          key={item}
                          onClick={() => toggleArrayItem("selectedBackend", item)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition ${
                            config.selectedBackend.includes(item)
                              ? "bg-blue-600/20 border-blue-500 text-blue-300"
                              : "bg-gray-900/40 border-gray-800 text-gray-400 hover:border-gray-700"
                          }`}
                        >
                          {config.selectedBackend.includes(item) ? "✓ " : "+ "}
                          {item}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Database & Caching */}
                  <div>
                    <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-2">
                      Database & Caching Layer
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {[
                        "PostgreSQL",
                        "Prisma ORM",
                        "Redis Caching",
                        "Vector DB (pgvector)",
                        "Supabase / Managed SQL",
                      ].map((item) => (
                        <button
                          key={item}
                          onClick={() => toggleArrayItem("selectedDatabase", item)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition ${
                            config.selectedDatabase.includes(item)
                              ? "bg-emerald-600/20 border-emerald-500 text-emerald-300"
                              : "bg-gray-900/40 border-gray-800 text-gray-400 hover:border-gray-700"
                          }`}
                        >
                          {config.selectedDatabase.includes(item) ? "✓ " : "+ "}
                          {item}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* AI & Automation */}
                  <div>
                    <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-2">
                      AI & Automation Capabilities
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {[
                        "Autonomous Multi-Agent Workflow",
                        "RAG & Knowledge Index",
                        "Multi-Modal Vision (OCR/Doc)",
                        "Fine-Tuned Small Language Models",
                      ].map((item) => (
                        <button
                          key={item}
                          onClick={() => toggleArrayItem("selectedAI", item)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition ${
                            config.selectedAI.includes(item)
                              ? "bg-purple-600/20 border-purple-500 text-purple-300"
                              : "bg-gray-900/40 border-gray-800 text-gray-400 hover:border-gray-700"
                          }`}
                        >
                          {config.selectedAI.includes(item) ? "✓ " : "+ "}
                          {item}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Cynbit Ecosystem Software */}
                  <div>
                    <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-2">
                      Cynbit Software Suite Integrations
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {[
                        "Cynbit Studio Evaluation",
                        "TenantEase Rent & Lease Engine",
                        "Revio Review & Sentiment Engine",
                        "BitElevate Curriculum",
                      ].map((item) => (
                        <button
                          key={item}
                          onClick={() => toggleArrayItem("cynbitIntegrations", item)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition ${
                            config.cynbitIntegrations.includes(item)
                              ? "bg-sky-600/20 border-sky-400 text-sky-200"
                              : "bg-gray-900/40 border-gray-800 text-gray-400 hover:border-gray-700"
                          }`}
                        >
                          {config.cynbitIntegrations.includes(item) ? "✓ " : "+ "}
                          {item}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Topology Map Tab */}
            {activeTab === "topology" && (
              <div className="glass-panel p-6 rounded-2xl space-y-6">
                <div>
                  <h3 className="text-base font-semibold text-white flex items-center gap-2">
                    <Server className="w-4 h-4 text-blue-400" />
                    Dynamic Architecture Topology Visualizer
                  </h3>
                  <p className="text-xs text-gray-400 mt-1">
                    Real-time visual map reflecting your configured tiers and component data flows.
                  </p>
                </div>

                <div className="space-y-4">
                  {/* Tier 1 */}
                  <div className="p-4 rounded-xl bg-gray-900/70 border border-gray-800">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-blue-400 block mb-2">
                      Client & Presentation Tier
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {estimate.architectureTopology.clientTier.map((c) => (
                        <span key={c} className="px-2.5 py-1 rounded bg-blue-900/30 border border-blue-700/50 text-blue-300 text-xs">
                          {c}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-center text-gray-600 font-mono text-xs">▼ HTTPS / WAF Traffic ▼</div>

                  {/* Tier 2 */}
                  <div className="p-4 rounded-xl bg-gray-900/70 border border-gray-800">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-sky-400 block mb-2">
                      Edge Gateway & Security Tier
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {estimate.architectureTopology.edgeGatewayTier.map((c) => (
                        <span key={c} className="px-2.5 py-1 rounded bg-sky-900/30 border border-sky-700/50 text-sky-300 text-xs">
                          {c}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-center text-gray-600 font-mono text-xs">▼ Load Balanced / VPC Network ▼</div>

                  {/* Tier 3 */}
                  <div className="p-4 rounded-xl bg-gray-900/70 border border-gray-800">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-purple-400 block mb-2">
                      Compute & Business Logic Tier
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {estimate.architectureTopology.computeTier.map((c) => (
                        <span key={c} className="px-2.5 py-1 rounded bg-purple-900/30 border border-purple-700/50 text-purple-300 text-xs">
                          {c}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-center text-gray-600 font-mono text-xs">▼ Persistence & AI Pipelines ▼</div>

                  {/* Tier 4 */}
                  <div className="p-4 rounded-xl bg-gray-900/70 border border-gray-800">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 block mb-2">
                      Data, Vector & Ecosystem Services
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {estimate.architectureTopology.dataAndAiTier.map((c) => (
                        <span key={c} className="px-2.5 py-1 rounded bg-emerald-900/30 border border-emerald-700/50 text-emerald-300 text-xs">
                          {c}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* AI Assistant Tab */}
            {activeTab === "ai_assistant" && (
              <div className="glass-panel p-6 rounded-2xl flex flex-col h-[520px]">
                <div className="border-b border-gray-800 pb-3 mb-4">
                  <h3 className="text-base font-semibold text-white flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-purple-400" />
                    Aria Architecture Assistant
                  </h3>
                  <p className="text-xs text-gray-400">
                    Ask questions about your tech stack choices, trade-offs, and Cynbit implementations.
                  </p>
                </div>

                {/* Message Log */}
                <div className="flex-1 overflow-y-auto space-y-3 pr-2">
                  {chatHistory.map((msg, i) => (
                    <div
                      key={i}
                      className={`p-3 rounded-xl text-xs leading-relaxed ${
                        msg.sender === "You"
                          ? "bg-blue-600/30 border border-blue-500/40 text-white ml-8"
                          : "bg-gray-900 border border-gray-800 text-gray-300 mr-8"
                      }`}
                    >
                      <span className="font-bold text-[10px] block text-gray-400 mb-1">{msg.sender}</span>
                      {msg.text}
                      {msg.recs && (
                        <ul className="mt-2 space-y-1 list-disc list-inside text-sky-400">
                          {msg.recs.map((r, idx) => (
                            <li key={idx}>{r}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                  {isChatLoading && (
                    <div className="p-3 rounded-xl text-xs bg-gray-900 border border-gray-800 text-gray-400 animate-pulse">
                      Aria is synthesizing architectural recommendations...
                    </div>
                  )}
                </div>

                {/* Chat Input */}
                <div className="mt-4 flex gap-2">
                  <input
                    type="text"
                    value={chatMessage}
                    onChange={(e) => setChatMessage(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                    placeholder="e.g. How can we minimize cloud cost for multi-agent workflows?"
                    className="flex-1 bg-gray-900 border border-gray-800 rounded-xl px-3 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={isChatLoading}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition disabled:opacity-50"
                  >
                    <Send className="w-3.5 h-3.5" />
                    Send
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Right Column (5 cols): Real-Time Estimation Deck */}
          <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-24">
            <div className="glass-panel p-6 rounded-2xl border-blue-500/30 space-y-6">
              <div className="flex items-center justify-between border-b border-gray-800 pb-4">
                <div>
                  <h3 className="text-lg font-bold text-white">Project Estimates</h3>
                  <p className="text-xs text-gray-400">Instant algorithmic projection</p>
                </div>
                <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                  {estimate.feasibilityRating} Feasibility
                </span>
              </div>

              {/* Stat Cards */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-4 rounded-xl bg-gray-900/60 border border-gray-800">
                  <div className="flex items-center gap-1.5 text-xs text-gray-400 mb-1">
                    <Calendar className="w-3.5 h-3.5 text-blue-400" />
                    Timeline
                  </div>
                  <div className="text-xl font-black text-white">
                    {estimate.estimatedWeeksMin}–{estimate.estimatedWeeksMax} <span className="text-xs font-normal text-gray-400">weeks</span>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-gray-900/60 border border-gray-800">
                  <div className="flex items-center gap-1.5 text-xs text-gray-400 mb-1">
                    <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
                    Est. Investment
                  </div>
                  <div className="text-xl font-black text-white">
                    ${(estimate.estimatedCostUsdMin / 1000).toFixed(0)}k–${(estimate.estimatedCostUsdMax / 1000).toFixed(0)}k
                  </div>
                  <div className="text-[10px] text-gray-400">
                    ₹{(estimate.estimatedCostInrMin / 100000).toFixed(1)}L–₹{(estimate.estimatedCostInrMax / 100000).toFixed(1)}L INR
                  </div>
                </div>
              </div>

              {/* Monthly Cloud OPEX & Complexity */}
              <div className="p-4 rounded-xl bg-gray-900/40 border border-gray-800 space-y-3">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-gray-400">Estimated Monthly Cloud OPEX:</span>
                  <span className="font-bold text-white">${estimate.monthlyCloudOpexUsd} / mo</span>
                </div>
                <div>
                  <div className="flex justify-between items-center text-xs mb-1">
                    <span className="text-gray-400">System Complexity Score:</span>
                    <span className="font-bold text-blue-400">{estimate.complexityScore} / 100</span>
                  </div>
                  <div className="w-full bg-gray-800 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-blue-500 to-purple-500 h-full transition-all duration-300"
                      style={{ width: `${estimate.complexityScore}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Team Composition */}
              <div>
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-2">
                  Recommended Team Composition
                </span>
                <ul className="space-y-1.5">
                  {estimate.teamComposition.map((m, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-xs text-gray-300">
                      <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 flex-shrink-0" />
                      {m}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-col gap-2">
                <button
                  onClick={copyBlueprint}
                  className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 active:scale-[0.99] text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-lg shadow-blue-600/30 transition"
                >
                  <FileText className="w-4 h-4" />
                  {copiedBlueprint ? "Copied Architectural Blueprint!" : "Copy Scoping Blueprint"}
                </button>
                <a
                  href="https://cynbit.in/contact"
                  target="_blank"
                  rel="noreferrer"
                  className="w-full py-2.5 bg-gray-900 hover:bg-gray-800 text-gray-300 rounded-xl text-xs font-medium flex items-center justify-center gap-1.5 border border-gray-800 transition"
                >
                  Schedule Architecture Review with Cynbit Team
                  <ArrowRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-800/80 mt-12 py-6 text-center text-xs text-gray-500">
        Cynbit Technologies Full Stack Engineering Assessment Prototype • Implemented by Naman Kalia
      </footer>
    </div>
  );
}
