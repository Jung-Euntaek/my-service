import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const base = process.env.NEXT_PUBLIC_API_BASE_URL!;
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
