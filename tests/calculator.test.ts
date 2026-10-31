import { describe, it, expect } from "vitest";
import {
  calculateArchitectureEstimate,
  ArchitectureConfigSchema,
  ArchitectureConfig,
} from "@/lib/calculator";

describe("Architecture Estimator Engine (Full Stack Website Improvement)", () => {
  it("calculates baseline estimates for MVP projects", () => {
    const config: ArchitectureConfig = {
      projectName: "Startup MVP",
      projectType: "FULLSTACK_WEB_MOBILE",
      scaleTier: "MVP",
      selectedFrontend: ["Next.js 15 App Router"],
      selectedBackend: ["Node.js (TypeScript)"],
      selectedDatabase: ["PostgreSQL"],
      selectedAI: [],
      cynbitIntegrations: [],
      securityLevel: "Standard",
    };

    const estimate = calculateArchitectureEstimate(config);
    expect(estimate.estimatedWeeksMin).toBeGreaterThan(0);
    expect(estimate.estimatedWeeksMax).toBeGreaterThan(estimate.estimatedWeeksMin);
    expect(estimate.estimatedCostUsdMin).toBeGreaterThan(0);
    expect(estimate.estimatedCostInrMin).toBeGreaterThan(0);
    expect(["High", "Optimal"]).toContain(estimate.feasibilityRating);
  });

  it("scales complexity and timeline for high-availability enterprise AI platforms", () => {
    const enterpriseConfig: ArchitectureConfig = {
      projectName: "Enterprise Multi-Agent Platform",
      projectType: "AI_AGENTS",
      scaleTier: "ENTERPRISE",
      selectedFrontend: ["Next.js 15 App Router", "Tailwind CSS"],
      selectedBackend: ["FastAPI (Python)", "Go Microservices", "Docker / ECS Containerized"],
      selectedDatabase: ["PostgreSQL", "Redis", "Vector DB (pgvector)"],
      selectedAI: ["Autonomous Multi-Agent Workflow", "RAG & Knowledge Index", "Multi-Modal Vision (OCR/Doc)"],
      cynbitIntegrations: ["Cynbit Studio Evaluation", "TenantEase Rent & Lease Engine", "Revio Review & Sentiment Engine"],
      securityLevel: "Enterprise Hardened",
    };

    const estimate = calculateArchitectureEstimate(enterpriseConfig);
    expect(estimate.complexityScore).toBeGreaterThan(60);
    expect(estimate.estimatedWeeksMin).toBeGreaterThan(10);
    expect(estimate.monthlyCloudOpexUsd).toBeGreaterThan(300);
    expect(estimate.teamComposition.length).toBeGreaterThanOrEqual(3);
    expect(estimate.architectureTopology.computeTier).toContain("FastAPI (Python)");
  });

  it("validates Zod configuration schema", () => {
    const valid = {
      projectName: "Custom System",
      projectType: "AI_AGENTS",
      scaleTier: "GROWTH",
      selectedFrontend: ["React 19"],
      selectedBackend: ["FastAPI"],
      selectedDatabase: ["PostgreSQL"],
      selectedAI: ["RAG"],
      cynbitIntegrations: [],
      securityLevel: "Standard",
    };

    const parseRes = ArchitectureConfigSchema.safeParse(valid);
    expect(parseRes.success).toBe(true);
  });
});
