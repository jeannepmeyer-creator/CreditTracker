import ClientForm from "@/components/admin/ClientForm";

export default function NewClientPage() {
  return (
    <div>
      <div className="mb-6">
        <a href="/admin" className="text-slate-400 text-sm hover:text-slate-600">← Back to clients</a>
        <h1 className="text-2xl font-bold text-slate-900 mt-2">Add New Client</h1>
      </div>
      <ClientForm />
    </div>
  );
}
