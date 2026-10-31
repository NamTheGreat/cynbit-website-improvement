import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const ScopingMessageSchema = z.object({
  message: z.string().trim().min(2).max(1000),
  currentConfig: z.record(z.any()).optional(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => null);
    const parsed = ScopingMessageSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "VALIDATION_ERROR", details: parsed.error.flatten().fieldErrors },
        { status: 422 }
      );
    }

    const { message } = parsed.data;
    const lower = message.toLowerCase();

    let reply = "";
    const recommendations: string[] = [];

    if (lower.includes("ai") || lower.includes("agent") || lower.includes("llm")) {
      reply = "For autonomous agent workflows, we recommend pairing FastAPI with Redis message queues and a multi-agent orchestration pattern (e.g., LangGraph or custom state graphs). We also advise implementing strict token-budget limits and a deterministic AST pre-validation layer.";
      recommendations.push("Deploy a separate asynchronous worker tier for long-running LLM inference.");
      recommendations.push("Incorporate semantic caching with Redis to cut recurring inference bills by ~40%.");
    } else if (lower.includes("security") || lower.includes("auth") || lower.includes("safe")) {
      reply = "For enterprise-grade security, our architectural blueprint incorporates 256-bit HMAC-signed session cookies (HttpOnly, Secure, SameSite=Lax), automated SSRF loopback CIDR filtering, and strict Zod runtime schema boundaries.";
      recommendations.push("Enforce private CIDR IP rejection (127.0.0.0/8, 169.254.169.254) on all outbound webhook calls.");
      recommendations.push("Use UUIDv7 keys to eliminate predictable CUIDv1 sequence enumeration.");
    } else if (lower.includes("cost") || lower.includes("budget") || lower.includes("cheap")) {
      reply = "To optimize your initial burn, we suggest an MVP architecture on Vercel Edge + managed PostgreSQL (Supabase/Neon) with Redis caching. You can scale seamlessly to containerized AWS ECS or Kubernetes as throughput increases.";
      recommendations.push("Start with serverless edge compute to minimize idle runtime costs.");
    } else {
      reply = `Thank you for your inquiry about "${message}". At Cynbit Technologies, our architectural team specializes in optimistic architectures, event-driven microservices, and AI-first digital platforms. Based on your inputs, we can deliver a production-ready milestone within 6 to 10 weeks.`;
      recommendations.push("Schedule an in-depth architecture whiteboarding session with our lead architects in Jaipur.");
    }

    return NextResponse.json({
      agent: "Aria Architecture Assistant",
      reply,
      recommendations,
      timestamp: new Date().toISOString(),
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Scoping error";
    return NextResponse.json({ error: "INTERNAL_ERROR", message }, { status: 500 });
  }
}
