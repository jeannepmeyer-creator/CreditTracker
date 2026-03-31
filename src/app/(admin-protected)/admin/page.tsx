import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { getGracePeriodEnd, getStatus } from "@/lib/credits";
import { StatusBadge } from "@/components/StatusBadge";
import { CreditBar } from "@/components/CreditBar";

export default async function AdminDashboardPage() {
  const clients = await prisma.client.findMany({
    include: {
      transactions: true,
      milestones: { orderBy: { dueDate: "asc" } },
    },
    orderBy: { createdAt: "asc" },
  });

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Client Dashboard</h1>
        <p className="text-gray-500 text-sm mt-1">
          {clients.length} active client{clients.length !== 1 ? "s" : ""}
        </p>
      </div>

      {clients.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">
          <p className="text-gray-400 mb-4">No clients yet.</p>
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-1 lg:grid-cols-2">
          {clients.map((client) => {
            const used = client.transactions.reduce(
              (s, t) => s + t.creditsUsed,
              0
            );
            const status = getStatus(
              new Date(client.endDate),
              client.gracePeriodDays
            );
            const gracePeriodEnd = getGracePeriodEnd(
              new Date(client.endDate),
              client.gracePeriodDays
            );
            const unpaidCount = client.milestones.filter(
              (m) => !m.paidDate
            ).length;

            return (
              <Link
                key={client.id}
                href={`/admin/clients/${client.id}`}
                className="block bg-white rounded-2xl border border-gray-200 p-6 hover:border-brand/50 hover:shadow-md transition-all group"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h2 className="font-bold text-gray-900 text-lg group-hover:text-brand transition-colors">
                      {client.company}
                    </h2>
                    <p className="text-gray-500 text-sm">{client.name}</p>
                  </div>
                  <StatusBadge status={status} />
                </div>

                <div className="mb-4">
                  <CreditBar used={used} total={client.totalCredits} />
                </div>

                <div className="grid grid-cols-2 gap-3 text-sm text-gray-600 border-t border-gray-100 pt-4">
                  <div>
                    <span className="text-xs text-gray-400 block">Subscription ends</span>
                    {new Date(client.endDate).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </div>
                  <div>
                    <span className="text-xs text-gray-400 block">Grace period ends</span>
                    {gracePeriodEnd.toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </div>
                  {unpaidCount > 0 && (
                    <div className="col-span-2">
                      <span className="inline-flex items-center gap-1 text-xs bg-amber-50 text-amber-700 border border-amber-200 px-2 py-0.5 rounded-full font-medium">
                        {unpaidCount} payment{unpaidCount !== 1 ? "s" : ""} pending
                      </span>
                    </div>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
