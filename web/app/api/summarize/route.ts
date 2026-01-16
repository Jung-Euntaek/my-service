import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const base = process.env.NEXT_PUBLIC_API_BASE_URL!;
  const body = await req.json();

  const res = await fetch(`${base}/api/summarize`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const text = await res.text(); // 에러도 그대로 전달
  return new NextResponse(text, {
    status: res.status,
    headers: { "Content-Type": res.headers.get("content-type") ?? "application/json" },
  });
}
