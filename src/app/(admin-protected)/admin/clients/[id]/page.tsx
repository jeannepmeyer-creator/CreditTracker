import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import TransactionForm from "@/components/admin/TransactionForm";
import TransactionList from "@/components/admin/TransactionList";
import MilestoneForm from "@/components/admin/MilestoneForm";
import MilestoneList from "@/components/admin/MilestoneList";
import CopyLinkButton from "@/components/admin/CopyLinkButton";
import ClientEditForm from "@/components/admin/ClientEditForm";
import { CreditBar } from "@/components/CreditBar";
import { StatusBadge } from "@/components/StatusBadge";
import { getGracePeriodEnd, getStatus } from "@/lib/credits";

export default async function ClientDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const client = await prisma.client.findUnique({
    where: { id },
    include: {
      transactions: { orderBy: { date: "desc" } },
      milestones: { orderBy: { dueDate: "asc" } },
    },
  });

  if (!client) notFound();

  const used = client.transactions.reduce((s, t) => s + t.creditsUsed, 0);
  const remaining = client.totalCredits - used;
  const status = getStatus(new Date(client.endDate), client.gracePeriodDays);
  const gracePeriodEnd = getGracePeriodEnd(
    new Date(client.endDate),
    client.gracePeriodDays
  );

  const clientUrl = `${process.env.NEXT_PUBLIC_BASE_URL ?? ""}/client/${client.token}`;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <a
          href="/admin"
          className="text-gray-400 text-sm hover:text-brand transition-colors"
        >
          ← All clients
        </a>
        <div className="flex items-start justify-between mt-3">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{client.company}</h1>
            <p className="text-gray-500">{client.name} · {client.email}</p>
          </div>
          <StatusBadge status={status} />
        </div>
      </div>

      {/* Credit summary */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-semibold text-gray-900">Credit Summary</h2>
          <div className="text-right">
            <span className="text-3xl font-bold text-brand">{remaining}</span>
            <span className="text-gray-400 text-sm ml-1">of {client.totalCredits} remaining</span>
          </div>
        </div>
        <CreditBar used={used} total={client.totalCredits} />

        <div className="grid grid-cols-2 gap-4 mt-5 text-sm text-gray-600">
          <div className="bg-gray-50 rounded-xl p-3">
            <span className="text-xs text-gray-400 block mb-0.5">Subscription period</span>
            {new Date(client.startDate).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
            {" – "}
            {new Date(client.endDate).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </div>
          <div className="bg-gray-50 rounded-xl p-3">
            <span className="text-xs text-gray-400 block mb-0.5">Grace period ends</span>
            {gracePeriodEnd.toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </div>
        </div>
      </div>

      {/* Shareable client link */}
      <div className="bg-brand/5 border border-brand/20 rounded-xl p-4">
        <p className="text-sm font-semibold text-brand-dark mb-2">
          Client Portal Link
        </p>
        <div className="flex items-center gap-2">
          <code className="text-xs text-gray-600 bg-white border border-gray-200 rounded-lg px-3 py-2 flex-1 truncate">
            {clientUrl}
          </code>
          <CopyLinkButton url={clientUrl} />
        </div>
      </div>

      {/* Edit client details */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        <h2 className="text-base font-semibold text-gray-900 mb-4">
          Edit Client Details
        </h2>
        <ClientEditForm
          client={{
            id: client.id,
            name: client.name,
            email: client.email,
            company: client.company,
            totalCredits: client.totalCredits,
            startDate: client.startDate.toISOString().split("T")[0],
            endDate: client.endDate.toISOString().split("T")[0],
            gracePeriodDays: client.gracePeriodDays,
          }}
        />
      </div>

      {/* Payment milestones */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        <h2 className="text-base font-semibold text-gray-900 mb-4">
          Payment Milestones
        </h2>
        <div className="mb-5">
          <MilestoneList
            clientId={client.id}
            milestones={client.milestones.map((m) => ({
              id: m.id,
              label: m.label,
              amount: m.amount,
              dueDate: m.dueDate.toISOString(),
              paidDate: m.paidDate ? m.paidDate.toISOString() : null,
              notes: m.notes,
            }))}
          />
        </div>
        <div className="border-t border-gray-100 pt-5">
          <p className="text-sm font-medium text-gray-700 mb-3">Add Milestone</p>
          <MilestoneForm clientId={client.id} />
        </div>
      </div>

      {/* Log credit usage */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        <h2 className="text-base font-semibold text-gray-900 mb-4">
          Log Credit Usage
        </h2>
        <TransactionForm clientId={client.id} />
      </div>

      {/* Usage history */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        <h2 className="text-base font-semibold text-gray-900 mb-4">
          Usage History
        </h2>
        <TransactionList
          clientId={client.id}
          transactions={client.transactions.map((t) => ({
            id: t.id,
            description: t.description,
            creditsUsed: t.creditsUsed,
            date: t.date.toISOString(),
          }))}
        />
      </div>
    </div>
  );
}
