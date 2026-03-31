"use client";

import { useRouter } from "next/navigation";

type Milestone = {
  id: string;
  label: string;
  amount: number;
  dueDate: string;
  paidDate: string | null;
  notes: string | null;
};

export default function MilestoneList({
  clientId,
  milestones,
}: {
  clientId: string;
  milestones: Milestone[];
}) {
  const router = useRouter();

  async function togglePaid(m: Milestone) {
    const paidDate = m.paidDate ? null : new Date().toISOString();
    await fetch(`/api/admin/clients/${clientId}/milestones`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ milestoneId: m.id, paidDate }),
    });
    router.refresh();
  }

  async function handleDelete(milestoneId: string) {
    if (!confirm("Remove this payment milestone?")) return;
    await fetch(`/api/admin/clients/${clientId}/milestones`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ milestoneId }),
    });
    router.refresh();
  }

  if (milestones.length === 0) {
    return <p className="text-gray-400 text-sm italic">No milestones added yet.</p>;
  }

  return (
    <table className="w-full text-sm">
      <thead>
        <tr className="border-b border-gray-200">
          <th className="text-left py-2 font-semibold text-gray-600">Milestone</th>
          <th className="text-right py-2 font-semibold text-gray-600">Amount</th>
          <th className="text-left py-2 font-semibold text-gray-600 pl-4">Due</th>
          <th className="text-left py-2 font-semibold text-gray-600 pl-4">Status</th>
          <th className="py-2 w-16"></th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-100">
        {milestones.map((m) => (
          <tr key={m.id} className="hover:bg-gray-50">
            <td className="py-3 text-gray-800 font-medium">{m.label}</td>
            <td className="py-3 text-right text-gray-700">
              ${m.amount.toLocaleString()}
            </td>
            <td className="py-3 text-gray-500 pl-4 whitespace-nowrap">
              {new Date(m.dueDate).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </td>
            <td className="py-3 pl-4">
              <button
                onClick={() => togglePaid(m)}
                className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold transition-colors ${
                  m.paidDate
                    ? "bg-brand/15 text-brand-dark hover:bg-brand/25"
                    : "bg-amber-50 text-amber-700 hover:bg-amber-100"
                }`}
              >
                {m.paidDate ? "✓ Paid" : "Pending"}
              </button>
            </td>
            <td className="py-3 text-right">
              <button
                onClick={() => handleDelete(m.id)}
                className="text-gray-300 hover:text-red-500 transition-colors text-xs"
              >
                Remove
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
