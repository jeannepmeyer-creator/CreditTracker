import { prisma } from "@/lib/prisma";
import { getGracePeriodEnd, getStatus, getCreditStatus } from "@/lib/credits";
import { StatusBadge } from "@/components/StatusBadge";
import { CreditBar } from "@/components/CreditBar";
import { AuthenticIntelLogo } from "@/components/Logo";

export default async function ClientDashboardPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;

  const client = await prisma.client.findUnique({
    where: { token },
    include: {
      transactions: { orderBy: { date: "desc" } },
      milestones: { orderBy: { dueDate: "asc" } },
    },
  });

  if (!client) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-4xl font-bold text-gray-200">404</p>
          <p className="text-gray-400 mt-2">Dashboard not found.</p>
        </div>
      </div>
    );
  }

  const used = client.transactions.reduce((s, t) => s + t.creditsUsed, 0);
  const remaining = client.totalCredits - used;
  const status = getStatus(new Date(client.endDate), client.gracePeriodDays);
  const creditStatus = getCreditStatus(used, client.totalCredits);
  const gracePeriodEnd = getGracePeriodEnd(
    new Date(client.endDate),
    client.gracePeriodDays
  );

  const bigNumberColor =
    creditStatus === "healthy"
      ? "text-brand"
      : creditStatus === "low"
      ? "text-amber-500"
      : "text-red-500";

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-5">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <AuthenticIntelLogo className="h-9 w-auto" />
          <div className="text-right">
            <div className="font-semibold text-gray-900">{client.company}</div>
            <div className="text-gray-400 text-sm">On-Call Subscription</div>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-6 py-8 space-y-5">
        {/* Credit summary */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <div className="flex items-start justify-between mb-5">
            <div>
              <h1 className="text-lg font-bold text-gray-900">
                Credit Balance
              </h1>
              <p className="text-gray-400 text-sm mt-0.5">
                {new Date(client.startDate).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
                {" – "}
                {new Date(client.endDate).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </p>
            </div>
            <StatusBadge status={status} />
          </div>

          {/* Big number */}
          <div className="flex items-end gap-2 mb-5">
            <span className={`text-7xl font-bold leading-none ${bigNumberColor}`}>
              {remaining}
            </span>
            <span className="text-gray-400 text-base pb-2">
              credits remaining
            </span>
          </div>

          <CreditBar used={used} total={client.totalCredits} />

          {/* Dates */}
          <div className="grid grid-cols-2 gap-3 mt-5 text-sm">
            <div className="bg-gray-50 rounded-xl p-3">
              <span className="text-xs text-gray-400 block mb-0.5">
                Subscription ends
              </span>
              <span className="font-medium text-gray-700">
                {new Date(client.endDate).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
            </div>
            <div className="bg-gray-50 rounded-xl p-3">
              <span className="text-xs text-gray-400 block mb-0.5">
                Grace period ends
              </span>
              <span className="font-medium text-gray-700">
                {gracePeriodEnd.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
            </div>
          </div>
        </div>

        {/* Payment status */}
        {client.milestones.length > 0 && (
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <h2 className="text-base font-bold text-gray-900 mb-4">
              Payment Status
            </h2>
            <div className="space-y-3">
              {client.milestones.map((m) => (
                <div
                  key={m.id}
                  className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0"
                >
                  <div>
                    <span className="font-medium text-gray-800 text-sm">
                      {m.label}
                    </span>
                    <span className="text-gray-400 text-xs ml-2">
                      due{" "}
                      {new Date(m.dueDate).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-semibold text-gray-700">
                      ${m.amount.toLocaleString()}
                    </span>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                        m.paidDate
                          ? "bg-brand/15 text-brand-dark"
                          : "bg-amber-50 text-amber-700 border border-amber-200"
                      }`}
                    >
                      {m.paidDate ? "✓ Paid" : "Pending"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Usage history */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <h2 className="text-base font-bold text-gray-900 mb-4">
            Usage History
          </h2>

          {client.transactions.length === 0 ? (
            <p className="text-gray-400 text-sm italic">
              No credits used yet. Ready when you are!
            </p>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left pb-3 font-semibold text-gray-500">
                    Date
                  </th>
                  <th className="text-left pb-3 font-semibold text-gray-500">
                    Description
                  </th>
                  <th className="text-right pb-3 font-semibold text-gray-500">
                    Credits
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {client.transactions.map((t) => (
                  <tr key={t.id}>
                    <td className="py-3 text-gray-400 whitespace-nowrap pr-4">
                      {new Date(t.date).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </td>
                    <td className="py-3 text-gray-700">{t.description}</td>
                    <td className="py-3 text-right font-semibold text-gray-900">
                      {t.creditsUsed}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <p className="text-center text-xs text-gray-300 pb-4">
          Questions? Contact Jeanne at{" "}
          <span className="text-gray-400">jeanne@authentic-intel.co</span>
        </p>
      </main>
    </div>
  );
}
