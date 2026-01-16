import { NextResponse } from "next/server";

export async function POST(
  _req: Request,
  { params }: { params: { id: string } }
) {
  const base = process.env.NEXT_PUBLIC_API_BASE_URL!;
  const res = await fetch(`${base}/api/history/${params.id}/delete`, {
    method: "POST",
  });

  const text = await res.text();
  return new NextResponse(text, {
    status: res.status,
    headers: { "Content-Type": res.headers.get("content-type") ?? "application/json" },
  });
}
