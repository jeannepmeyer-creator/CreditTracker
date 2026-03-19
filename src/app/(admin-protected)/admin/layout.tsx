import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { isValidSession } from "@/lib/auth";
import LogoutButton from "@/components/admin/LogoutButton";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const session = cookieStore.get("admin_session")?.value;

  if (!isValidSession(session)) {
    redirect("/admin/login");
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
        <div>
          <a href="/admin" className="text-lg font-bold text-slate-900 hover:text-teal-700 transition-colors">
            Authentic Intel
          </a>
          <span className="text-slate-400 text-sm ml-2">Credit Tracker</span>
        </div>
        <div className="flex items-center gap-4">
          <a href="/admin/clients/new" className="text-sm bg-teal-600 text-white px-4 py-1.5 rounded-lg hover:bg-teal-700 transition-colors font-medium">
            + New Client
          </a>
          <LogoutButton />
        </div>
      </header>
      <main className="max-w-5xl mx-auto px-6 py-8">{children}</main>
    </div>
  );
}
