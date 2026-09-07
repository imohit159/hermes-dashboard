import { NextRequest, NextResponse } from "next/server";

const HERMES_URL = process.env.HERMES_URL || "http://host.docker.internal:9119";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    const response = await fetch(`${HERMES_URL}/api/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const text = await response.text();
      return NextResponse.json({ error: text }, { status: response.status });
    }

    return new Response(response.body, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
