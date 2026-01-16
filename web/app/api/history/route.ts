import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const base = process.env.API_BASE_URL;
  if (!base) {
    return new Response(
      JSON.stringify({ detail: "API_BASE_URL is not set" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  };
  const url = new URL(req.url);

  const res = await fetch(`${base}/api/history?${url.searchParams.toString()}`, {
    method: "GET",
  });

  const text = await res.text();
  return new NextResponse(text, {
    status: res.status,
    headers: { "Content-Type": res.headers.get("content-type") ?? "application/json" },
  });
}
