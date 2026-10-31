import { NextRequest, NextResponse } from "next/server";
import { ArchitectureConfigSchema, calculateArchitectureEstimate } from "@/lib/calculator";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => null);
    const parsed = ArchitectureConfigSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "VALIDATION_ERROR", details: parsed.error.flatten().fieldErrors },
        { status: 422 }
      );
    }

    const estimate = calculateArchitectureEstimate(parsed.data);

    return NextResponse.json({
      config: parsed.data,
      estimate,
      timestamp: new Date().toISOString(),
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Estimation error";
    return NextResponse.json({ error: "INTERNAL_ERROR", message }, { status: 500 });
  }
}
