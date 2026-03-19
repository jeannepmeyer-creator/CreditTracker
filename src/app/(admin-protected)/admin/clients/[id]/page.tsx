import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import ClientEditForm from "@/components/admin/ClientEditForm";
import TransactionForm from "@/components/admin/TransactionForm";
import TransactionList from "@/components/admin/TransactionList";
import CopyLinkButton from "@/components/admin/CopyLinkButton";

export default async function ClientDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const client = await prisma.client.findUnique({
    where: { id },
    include: { transactions: { orderBy: { date: "desc" } } },
  });

  if (!client) notFound();

  const used = client.transactions.reduce((s, t) => s + t.creditsUsed, 0);
  const remaining = client.totalCredits - used;

  const clientUrl = `${process.env.NEXT_PUBLIC_BASE_URL ?? ""}/client/${client.token}`;

  return (
    <div className="space-y-8">
      <div>
        <a href="/admin" className="text-slate-400 text-sm hover:text-slate-600">← Back to clients</a>
        <div className="flex items-start justify-between mt-2">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">{client.name}</h1>
            {client.company && <p className="text-slate-500">{client.company}</p>}
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-teal-600">{remaining}</div>
            <div className="text-slate-400 text-sm">of {client.totalCredits} credits remaining</div>
          </div>
        </div>
      </div>

      {/* Shareable link */}
      <div className="bg-teal-50 border border-teal-200 rounded-xl p-4">
        <p className="text-sm font-medium text-teal-800 mb-2">Client Shareable Link</p>
        <div className="flex items-center gap-2">
          <code className="text-xs text-teal-700 bg-white border border-teal-200 rounded px-3 py-1.5 flex-1 truncate">
            {clientUrl}
          </code>
          <CopyLinkButton url={clientUrl} />
        </div>
      </div>

      {/* Client info & edit */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6">
        <h2 className="text-base font-semibold text-slate-900 mb-4">Client Details</h2>
        <ClientEditForm client={{
          id: client.id,
          name: client.name,
          email: client.email,
          company: client.company ?? "",
          tier: client.tier,
          totalCredits: client.totalCredits,
          startDate: client.startDate.toISOString().split("T")[0],
          endDate: client.endDate.toISOString().split("T")[0],
        }} />
      </div>

      {/* Log usage */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6">
        <h2 className="text-base font-semibold text-slate-900 mb-4">Log Credit Usage</h2>
        <TransactionForm clientId={client.id} />
      </div>

      {/* Transaction history */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6">
        <h2 className="text-base font-semibold text-slate-900 mb-4">Usage History</h2>
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
