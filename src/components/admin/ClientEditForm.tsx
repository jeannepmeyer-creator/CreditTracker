"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Props = {
  client: {
    id: string;
    name: string;
    email: string;
    company: string;
    totalCredits: number;
    startDate: string;
    endDate: string;
    gracePeriodDays: number;
  };
};

export default function ClientEditForm({ client }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSaved(false);

    const fd = new FormData(e.currentTarget);
    const res = await fetch(`/api/admin/clients/${client.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: fd.get("name"),
        email: fd.get("email"),
        company: fd.get("company"),
        totalCredits: Number(fd.get("totalCredits")),
        startDate: fd.get("startDate"),
        endDate: fd.get("endDate"),
        gracePeriodDays: Number(fd.get("gracePeriodDays")),
      }),
    });

    if (res.ok) {
      setSaved(true);
      router.refresh();
    } else {
      const data = await res.json();
      setError(data.error ?? "Something went wrong");
    }
    setLoading(false);
  }

  async function handleDelete() {
    if (!confirm(`Delete ${client.company}? This cannot be undone.`)) return;
    await fetch(`/api/admin/clients/${client.id}`, { method: "DELETE" });
    router.push("/admin");
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Contact Name</label>
          <input name="name" defaultValue={client.name} required className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand/40 focus:border-brand" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input name="email" type="text" defaultValue={client.email} required placeholder="email@example.com" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand/40 focus:border-brand" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Company</label>
          <input name="company" defaultValue={client.company} required className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand/40 focus:border-brand" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Total Credits</label>
          <input name="totalCredits" type="number" min={1} defaultValue={client.totalCredits} required className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand/40 focus:border-brand" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
          <input name="startDate" type="date" defaultValue={client.startDate} required className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand/40 focus:border-brand" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
          <input name="endDate" type="date" defaultValue={client.endDate} required className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand/40 focus:border-brand" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Grace Period (days)</label>
          <input name="gracePeriodDays" type="number" min={0} defaultValue={client.gracePeriodDays} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand/40 focus:border-brand" />
        </div>
      </div>

      {error && <p className="text-red-600 text-sm">{error}</p>}
      {saved && <p className="text-brand-dark text-sm font-medium">✓ Saved successfully.</p>}

      <div className="flex items-center justify-between">
        <button type="submit" disabled={loading} className="bg-brand hover:bg-brand-dark text-white px-5 py-2 rounded-lg font-semibold text-sm disabled:opacity-50 transition-colors">
          {loading ? "Saving…" : "Save Changes"}
        </button>
        <button type="button" onClick={handleDelete} className="text-red-400 text-sm hover:text-red-600 transition-colors">
          Delete client
        </button>
      </div>
    </form>
  );
}
