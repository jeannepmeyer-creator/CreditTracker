"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function TransactionForm({ clientId }: { clientId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const today = new Date().toISOString().split("T")[0];

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const fd = new FormData(e.currentTarget);
    const res = await fetch(`/api/admin/clients/${clientId}/transactions`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        description: fd.get("description"),
        creditsUsed: Number(fd.get("creditsUsed")),
        date: fd.get("date"),
      }),
    });

    if (res.ok) {
      (e.target as HTMLFormElement).reset();
      router.refresh();
    } else {
      const data = await res.json();
      setError(data.error ?? "Something went wrong");
    }
    setLoading(false);
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-3 items-end flex-wrap">
      <div className="flex-1 min-w-48">
        <label className="block text-sm font-medium text-slate-700 mb-1">Description *</label>
        <input
          name="description"
          required
          placeholder="e.g. Weekly check-in, Media training review"
          className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
        />
      </div>
      <div className="w-28">
        <label className="block text-sm font-medium text-slate-700 mb-1">Credits Used *</label>
        <input
          name="creditsUsed"
          type="number"
          min={1}
          defaultValue={1}
          required
          className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
        />
      </div>
      <div className="w-40">
        <label className="block text-sm font-medium text-slate-700 mb-1">Date</label>
        <input
          name="date"
          type="date"
          defaultValue={today}
          className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
        />
      </div>
      <div>
        {error && <p className="text-red-600 text-sm mb-1">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="bg-teal-600 text-white px-5 py-2 rounded-lg font-medium text-sm hover:bg-teal-700 disabled:opacity-50 transition-colors"
        >
          {loading ? "Logging…" : "Log Usage"}
        </button>
      </div>
    </form>
  );
}
