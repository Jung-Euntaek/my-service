export async function POST(req: Request) {
  const base = process.env.API_BASE_URL; // ✅ 서버 전용
  if (!base) {
    return new Response(
      JSON.stringify({ detail: "API_BASE_URL is not set" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }

  const body = await req.json();

  const res = await fetch(`${base}/api/summarize`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const text = await res.text();
  return new Response(text, {
    status: res.status,
    headers: { "Content-Type": res.headers.get("content-type") ?? "application/json" },
  });
}
