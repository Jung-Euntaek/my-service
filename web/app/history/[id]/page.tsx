"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

type HistoryDetail = {
  id: number;
  timestamp: string;
  action: string;
  model: string;
  input: string;
  output: string;
};

export default function HistoryDetailPage() {
  const params = useParams<{ id: string }>();
  const id = params?.id;

  const [row, setRow] = useState<HistoryDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    if (!id) return;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/history/${id}`);
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.detail ?? `HTTP ${res.status}`);
      }
      const data = await res.json();
      setRow(data);
    } catch (e: any) {
      setError(e?.message ?? "불러오기 실패");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!id) return;
    load();
  }, [id]);

  return (
    <main className="min-h-screen p-8 max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">History Detail</h1>
        <Link className="underline" href="/history">
          ← 목록
        </Link>
      </div>

      {loading && <div>불러오는 중...</div>}

      {error && (
        <div className="mt-4 p-3 border rounded bg-red-50 text-red-700">
          에러: {error}
        </div>
      )}

      {!loading && !error && row && (
        <div className="space-y-4">
          <div className="border rounded p-4">
            <div className="text-sm text-gray-500">{row.timestamp}</div>
            <div className="mt-1 font-semibold">
              {row.action} · {row.model} (id: {row.id})
            </div>
          </div>

          <div className="border rounded p-4">
            <h2 className="font-semibold mb-2">입력(원문)</h2>
            <pre className="whitespace-pre-wrap text-sm">{row.input}</pre>
          </div>

          <div className="border rounded p-4 bg-gray-50">
            <h2 className="font-semibold mb-2">출력(결과)</h2>
            <pre className="whitespace-pre-wrap text-sm">{row.output}</pre>
          </div>
        </div>
      )}
    </main>
  );
}
