import { prisma } from "@/lib/prisma";
import Link from "next/link";

function creditColor(remaining: number, total: number) {
  if (total === 0) return "bg-slate-100 text-slate-600";
  const pct = remaining / total;
  if (pct > 0.5) return "bg-green-100 text-green-700";
  if (pct > 0.2) return "bg-yellow-100 text-yellow-700";
  return "bg-red-100 text-red-700";
}

export default async function AdminDashboardPage() {
  const clients = await prisma.client.findMany({
    include: { transactions: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Clients</h1>
        <p className="text-slate-500 text-sm mt-1">{clients.length} client{clients.length !== 1 ? "s" : ""}</p>
      </div>

      {clients.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
          <p className="text-slate-400 mb-4">No clients yet.</p>
          <Link href="/admin/clients/new" className="text-teal-600 font-medium hover:underline">
            Add your first client →
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="text-left px-6 py-3 font-medium text-slate-600">Client</th>
                <th className="text-left px-6 py-3 font-medium text-slate-600">Plan</th>
                <th className="text-right px-6 py-3 font-medium text-slate-600">Credits</th>
                <th className="text-right px-6 py-3 font-medium text-slate-600">Remaining</th>
                <th className="text-right px-6 py-3 font-medium text-slate-600">Program End</th>
                <th className="px-6 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {clients.map((client) => {
                const used = client.transactions.reduce((s, t) => s + t.creditsUsed, 0);
                const remaining = client.totalCredits - used;
                return (
                  <tr key={client.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-medium text-slate-900">{client.name}</div>
                      {client.company && <div className="text-slate-400 text-xs">{client.company}</div>}
                    </td>
                    <td className="px-6 py-4 text-slate-600">{client.tier} credits</td>
                    <td className="px-6 py-4 text-right text-slate-600">
                      {used} / {client.totalCredits}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${creditColor(remaining, client.totalCredits)}`}>
                        {remaining} left
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right text-slate-500">
                      {new Date(client.endDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link href={`/admin/clients/${client.id}`} className="text-teal-600 hover:underline font-medium">
                        View →
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
