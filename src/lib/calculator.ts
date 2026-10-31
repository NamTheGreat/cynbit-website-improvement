import { z } from "zod";

export const ProjectTypeEnum = z.enum([
  "AI_AGENTS",
  "ENTERPRISE_SAAS",
  "FULLSTACK_WEB_MOBILE",
  "CLOUD_MIGRATION",
]);

export const ScaleTierEnum = z.enum(["MVP", "GROWTH", "ENTERPRISE"]);

export const ArchitectureConfigSchema = z.object({
  projectName: z.string().min(2).max(100).default("My Next Project"),
  projectType: ProjectTypeEnum.default("AI_AGENTS"),
  scaleTier: ScaleTierEnum.default("GROWTH"),
  selectedFrontend: z.array(z.string()).default(["Next.js 15 App Router", "Tailwind CSS"]),
  selectedBackend: z.array(z.string()).default(["FastAPI (Python)", "Node.js (TypeScript)"]),
  selectedDatabase: z.array(z.string()).default(["PostgreSQL", "Redis", "Vector DB (pgvector)"]),
  selectedAI: z.array(z.string()).default(["Autonomous Multi-Agent Workflow", "RAG & Knowledge Index"]),
  cynbitIntegrations: z.array(z.string()).default(["Cynbit Studio Evaluation"]),
  securityLevel: z.enum(["Standard", "Enterprise Hardened"]).default("Enterprise Hardened"),
});

export type ArchitectureConfig = z.infer<typeof ArchitectureConfigSchema>;

export interface EstimationResult {
  estimatedWeeksMin: number;
  estimatedWeeksMax: number;
  estimatedCostUsdMin: number;
  estimatedCostUsdMax: number;
  estimatedCostInrMin: number;
  estimatedCostInrMax: number;
  monthlyCloudOpexUsd: number;
  teamComposition: string[];
  architectureTopology: {
    clientTier: string[];
    edgeGatewayTier: string[];
    computeTier: string[];
    dataAndAiTier: string[];
    messagingTier: string[];
  };
  complexityScore: number; // 0 to 100
  feasibilityRating: "High" | "Optimal" | "Requires Phased Rollout";
}

export function calculateArchitectureEstimate(config: ArchitectureConfig): EstimationResult {
  let baseWeeks = 4;
  let baseCostUsd = 6000;
  let monthlyCloudOpex = 120;
  let complexity = 30;

  // 1. Project Type Impact
  if (config.projectType === "AI_AGENTS") {
    baseWeeks += 4;
    baseCostUsd += 8000;
    monthlyCloudOpex += 250;
    complexity += 25;
  } else if (config.projectType === "ENTERPRISE_SAAS") {
    baseWeeks += 6;
    baseCostUsd += 10000;
    monthlyCloudOpex += 180;
    complexity += 20;
  } else if (config.projectType === "FULLSTACK_WEB_MOBILE") {
    baseWeeks += 5;
    baseCostUsd += 7500;
    monthlyCloudOpex += 100;
    complexity += 15;
  }

  // 2. Scale Tier Multiplier
  const scaleMultiplier = config.scaleTier === "ENTERPRISE" ? 1.8 : config.scaleTier === "GROWTH" ? 1.3 : 1.0;

  // 3. Components Impact
  const totalComponents =
    config.selectedFrontend.length +
    config.selectedBackend.length +
    config.selectedDatabase.length +
    config.selectedAI.length +
    config.cynbitIntegrations.length;

  baseWeeks += Math.floor(totalComponents * 0.4);
  baseCostUsd += totalComponents * 650;
  complexity += totalComponents * 3;

  if (config.securityLevel === "Enterprise Hardened") {
    baseWeeks += 2;
    baseCostUsd += 3000;
    complexity += 10;
  }

  const finalWeeksMin = Math.round(baseWeeks * scaleMultiplier);
  const finalWeeksMax = Math.round(finalWeeksMin * 1.35);

  const finalCostUsdMin = Math.round((baseCostUsd * scaleMultiplier) / 500) * 500;
  const finalCostUsdMax = Math.round((finalCostUsdMin * 1.3) / 500) * 500;

  const usdToInr = 85.0;
  const finalCostInrMin = finalCostUsdMin * usdToInr;
  const finalCostInrMax = finalCostUsdMax * usdToInr;

  const cloudOpex = Math.round(monthlyCloudOpex * scaleMultiplier);

  // Recommended team
  const teamComposition = [
    "1x Lead Software & AI Architect",
    config.scaleTier === "ENTERPRISE" ? "3x Full Stack Engineers" : "2x Full Stack Engineers",
  ];
  if (config.selectedAI.length > 0) {
    teamComposition.push("1x Applied AI/ML Engineer");
  }
  if (config.securityLevel === "Enterprise Hardened") {
    teamComposition.push("1x QA & Security Auditor (Part-time)");
  }

  // Architecture Topology Layout
  const architectureTopology = {
    clientTier: [...config.selectedFrontend, "Tailwind Responsive Client"],
    edgeGatewayTier: ["Cloudflare / Vercel Edge", "SSL / HSTS & WAF Rate Limiter"],
    computeTier: [...config.selectedBackend, "Docker / Serverless Containers"],
    dataAndAiTier: [...config.selectedDatabase, ...config.selectedAI],
    messagingTier: ["Transactional Outbox Queue", ...config.cynbitIntegrations],
  };

  const feasibilityRating =
    complexity < 50 ? "High" : complexity < 80 ? "Optimal" : "Requires Phased Rollout";

  return {
    estimatedWeeksMin: finalWeeksMin,
    estimatedWeeksMax: finalWeeksMax,
    estimatedCostUsdMin: finalCostUsdMin,
    estimatedCostUsdMax: finalCostUsdMax,
    estimatedCostInrMin: finalCostInrMin,
    estimatedCostInrMax: finalCostInrMax,
    monthlyCloudOpexUsd: cloudOpex,
    teamComposition,
    architectureTopology,
    complexityScore: Math.min(100, complexity),
    feasibilityRating,
  };
}

/**
 * Contextual architectural recommendation engine used by both API and client-side fallback.
 */
export function getScopingAdvice(message: string): { reply: string; recommendations: string[] } {
  const lower = message.toLowerCase();
  const recommendations: string[] = [];
  let reply = "";

  if (lower.includes("ai") || lower.includes("agent") || lower.includes("llm")) {
    reply =
      "For autonomous agent workflows, we recommend pairing FastAPI with Redis message queues and a multi-agent orchestration pattern (e.g., LangGraph or custom state graphs). We also advise implementing strict token-budget limits and a deterministic AST pre-validation layer.";
    recommendations.push("Deploy a separate asynchronous worker tier for long-running LLM inference.");
    recommendations.push("Incorporate semantic caching with Redis to cut recurring inference bills by ~40%.");
  } else if (lower.includes("security") || lower.includes("auth") || lower.includes("safe")) {
    reply =
      "For enterprise-grade security, our architectural blueprint incorporates 256-bit HMAC-signed session cookies (HttpOnly, Secure, SameSite=Lax), automated SSRF loopback CIDR filtering, and strict Zod runtime schema boundaries.";
    recommendations.push("Enforce private CIDR IP rejection (127.0.0.0/8, 169.254.169.254) on all outbound webhook calls.");
    recommendations.push("Use UUIDv7 keys to eliminate predictable CUIDv1 sequence enumeration.");
  } else if (lower.includes("cost") || lower.includes("budget") || lower.includes("cheap")) {
    reply =
      "To optimize your initial burn, we suggest an MVP architecture on Vercel Edge + managed PostgreSQL (Supabase/Neon) with Redis caching. You can scale seamlessly to containerized AWS ECS or Kubernetes as throughput increases.";
    recommendations.push("Start with serverless edge compute to minimize idle runtime costs.");
  } else {
    reply = `Thank you for your inquiry about "${message}". At Cynbit Technologies, our architectural team specializes in optimistic architectures, event-driven microservices, and AI-first digital platforms. Based on your inputs, we can deliver a production-ready milestone within 6 to 10 weeks.`;
    recommendations.push("Schedule an in-depth architecture whiteboarding session with our lead architects in Jaipur.");
  }

  return { reply, recommendations };
}
