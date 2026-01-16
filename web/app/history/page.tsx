"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type HistoryItem = {
  id: number;
  timestamp: string;
  action: string;
  model: string;
};

export default function HistoryPage() {
  const [items, setItems] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/history");
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.detail ?? `HTTP ${res.status}`);
      }
      const data = await res.json();
      setItems(data.items ?? []);
    } catch (e: any) {
      setError(e?.message ?? "불러오기 실패");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <main className="min-h-screen p-8 max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">History</h1>
        <Link className="underline" href="/">
          ← 홈
        </Link>
      </div>

      <div className="mb-4">
        <button
          className="px-4 py-2 rounded bg-black text-white disabled:opacity-50"
          onClick={load}
          disabled={loading}
        >
          {loading ? "불러오는 중..." : "새로고침"}
        </button>
      </div>

      {error && (
        <div className="mt-4 p-3 border rounded bg-red-50 text-red-700">
          에러: {error}
        </div>
      )}

      {!loading && !error && items.length === 0 && (
        <div className="p-4 border rounded bg-gray-50">기록이 없습니다.</div>
      )}

      <ul className="space-y-3">
        {items.map((it) => (
          <li key={it.id} className="border rounded p-4">
            <div className="text-sm text-gray-500">{it.timestamp}</div>
            <div className="mt-1 flex items-center justify-between">
              <div>
                <div className="font-semibold">
                  {it.action} · {it.model}
                </div>
                <div className="text-sm text-gray-600">id: {it.id}</div>
              </div>
              <Link className="underline" href={`/history/${it.id}`}>
                상세 →
              </Link>
            </div>
          </li>
        ))}
      </ul>
    </main>
  );
}
