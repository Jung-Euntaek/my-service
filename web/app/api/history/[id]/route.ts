import { NextResponse } from "next/server";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const base = process.env.NEXT_PUBLIC_API_BASE_URL!;
  const res = await fetch(`${base}/api/history/${id}`, { cache: "no-store" });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    return NextResponse.json(
      { detail: data?.detail ?? `HTTP ${res.status}` },
      { status: res.status }
    );
  }

  return NextResponse.json(data);
}
