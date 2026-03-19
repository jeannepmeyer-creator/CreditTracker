"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { TIER_OPTIONS } from "@/lib/tiers";

export default function ClientForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [tier, setTier] = useState<number>(12);

  const tierDefaults: Record<number, { startDate: string; endDate: string; totalCredits: number }> = {
    12: { startDate: "2025-05-15", endDate: "2025-09-15", totalCredits: 12 },
    24: { startDate: "2025-05-15", endDate: "2025-09-15", totalCredits: 24 },
    36: { startDate: "2025-05-15", endDate: "2025-11-15", totalCredits: 36 },
  };

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const fd = new FormData(e.currentTarget);
    const res = await fetch("/api/admin/clients", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: fd.get("name"),
        email: fd.get("email"),
        company: fd.get("company") || undefined,
        tier: Number(fd.get("tier")),
        totalCredits: Number(fd.get("totalCredits")),
        startDate: fd.get("startDate"),
        endDate: fd.get("endDate"),
      }),
    });

    if (res.ok) {
      const client = await res.json();
      router.push(`/admin/clients/${client.id}`);
    } else {
      const data = await res.json();
      setError(data.error ?? "Something went wrong");
      setLoading(false);
    }
  }

  const defaults = tierDefaults[tier];

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-200 p-6 space-y-5 max-w-lg">
      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2">
          <label className="block text-sm font-medium text-slate-700 mb-1">Full Name *</label>
          <input name="name" required className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500" />
        </div>
        <div className="col-span-2">
          <label className="block text-sm font-medium text-slate-700 mb-1">Email *</label>
          <input name="email" type="email" required className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500" />
        </div>
        <div className="col-span-2">
          <label className="block text-sm font-medium text-slate-700 mb-1">Company / Organization</label>
          <input name="company" className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500" />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Subscription Tier *</label>
          <select
            name="tier"
            value={tier}
            onChange={(e) => setTier(Number(e.target.value))}
            className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
          >
            {TIER_OPTIONS.map((t) => (
              <option key={t} value={t}>{t} credits</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Total Credits *</label>
          <input
            name="totalCredits"
            type="number"
            min={1}
            defaultValue={defaults.totalCredits}
            key={`tc-${tier}`}
            required
            className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Program Start *</label>
          <input
            name="startDate"
            type="date"
            defaultValue={defaults.startDate}
            key={`sd-${tier}`}
            required
            className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Program End *</label>
          <input
            name="endDate"
            type="date"
            defaultValue={defaults.endDate}
            key={`ed-${tier}`}
            required
            className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
        </div>
      </div>

      {error && <p className="text-red-600 text-sm">{error}</p>}

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={loading}
          className="bg-teal-600 text-white px-5 py-2 rounded-lg font-medium text-sm hover:bg-teal-700 disabled:opacity-50 transition-colors"
        >
          {loading ? "Creating…" : "Create Client"}
        </button>
        <a href="/admin" className="px-5 py-2 rounded-lg text-sm text-slate-600 hover:bg-slate-100 transition-colors">
          Cancel
        </a>
      </div>
    </form>
  );
}
