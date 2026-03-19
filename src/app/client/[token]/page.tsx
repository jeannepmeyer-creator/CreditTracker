import { prisma } from "@/lib/prisma";
import { getTier } from "@/lib/tiers";

function creditBadge(remaining: number, total: number) {
  if (total === 0) return { bg: "bg-slate-100", text: "text-slate-600", label: "No credits" };
  const pct = remaining / total;
  if (pct > 0.5) return { bg: "bg-green-100", text: "text-green-700", label: "Healthy" };
  if (pct > 0.2) return { bg: "bg-yellow-100", text: "text-yellow-700", label: "Running low" };
  return { bg: "bg-red-100", text: "text-red-700", label: "Almost out" };
}

export default async function ClientDashboardPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;

  const client = await prisma.client.findUnique({
    where: { token },
    include: { transactions: { orderBy: { date: "desc" } } },
  });

  if (!client) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-2xl font-bold text-slate-300">404</p>
          <p className="text-slate-400 mt-2">Dashboard not found.</p>
        </div>
      </div>
    );
  }

  const used = client.transactions.reduce((s, t) => s + t.creditsUsed, 0);
  const remaining = client.totalCredits - used;
  const tier = getTier(client.tier);
  const badge = creditBadge(remaining, client.totalCredits);

  const pct = client.totalCredits > 0 ? Math.max(0, Math.min(100, (remaining / client.totalCredits) * 100)) : 0;

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 px-6 py-5">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold tracking-widest text-teal-600 uppercase">Authentic Intel</p>
            <h1 className="text-lg font-bold text-slate-900 mt-0.5">On-Call Subscription Dashboard</h1>
          </div>
          <div className="text-right">
            <div className="font-semibold text-slate-900">{client.name}</div>
            {client.company && <div className="text-slate-400 text-sm">{client.company}</div>}
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-6 py-8 space-y-6">
        {/* Credit summary card */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <div className="text-sm text-slate-500 font-medium">
                {client.tier}-Credit Plan{tier ? ` · ${tier.duration}` : ""}
              </div>
              <div className="text-sm text-slate-400 mt-0.5">
                {new Date(client.startDate).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
                {" – "}
                {new Date(client.endDate).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
              </div>
            </div>
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${badge.bg} ${badge.text}`}>
              {badge.label}
            </span>
          </div>

          {/* Big number */}
          <div className="flex items-end gap-3 mb-4">
            <div className={`text-6xl font-bold ${badge.text}`}>{remaining}</div>
            <div className="text-slate-400 text-sm pb-3">credits remaining</div>
          </div>

          {/* Progress bar */}
          <div className="h-2 bg-slate-100 rounded-full overflow-hidden mb-3">
            <div
              className={`h-2 rounded-full transition-all ${pct > 50 ? "bg-green-400" : pct > 20 ? "bg-yellow-400" : "bg-red-400"}`}
              style={{ width: `${pct}%` }}
            />
          </div>

          <div className="flex justify-between text-xs text-slate-400">
            <span>{used} used</span>
            <span>{client.totalCredits} total purchased</span>
          </div>
        </div>

        {/* Usage history */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6">
          <h2 className="text-base font-semibold text-slate-900 mb-4">Usage History</h2>

          {client.transactions.length === 0 ? (
            <p className="text-slate-400 text-sm">No credits used yet. Ready when you are!</p>
          ) : (
            <table className="w-full text-sm">
              <thead className="border-b border-slate-200">
                <tr>
                  <th className="text-left pb-3 font-medium text-slate-500">Date</th>
                  <th className="text-left pb-3 font-medium text-slate-500">Description</th>
                  <th className="text-right pb-3 font-medium text-slate-500">Credits Used</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {client.transactions.map((t) => (
                  <tr key={t.id}>
                    <td className="py-3 text-slate-400 whitespace-nowrap pr-4">
                      {new Date(t.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                    </td>
                    <td className="py-3 text-slate-800">{t.description}</td>
                    <td className="py-3 text-right font-medium text-slate-900">{t.creditsUsed}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <p className="text-center text-xs text-slate-300">
          Questions? Reach out to Jeanne at <span className="text-slate-400">authentic-intel.co</span>
        </p>
      </main>
    </div>
  );
}
