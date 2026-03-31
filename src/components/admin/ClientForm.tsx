"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ClientForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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
        company: fd.get("company"),
        totalCredits: Number(fd.get("totalCredits")),
        startDate: fd.get("startDate"),
        endDate: fd.get("endDate"),
        gracePeriodDays: 90,
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

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-200 p-6 space-y-5 max-w-lg">
      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Contact Name *</label>
          <input name="name" required className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand/40 focus:border-brand" />
        </div>
        <div className="col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
          <input name="email" type="email" required className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand/40 focus:border-brand" />
        </div>
        <div className="col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Company / Organization *</label>
          <input name="company" required className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand/40 focus:border-brand" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Total Credits *</label>
          <input name="totalCredits" type="number" min={1} defaultValue={24} required className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand/40 focus:border-brand" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Start Date *</label>
          <input name="startDate" type="date" required className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand/40 focus:border-brand" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">End Date *</label>
          <input name="endDate" type="date" required className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand/40 focus:border-brand" />
        </div>
      </div>

      {error && <p className="text-red-600 text-sm">{error}</p>}

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={loading}
          className="bg-brand hover:bg-brand-dark text-white px-5 py-2 rounded-lg font-semibold text-sm disabled:opacity-50 transition-colors"
        >
          {loading ? "Creating…" : "Create Client"}
        </button>
        <a href="/admin" className="px-5 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-100 transition-colors">
          Cancel
        </a>
      </div>
    </form>
  );
}
