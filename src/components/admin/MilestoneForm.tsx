"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function MilestoneForm({ clientId }: { clientId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const fd = new FormData(e.currentTarget);
    const res = await fetch(`/api/admin/clients/${clientId}/milestones`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        label: fd.get("label"),
        amount: Number(fd.get("amount")),
        dueDate: fd.get("dueDate"),
        notes: fd.get("notes") || null,
      }),
    });

    if (res.ok) {
      (e.target as HTMLFormElement).reset();
      router.refresh();
    } else {
      setError("Failed to add milestone.");
    }
    setLoading(false);
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-3 items-end flex-wrap">
      <div className="flex-1 min-w-36">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Label *
        </label>
        <input
          name="label"
          required
          placeholder="e.g. Installment 2"
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand/40 focus:border-brand"
        />
      </div>
      <div className="w-28">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Amount ($) *
        </label>
        <input
          name="amount"
          type="number"
          min={0}
          step="0.01"
          required
          placeholder="2200"
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand/40 focus:border-brand"
        />
      </div>
      <div className="w-40">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Due Date *
        </label>
        <input
          name="dueDate"
          type="date"
          required
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand/40 focus:border-brand"
        />
      </div>
      <div>
        {error && <p className="text-red-600 text-sm mb-1">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="bg-brand hover:bg-brand-dark text-white px-5 py-2 rounded-lg font-semibold text-sm disabled:opacity-50 transition-colors"
        >
          {loading ? "Adding…" : "Add Milestone"}
        </button>
      </div>
    </form>
  );
}
