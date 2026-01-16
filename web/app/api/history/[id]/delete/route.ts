import { NextResponse } from "next/server";

export async function POST(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const base = process.env.API_BASE_URL;
  if (!base) {
    return new Response(
      JSON.stringify({ detail: "API_BASE_URL is not set" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  };
  const res = await fetch(`${base}/api/history/${id}/delete`, {
    method: "POST",
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    return NextResponse.json(
      { detail: data?.detail ?? `HTTP ${res.status}` },
      { status: res.status }
    );
  }

  return NextResponse.json(data);
}
