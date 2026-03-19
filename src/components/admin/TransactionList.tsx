"use client";

import { useRouter } from "next/navigation";

type Transaction = {
  id: string;
  description: string;
  creditsUsed: number;
  date: string;
};

export default function TransactionList({
  clientId,
  transactions,
}: {
  clientId: string;
  transactions: Transaction[];
}) {
  const router = useRouter();

  async function handleDelete(transactionId: string) {
    if (!confirm("Remove this credit entry?")) return;
    await fetch(`/api/admin/clients/${clientId}/transactions`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ transactionId }),
    });
    router.refresh();
  }

  if (transactions.length === 0) {
    return <p className="text-slate-400 text-sm">No usage logged yet.</p>;
  }

  return (
    <table className="w-full text-sm">
      <thead className="border-b border-slate-200">
        <tr>
          <th className="text-left py-2 font-medium text-slate-600">Date</th>
          <th className="text-left py-2 font-medium text-slate-600">Description</th>
          <th className="text-right py-2 font-medium text-slate-600">Credits</th>
          <th className="py-2"></th>
        </tr>
      </thead>
      <tbody className="divide-y divide-slate-100">
        {transactions.map((t) => (
          <tr key={t.id}>
            <td className="py-3 text-slate-500 whitespace-nowrap pr-4">
              {new Date(t.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
            </td>
            <td className="py-3 text-slate-800">{t.description}</td>
            <td className="py-3 text-right font-medium text-slate-900">{t.creditsUsed}</td>
            <td className="py-3 text-right">
              <button
                onClick={() => handleDelete(t.id)}
                className="text-slate-300 hover:text-red-500 transition-colors text-xs"
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
