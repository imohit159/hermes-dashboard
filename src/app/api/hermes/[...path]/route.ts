import { NextRequest, NextResponse } from "next/server";
import http from "node:http";

const HERMES_HOST = "127.0.0.1";
const HERMES_PORT = 8642;
const HERMES_KEY = "hermes-dashboard-key";

function hermesRequest(method: string, path: string, body?: string): Promise<{ status: number; data: string }> {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: HERMES_HOST,
      port: HERMES_PORT,
      path,
      method,
      headers: {
        Authorization: `Bearer ${HERMES_KEY}`,
        "Content-Type": "application/json",
      },
    };

    const proxy = http.request(options, (res) => {
      let data = "";
      res.on("data", (chunk) => (data += chunk));
      res.on("end", () => resolve({ status: res.statusCode || 200, data }));
    });

    proxy.on("error", reject);
    if (body) proxy.write(body);
    proxy.end();
  });
}

export async function GET(req: NextRequest) {
  try {
    const search = req.nextUrl.searchParams.toString();
    const path = req.nextUrl.pathname.replace("/api/hermes", "");
    const url = `${path}${search ? `?${search}` : ""}`;
    const { status, data } = await hermesRequest("GET", url);
    return new Response(data, { status, headers: { "Content-Type": "application/json" } });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const search = req.nextUrl.searchParams.toString();
    const path = req.nextUrl.pathname.replace("/api/hermes", "");
    const url = `${path}${search ? `?${search}` : ""}`;
    const body = await req.text();
    const { status, data } = await hermesRequest("POST", url, body);
    return new Response(data, { status, headers: { "Content-Type": "application/json" } });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
