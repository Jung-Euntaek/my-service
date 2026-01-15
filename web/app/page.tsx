"use client";

import { useState } from "react";

export default function Home() {
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL!;

  const [text, setText] = useState("");
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSummarize() {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch("/api/summarize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });


      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.detail ?? `HTTP ${res.status}`);
      }

      const data = await res.json();
      setResult(data.result);
    } catch (e: any) {
      setError(e.message ?? "요청 실패");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen p-8 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">AI 요약 도구</h1>

      <textarea
        className="w-full border rounded p-3 h-40"
        placeholder="요약할 텍스트를 입력하세요"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />

      <div className="mt-4 flex gap-2">
        <button
          className="px-4 py-2 rounded bg-black text-white disabled:opacity-50"
          onClick={onSummarize}
          disabled={loading || !text.trim()}
        >
          {loading ? "요약 중..." : "요약하기"}
        </button>
      </div>

      {error && (
        <div className="mt-4 p-3 border rounded bg-red-50 text-red-700">
          에러: {error}
        </div>
      )}

      {result && (
        <div className="mt-4 p-4 border rounded bg-gray-50">
          <h2 className="font-semibold mb-2">결과</h2>
          <p className="whitespace-pre-wrap">{result}</p>
        </div>
      )}
    </main>
  );
}
