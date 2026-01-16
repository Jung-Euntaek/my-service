import { NextResponse } from "next/server";

export async function GET(
  _req: Request,
  { params }: { params: { id: string } }
) {
  const base = process.env.NEXT_PUBLIC_API_BASE_URL;

  if (!base) {
    return NextResponse.json(
      { detail: "NEXT_PUBLIC_API_BASE_URL is not set" },
      { status: 500 }
    );
  }

  const res = await fetch(`${base}/api/history/${params.id}`, {
    method: "GET",
  });

  const data = await res.json().catch(() => ({}));
  return NextResponse.json(data, { status: res.status });
}
