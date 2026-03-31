import ClientForm from "@/components/admin/ClientForm";

export default function NewClientPage() {
  return (
    <div>
      <div className="mb-6">
        <a href="/admin" className="text-gray-400 text-sm hover:text-brand transition-colors">
          ← Back to clients
        </a>
        <h1 className="text-2xl font-bold text-gray-900 mt-2">Add New Client</h1>
      </div>
      <ClientForm />
    </div>
  );
}
