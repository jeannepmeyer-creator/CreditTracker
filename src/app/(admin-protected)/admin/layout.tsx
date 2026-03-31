import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { isValidSession } from "@/lib/auth";
import LogoutButton from "@/components/admin/LogoutButton";
import { AuthenticIntelLogo } from "@/components/Logo";

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
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <a href="/admin" className="flex items-center gap-3 group">
            <AuthenticIntelLogo className="h-8 w-auto" />
            <span className="text-sm text-gray-400 font-medium group-hover:text-brand transition-colors">
              Credit Tracker
            </span>
          </a>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-xs bg-brand/10 text-brand-dark px-2.5 py-1 rounded-full font-semibold">
            Admin
          </span>
          <a
            href="/admin/clients/new"
            className="text-sm bg-brand hover:bg-brand-dark text-white px-4 py-1.5 rounded-lg font-semibold transition-colors"
          >
            + New Client
          </a>
          <LogoutButton />
        </div>
      </header>
      <main className="max-w-5xl mx-auto px-6 py-8">{children}</main>
    </div>
  );
}
